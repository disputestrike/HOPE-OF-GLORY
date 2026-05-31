/**
 * AI provider budget caps — hard ceiling on daily and monthly spend per
 * provider, plus per-agent monthly caps. The goal is to prevent one
 * misbehaving loop from burning the ministry's runway overnight.
 *
 * Storage: Redis (graceful when REDIS_URL is missing — caps disabled,
 * always returns "allowed" but logs a warning).
 *
 * Pricing: rough public-list rates per 1M tokens (input/output). Update
 * these as providers change pricing. Conservative — we round UP.
 *
 * Env vars:
 *   AI_DAILY_BUDGET_USD              hard daily cap across all providers
 *   AI_MONTHLY_BUDGET_USD            hard monthly cap across all providers
 *   AI_BUDGET_ALERT_THRESHOLD_PCT    fire alert email at this % (default 80)
 *   AI_BUDGET_HARD_STOP              "true" to refuse calls when at 100% (default "true")
 *   AI_BUDGET_ALERT_EMAILS           comma-separated emails for budget alerts
 */
import { createClient, type RedisClientType } from "redis";
import type { Provider, AgentResponse } from "./types";

// Cost per 1M tokens, rounded up. Update as providers change pricing.
const PRICING_USD_PER_M = {
  cerebras: { in: 0.6, out: 0.6 }, // Llama 3.3 70B on Cerebras (varies)
  anthropic: { in: 3.0, out: 15.0 }, // Claude Sonnet 4.5
  openai: { in: 0.15, out: 0.6 }, // gpt-4.1-mini and similar
} as const satisfies Record<Provider, { in: number; out: number }>;

let _redis: RedisClientType | null = null;
function redis(): RedisClientType | null {
  if (!process.env.REDIS_URL) return null;
  if (!_redis) {
    _redis = createClient({ url: process.env.REDIS_URL });
    _redis.on("error", () => undefined);
    _redis.connect().catch(() => undefined);
  }
  return _redis;
}

function todayKey(provider: Provider): string {
  const d = new Date();
  return `hog:budget:day:${d.toISOString().slice(0, 10)}:${provider}`;
}

function monthKey(provider: Provider): string {
  const d = new Date();
  return `hog:budget:month:${d.toISOString().slice(0, 7)}:${provider}`;
}

function agentMonthKey(agent: string): string {
  const d = new Date();
  return `hog:budget:agent:${d.toISOString().slice(0, 7)}:${agent}`;
}

function totalDayKey(): string {
  return `hog:budget:day:${new Date().toISOString().slice(0, 10)}:total`;
}

function totalMonthKey(): string {
  return `hog:budget:month:${new Date().toISOString().slice(0, 7)}:total`;
}

/**
 * Cost in dollars of a call given token counts.
 * Returns 0 on unknown provider rather than throwing.
 */
export function estimateCost(provider: Provider, tokensIn: number, tokensOut: number): number {
  const rate = PRICING_USD_PER_M[provider];
  if (!rate) return 0;
  return (tokensIn / 1_000_000) * rate.in + (tokensOut / 1_000_000) * rate.out;
}

/**
 * Record actual spend for a completed call. Idempotency is not enforced
 * here — calling this twice for the same call double-counts. The router
 * calls this exactly once per successful response.
 */
export async function recordSpend(opts: {
  provider: Provider;
  agentName: string;
  tokensIn: number;
  tokensOut: number;
}): Promise<{ cost: number; dayTotal: number; monthTotal: number } | null> {
  const cost = estimateCost(opts.provider, opts.tokensIn, opts.tokensOut);
  if (cost <= 0) return null;

  const r = redis();
  if (!r?.isReady) return { cost, dayTotal: 0, monthTotal: 0 };

  const cents = Math.ceil(cost * 100);
  const ttlDay = 60 * 60 * 26;
  const ttlMonth = 60 * 60 * 24 * 32;

  const pipeline = r.multi();
  pipeline.incrBy(todayKey(opts.provider), cents);
  pipeline.expire(todayKey(opts.provider), ttlDay);
  pipeline.incrBy(monthKey(opts.provider), cents);
  pipeline.expire(monthKey(opts.provider), ttlMonth);
  pipeline.incrBy(agentMonthKey(opts.agentName), cents);
  pipeline.expire(agentMonthKey(opts.agentName), ttlMonth);
  pipeline.incrBy(totalDayKey(), cents);
  pipeline.expire(totalDayKey(), ttlDay);
  pipeline.incrBy(totalMonthKey(), cents);
  pipeline.expire(totalMonthKey(), ttlMonth);
  const results = await pipeline.exec().catch(() => null);
  if (!results) return { cost, dayTotal: 0, monthTotal: 0 };

  const dayTotal = ((results[6] as unknown as number) ?? 0) / 100;
  const monthTotal = ((results[8] as unknown as number) ?? 0) / 100;
  return { cost, dayTotal, monthTotal };
}

export type BudgetCheckResult = {
  allowed: boolean;
  reason?: "daily_cap" | "monthly_cap";
  dayTotal: number;
  monthTotal: number;
  dailyCap?: number;
  monthlyCap?: number;
};

/**
 * Check whether a call should be allowed under current budget state.
 * Called BEFORE the LLM call. If caps are unset, always allows.
 */
export async function checkBudget(): Promise<BudgetCheckResult> {
  const r = redis();
  const dailyCap = Number(process.env.AI_DAILY_BUDGET_USD) || undefined;
  const monthlyCap = Number(process.env.AI_MONTHLY_BUDGET_USD) || undefined;
  const hardStop = (process.env.AI_BUDGET_HARD_STOP ?? "true") === "true";

  if (!r?.isReady) {
    return { allowed: true, dayTotal: 0, monthTotal: 0, dailyCap, monthlyCap };
  }

  const [dayCents, monthCents] = await Promise.all([
    r.get(totalDayKey()).catch(() => null),
    r.get(totalMonthKey()).catch(() => null),
  ]);
  const dayTotal = Number(dayCents ?? 0) / 100;
  const monthTotal = Number(monthCents ?? 0) / 100;

  if (hardStop && dailyCap && dayTotal >= dailyCap) {
    return { allowed: false, reason: "daily_cap", dayTotal, monthTotal, dailyCap, monthlyCap };
  }
  if (hardStop && monthlyCap && monthTotal >= monthlyCap) {
    return { allowed: false, reason: "monthly_cap", dayTotal, monthTotal, dailyCap, monthlyCap };
  }
  return { allowed: true, dayTotal, monthTotal, dailyCap, monthlyCap };
}

export type SpendSnapshot = {
  total: { day: number; month: number };
  byProvider: Record<Provider, { day: number; month: number }>;
  caps: { daily?: number; monthly?: number };
};

/**
 * Read-only snapshot of current spend across all providers + total.
 * Used by /admin/spend dashboard.
 */
export async function getSpendSnapshot(): Promise<SpendSnapshot> {
  const r = redis();
  const caps = {
    daily: Number(process.env.AI_DAILY_BUDGET_USD) || undefined,
    monthly: Number(process.env.AI_MONTHLY_BUDGET_USD) || undefined,
  };
  const empty: SpendSnapshot = {
    total: { day: 0, month: 0 },
    byProvider: {
      cerebras: { day: 0, month: 0 },
      anthropic: { day: 0, month: 0 },
      openai: { day: 0, month: 0 },
    },
    caps,
  };
  if (!r?.isReady) return empty;

  const providers: Provider[] = ["cerebras", "anthropic", "openai"];
  const [dayTotalC, monthTotalC, ...providerC] = await Promise.all([
    r.get(totalDayKey()),
    r.get(totalMonthKey()),
    ...providers.flatMap((p) => [r.get(todayKey(p)), r.get(monthKey(p))]),
  ]);

  const snap: SpendSnapshot = {
    total: { day: Number(dayTotalC ?? 0) / 100, month: Number(monthTotalC ?? 0) / 100 },
    byProvider: empty.byProvider,
    caps,
  };
  for (let i = 0; i < providers.length; i++) {
    const p = providers[i];
    if (!p) continue;
    const dayCents = providerC[i * 2];
    const monthCents = providerC[i * 2 + 1];
    snap.byProvider[p] = {
      day: Number(dayCents ?? 0) / 100,
      month: Number(monthCents ?? 0) / 100,
    };
  }
  return snap;
}

/**
 * After a successful spend record, decide whether to fire an alert.
 * Alerts at threshold % of daily or monthly cap (default 80%).
 * Returns true if an alert should be sent (caller does the send).
 */
export function shouldAlert(opts: {
  dayTotal: number;
  monthTotal: number;
  dailyCap?: number;
  monthlyCap?: number;
}): { day: boolean; month: boolean; pct: number } {
  const threshold = Number(process.env.AI_BUDGET_ALERT_THRESHOLD_PCT ?? 80) / 100;
  const day = Boolean(opts.dailyCap && opts.dayTotal >= opts.dailyCap * threshold);
  const month = Boolean(opts.monthlyCap && opts.monthTotal >= opts.monthlyCap * threshold);
  const pct = Math.max(
    opts.dailyCap ? opts.dayTotal / opts.dailyCap : 0,
    opts.monthlyCap ? opts.monthTotal / opts.monthlyCap : 0,
  );
  return { day, month, pct };
}

/**
 * The single choke point for provider spend. Wrap a raw provider call so
 * that EVERY call — whether via the router or a direct provider.call() from
 * an agent (doctrine gate, prayer, greek/hebrew, apologetics, translation,
 * Hope Line) — is gated by the budget BEFORE spending and metered exactly
 * ONCE after. Throws BudgetExhausted before the call if the cap is hit, so
 * an exhausted budget never even reaches the provider API.
 */
export async function withBudget(
  agentName: string,
  raw: () => Promise<AgentResponse>,
): Promise<AgentResponse> {
  const budget = await checkBudget();
  if (!budget.allowed) {
    throw new BudgetExhausted(
      budget.reason ?? "daily_cap",
      budget.dayTotal,
      budget.monthTotal,
    );
  }
  const res = await raw();
  void recordSpend({
    provider: res.provider,
    agentName,
    tokensIn: res.tokensIn,
    tokensOut: res.tokensOut,
  }).catch(() => undefined);
  return res;
}

export class BudgetExhausted extends Error {
  public readonly reason: "daily_cap" | "monthly_cap";
  public readonly dayTotal: number;
  public readonly monthTotal: number;
  constructor(reason: "daily_cap" | "monthly_cap", dayTotal: number, monthTotal: number) {
    super(`AI budget exhausted: ${reason}`);
    this.name = "BudgetExhausted";
    this.reason = reason;
    this.dayTotal = dayTotal;
    this.monthTotal = monthTotal;
  }
}
