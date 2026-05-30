/**
 * Agent Orchestrator — the conductor of the agent workshop.
 *
 * Responsibility: take a high-level work request (e.g. "generate today's sermon"),
 * decompose into agent calls in the correct sequence, gate at each step on
 * Doctrine Agent approval, and log every step to agent_runs.
 *
 * This is the Phase 1 skeleton. Phase 2 adds the full sermon pipeline.
 * Phase 3 adds the Ask Hope / Prayer chat flows.
 */
import { route, type AgentRequest } from "@hog/ai";
import { loadAgent } from "@hog/prompts";
import { db, schema } from "@hog/db";
import { runDoctrineGate } from "./agents/doctrine";
import { createHash } from "node:crypto";

export type OrchestrationLog = {
  step: string;
  agent: string;
  durationMs: number;
  status: "ok" | "blocked" | "revise" | "error";
  notes?: string;
};

export type OrchestrationResult = {
  success: boolean;
  output: string;
  doctrineVerdict?: Awaited<ReturnType<typeof runDoctrineGate>>;
  log: OrchestrationLog[];
};

/**
 * Generic agent invocation with logging + optional doctrine gate.
 */
export async function invokeAgent(opts: {
  agentSlug: string;
  taskType: AgentRequest["taskType"];
  userInput: string;
  context?: string;
  gate?: boolean;
}): Promise<OrchestrationResult> {
  const log: OrchestrationLog[] = [];
  const start = Date.now();
  const agent = await loadAgent(opts.agentSlug);

  // 1. Call the agent through the model router.
  const req: AgentRequest = {
    taskType: opts.taskType,
    agentName: opts.agentSlug,
    systemPrompt: agent.systemPrompt,
    userInput: opts.userInput,
    context: opts.context,
  };

  let response;
  try {
    response = await route(req);
    log.push({
      step: "agent_call",
      agent: opts.agentSlug,
      durationMs: response.latencyMs,
      status: "ok",
    });
  } catch (err) {
    log.push({
      step: "agent_call",
      agent: opts.agentSlug,
      durationMs: Date.now() - start,
      status: "error",
      notes: err instanceof Error ? err.message : "Unknown error",
    });
    return { success: false, output: "", log };
  }

  // 2. Log the run to agent_runs.
  await db.insert(schema.agentRuns).values({
    agentName: opts.agentSlug,
    inputHash: createHash("sha256").update(opts.userInput).digest("hex"),
    promptVersion: "0.1.0",
    provider: response.provider,
    model: response.model,
    outputText: response.text,
    tokensIn: response.tokensIn,
    tokensOut: response.tokensOut,
    latencyMs: response.latencyMs,
    status: "succeeded",
    requiresReview: false,
  }).catch((err) => {
    console.warn("[orchestrator] failed to log agent run:", err);
  });

  // 3. Optional doctrine gate.
  if (opts.gate) {
    const verdict = await runDoctrineGate({
      content: response.text,
      agentName: opts.agentSlug,
      taskType: opts.taskType,
    });
    log.push({
      step: "doctrine_gate",
      agent: "doctrine",
      durationMs: 0,
      status:
        verdict.verdict === "approve"
          ? "ok"
          : verdict.verdict === "block"
            ? "blocked"
            : verdict.verdict,
      notes: verdict.notes,
    });
    return {
      success: verdict.verdict === "approve",
      output: response.text,
      doctrineVerdict: verdict,
      log,
    };
  }

  return { success: true, output: response.text, log };
}
