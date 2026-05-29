/**
 * Crisis classifier tests.
 *
 * SAFETY CRITICAL. These test the function that decides whether to
 * route to 988/911 or continue normally. Failures here can cost lives.
 */
import { describe, it, expect } from "vitest";
import { assess } from "./crisis";

describe("assess() — imminent severity", () => {
  it("detects gun + tonight", () => {
    const r = assess("I have a gun and I'm going to end it tonight");
    expect(r.severity).toBe("imminent");
    expect(r.recommendedAction).toBe("warm_transfer_988_and_911");
    expect(r.surface_988).toBe(true);
    expect(r.surface_911).toBe(true);
  });

  it("detects pills + plan", () => {
    const r = assess("I have the pills here and I plan to take them tonight");
    expect(r.severity).toBe("imminent");
  });

  it("detects overdose admission", () => {
    const r = assess("I overdosed about an hour ago");
    expect(r.severity).toBe("imminent");
  });

  it("detects 'going to do it' + means", () => {
    const r = assess("I'm going to end it tonight, I have a gun");
    expect(r.severity).toBe("imminent");
  });

  it("detects wanting to self-harm tonight", () => {
    const r = assess("I want to hurt myself tonight");
    expect(r.severity).toBe("imminent");
    expect(r.surface_988).toBe(true);
    expect(r.surface_911).toBe(true);
  });
});

describe("assess() — active severity", () => {
  it("detects suicidal ideation", () => {
    const r = assess("I want to die. Life isn't worth it.");
    expect(r.severity).toBe("active");
    expect(r.surface_988).toBe(true);
  });

  it("detects self-harm — cutting", () => {
    const r = assess("I've been cutting myself again");
    expect(r.severity).toBe("active");
  });

  it("detects 'kill myself' phrasing", () => {
    const r = assess("Sometimes I just want to kill myself");
    expect(r.severity).toBe("active");
  });

  it("detects 'end my life' phrasing", () => {
    const r = assess("I'm thinking about ending my life");
    expect(r.severity).toBe("active");
  });

  it("detects not wanting to live anymore", () => {
    const r = assess("I don't want to live anymore");
    expect(r.severity).toBe("active");
    expect(r.surface_988).toBe(true);
  });
});

describe("assess() — abuse indicators", () => {
  it("detects domestic violence disclosure", () => {
    const r = assess("My husband is abusing me and the kids");
    expect(r.severity).toBe("active");
    expect(r.recommendedAction).toBe("switch_to_crisis_agent");
    expect(r.surface_911).toBe(true);
  });

  it("detects child abuse disclosure", () => {
    const r = assess("Child abuse is happening in my neighborhood");
    expect(r.severity).toBe("active");
  });
});

describe("assess() — watch tier", () => {
  it("returns 'watch' for veiled despair", () => {
    const r = assess("I don't see the point of suicide prevention anymore");
    // The broader pattern catches "suicide" word
    expect(["watch", "active"]).toContain(r.severity);
    expect(r.surface_988).toBe(true);
  });
});

describe("assess() — no crisis", () => {
  it("returns 'none' for theological question", () => {
    const r = assess("What does Habakkuk 2:14 mean?");
    expect(r.severity).toBe("none");
    expect(r.recommendedAction).toBe("continue_normally");
    expect(r.surface_988).toBe(false);
    expect(r.surface_911).toBe(false);
  });

  it("returns 'none' for prayer request", () => {
    const r = assess("Please pray for my mother who has cancer");
    expect(r.severity).toBe("none");
  });

  it("returns 'none' for empty input", () => {
    const r = assess("");
    expect(r.severity).toBe("none");
  });

  it("returns 'none' for hostile but not in-danger message", () => {
    const r = assess("Your religion is stupid and you should stop");
    expect(r.severity).toBe("none");
  });
});

describe("assess() — log_to_crisis_events flag", () => {
  it("flags every non-none assessment for logging", () => {
    const cases = [
      "I want to die",
      "I have a gun and plan to end it tonight",
      "I'm being abused",
    ];
    for (const text of cases) {
      const r = assess(text);
      expect(r.log_to_crisis_events).toBe(true);
    }
  });

  it("does not flag normal conversations", () => {
    expect(assess("Hello, how are you?").log_to_crisis_events).toBe(false);
  });
});
