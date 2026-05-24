/**
 * Doctrine Agent — the gate.
 *
 * Every public-facing AI output must pass through this agent first.
 * It checks the content against the doctrinal constitution stored in
 * docs/doctrine/*.md and returns a structured verdict.
 *
 * Provider: ALWAYS Anthropic (Claude). Never Cerebras. This is the brain.
 */
import { anthropic, type AgentRequest } from "@hog/ai";
import { loadAgent, loadDoctrine, listDoctrineDocs } from "@hog/prompts";
import { DoctrineVerdictSchema, type DoctrineVerdict } from "@hog/shared";

let _doctrineContext: string | null = null;

async function getDoctrineContext(): Promise<string> {
  if (_doctrineContext) return _doctrineContext;

  const slugs = await listDoctrineDocs();
  const docs: string[] = [];
  for (const slug of slugs) {
    const body = await loadDoctrine(slug);
    docs.push(`# ${slug}\n\n${body}`);
  }
  _doctrineContext = docs.join("\n\n---\n\n");
  return _doctrineContext;
}

export async function runDoctrineGate(opts: {
  content: string;
  agentName: string;
  taskType: AgentRequest["taskType"];
}): Promise<DoctrineVerdict> {
  const agent = await loadAgent("doctrine");
  const context = await getDoctrineContext();

  const req: AgentRequest = {
    taskType: "doctrine_gate",
    agentName: "doctrine",
    risk: "critical",
    systemPrompt: agent.systemPrompt,
    context: `Doctrinal constitution:\n\n${context}`,
    userInput: `Source agent: ${opts.agentName}
Task type: ${opts.taskType}

Content to evaluate:
---
${opts.content}
---

Return a JSON verdict matching the schema in your system prompt.`,
    temperature: 0.1,
    maxTokens: 1500,
  };

  const response = await anthropic.call(req);

  // Try to extract JSON from the response. The Doctrine Agent system prompt
  // requires JSON-only output, but we defensively look for a fenced block.
  const text = response.text;
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) ?? text.match(/(\{[\s\S]*\})/);
  if (!jsonMatch?.[1]) {
    return {
      verdict: "revise",
      score: 0,
      drift_flags: ["doctrine_agent_unparseable_response"],
      escalate_to_human: true,
      notes: "Doctrine Agent returned no parseable JSON. Escalating for human review.",
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[1]);
    const verdict = DoctrineVerdictSchema.parse(parsed);
    return verdict;
  } catch (err) {
    return {
      verdict: "revise",
      score: 0,
      drift_flags: ["doctrine_agent_invalid_schema"],
      escalate_to_human: true,
      notes: `Doctrine Agent JSON failed schema validation: ${err instanceof Error ? err.message : "Unknown"}`,
    };
  }
}
