/**
 * Risk classifier tests. Determines whether an input gets routed to
 * Claude (premium) or Cerebras (workhorse), and whether the Crisis Agent
 * preempts everything.
 */
import { describe, it, expect } from "vitest";
import { detectCrisis, detectHighRiskTopic, classifyRisk } from "./classify";

describe("detectCrisis()", () => {
  it("flags 'suicide'", () => {
    expect(detectCrisis("I'm thinking about suicide")).toBe(true);
  });

  it("flags 'kill myself'", () => {
    expect(detectCrisis("I want to kill myself")).toBe(true);
  });

  it("flags 'self-harm'", () => {
    expect(detectCrisis("I've been doing self-harm")).toBe(true);
  });

  it("flags 'overdose'", () => {
    expect(detectCrisis("I took an overdose")).toBe(true);
  });

  it("does not flag theological 'death' or 'die'", () => {
    expect(detectCrisis("Christ died for our sins")).toBe(false);
    expect(detectCrisis("We will die and go to heaven")).toBe(false);
  });

  it("does not flag normal greetings", () => {
    expect(detectCrisis("Hello, how are you?")).toBe(false);
  });
});

describe("detectHighRiskTopic()", () => {
  it("flags Trinity", () => {
    expect(detectHighRiskTopic("Is the Trinity in the Bible?")).toBe(true);
  });

  it("flags Islam", () => {
    expect(detectHighRiskTopic("What does Islam teach about Jesus?")).toBe(true);
  });

  it("flags Mormon", () => {
    expect(detectHighRiskTopic("Are Mormons Christians?")).toBe(true);
  });

  it("flags end times", () => {
    expect(detectHighRiskTopic("When will the end times happen?")).toBe(true);
  });

  it("flags abortion", () => {
    expect(detectHighRiskTopic("Is abortion a sin?")).toBe(true);
  });

  it("does not flag plain Bible reading questions", () => {
    expect(detectHighRiskTopic("What does the parable of the sower mean?")).toBe(false);
  });
});

describe("classifyRisk()", () => {
  it("returns 'critical' for crisis input on any task", () => {
    expect(classifyRisk("I want to die", "qa_draft")).toBe("critical");
  });

  it("returns 'critical' for doctrine_gate task", () => {
    expect(classifyRisk("any text", "doctrine_gate")).toBe("critical");
  });

  it("returns 'critical' for crisis task", () => {
    expect(classifyRisk("any text", "crisis")).toBe("critical");
  });

  it("returns 'high' for Trinity question", () => {
    expect(classifyRisk("Tell me about the Trinity", "qa_draft")).toBe("high");
  });

  it("returns 'low' for summarize task", () => {
    expect(classifyRisk("Some random text", "summarize")).toBe("low");
  });

  it("returns 'low' for caption task", () => {
    expect(classifyRisk("Generate a caption", "caption")).toBe("low");
  });

  it("returns 'medium' for normal Q&A", () => {
    expect(classifyRisk("Who was Moses?", "qa_draft")).toBe("medium");
  });
});
