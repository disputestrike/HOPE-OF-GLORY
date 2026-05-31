import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

/**
 * Agent prompts and doctrine corpus live inside the (flattened) repo.
 * The server runs with cwd = repo root (Railway `next start`, tsx scripts,
 * and Next.js server runtime all satisfy this), so resolve relative to it.
 *
 * Override via env in exotic deploy targets where cwd is not the repo root.
 */
const AGENTS_DIR =
  process.env.AGENTS_DIR ?? path.resolve(process.cwd(), "src/lib/prompts/agents");
const DOCTRINE_DIR =
  process.env.DOCTRINE_DIR ?? path.resolve(process.cwd(), "docs/doctrine");

export type AgentDefinition = {
  name: string;
  role: string;
  provider: "Cerebras" | "OpenAI" | "Anthropic";
  riskProfile: "Low" | "Medium" | "High" | "Critical";
  systemPrompt: string;
  tools: string[];
  inputs: string;
  outputs: string;
  gates: string;
  escalation: string;
  raw: string;
};

function extractSection(md: string, heading: string): string {
  const re = new RegExp(`^## ${heading}\\s*([\\s\\S]*?)(?=\\n## |$)`, "m");
  const m = md.match(re);
  return m?.[1]?.trim() ?? "";
}

function extractList(md: string, heading: string): string[] {
  const body = extractSection(md, heading);
  return body
    .split("\n")
    .map((l) => l.replace(/^[-*]\s+/, "").trim())
    .filter((l) => l.length > 0);
}

export async function loadAgent(name: string): Promise<AgentDefinition> {
  const file = path.join(AGENTS_DIR, `${name}-agent.md`);
  const raw = await readFile(file, "utf8");

  return {
    name,
    role: extractSection(raw, "Role"),
    provider: extractSection(raw, "Primary Provider") as AgentDefinition["provider"],
    riskProfile: extractSection(raw, "Risk Profile") as AgentDefinition["riskProfile"],
    systemPrompt: extractSection(raw, "System Prompt"),
    tools: extractList(raw, "Tools Required"),
    inputs: extractSection(raw, "Inputs"),
    outputs: extractSection(raw, "Outputs"),
    gates: extractSection(raw, "Gates"),
    escalation: extractSection(raw, "Escalation Triggers"),
    raw,
  };
}

export async function listAgents(): Promise<string[]> {
  const entries = await readdir(AGENTS_DIR);
  return entries
    .filter((f) => f.endsWith("-agent.md"))
    .map((f) => f.replace(/-agent\.md$/, ""));
}

export async function loadDoctrine(slug: string): Promise<string> {
  const file = path.join(DOCTRINE_DIR, `${slug}.md`);
  return readFile(file, "utf8");
}

export async function listDoctrineDocs(): Promise<string[]> {
  const entries = await readdir(DOCTRINE_DIR);
  return entries.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}
