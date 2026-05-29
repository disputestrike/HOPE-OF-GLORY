/**
 * Routing decision tests. Pure logic only — no provider calls.
 */
import { describe, it, expect } from "vitest";
import { riskFor, decide } from "./router";

describe("riskFor() — task to risk mapping", () => {
  it("crisis task is critical", () => {
    expect(riskFor("crisis")).toBe("critical");
  });

  it("doctrine_gate is critical", () => {
    expect(riskFor("doctrine_gate")).toBe("critical");
  });

  it("apologetics_verify is critical", () => {
    expect(riskFor("apologetics_verify")).toBe("critical");
  });

  it("sermon_draft is high", () => {
    expect(riskFor("sermon_draft")).toBe("high");
  });

  it("prayer is high", () => {
    expect(riskFor("prayer")).toBe("high");
  });

  it("qa_draft is medium", () => {
    expect(riskFor("qa_draft")).toBe("medium");
  });

  it("summarize is low", () => {
    expect(riskFor("summarize")).toBe("low");
  });

  it("override wins over default", () => {
    expect(riskFor("summarize", "critical")).toBe("critical");
  });
});

describe("decide() — provider selection", () => {
  it("critical risk ALWAYS uses Anthropic, never Cerebras", () => {
    const d = decide("crisis", "critical");
    expect(d.primary).toBe("anthropic");
    expect(d.fallback).toBeUndefined();
    expect(d.verifier).toBeUndefined();
  });

  it("high risk uses Cerebras draft with Anthropic verifier + fallback", () => {
    const d = decide("sermon_draft", "high");
    expect(d.primary).toBe("cerebras");
    expect(d.verifier).toBe("anthropic");
    expect(d.fallback).toBe("anthropic");
  });

  it("medium risk uses Cerebras primary with OpenAI fallback", () => {
    const d = decide("qa_draft", "medium");
    expect(d.primary).toBe("cerebras");
    expect(d.fallback).toBe("openai");
    expect(d.verifier).toBeUndefined();
  });

  it("low risk uses Cerebras only", () => {
    const d = decide("summarize", "low");
    expect(d.primary).toBe("cerebras");
    expect(d.fallback).toBeUndefined();
    expect(d.verifier).toBeUndefined();
  });

  it("every decision has a reason", () => {
    const tasks = [
      ["crisis", "critical"],
      ["sermon_draft", "high"],
      ["qa_draft", "medium"],
      ["summarize", "low"],
    ] as const;
    for (const [task, risk] of tasks) {
      const d = decide(task, risk);
      expect(d.reason.length).toBeGreaterThan(5);
    }
  });
});
