/**
 * PII redaction tests. Sensitive data must never leak to external verifiers.
 */
import { describe, it, expect } from "vitest";
import { redactPii, normalizePhoneForHash } from "./pii";

describe("redactPii() — emails", () => {
  it("redacts a simple email", () => {
    expect(redactPii("Contact me at john@example.com")).toBe(
      "Contact me at [email redacted]"
    );
  });

  it("redacts multiple emails", () => {
    const out = redactPii("Email me at a@b.com or c@d.org");
    expect(out).not.toContain("@");
    expect(out).toMatch(/redacted/);
  });
});

describe("redactPii() — phone numbers", () => {
  it("redacts (202) 555-0100", () => {
    expect(redactPii("Call me at (202) 555-0100")).toContain("[phone redacted]");
  });

  it("redacts 202-555-0100", () => {
    expect(redactPii("Reach me 202-555-0100")).toContain("[phone redacted]");
  });

  it("redacts +1 202-555-0100", () => {
    expect(redactPii("My number is +1 202-555-0100")).toContain("[phone redacted]");
  });
});

describe("redactPii() — SSNs", () => {
  it("redacts SSN-like patterns", () => {
    expect(redactPii("My SSN is 123-45-6789")).toContain("[ssn redacted]");
  });
});

describe("redactPii() — URLs", () => {
  it("redacts http and https URLs", () => {
    expect(redactPii("See https://example.com/path?q=1")).toContain("[url redacted]");
  });
});

describe("redactPii() — addresses", () => {
  it("redacts street address hints", () => {
    expect(redactPii("I live at 1600 Pennsylvania Avenue")).toContain("[address redacted]");
  });
});

describe("redactPii() — preserves prayer content", () => {
  it("leaves theological content untouched", () => {
    const input = "Please pray that my faith would grow and that God would heal my mother.";
    expect(redactPii(input)).toBe(input);
  });
});

describe("normalizePhoneForHash()", () => {
  it("strips formatting characters", () => {
    expect(normalizePhoneForHash("(202) 555-0100")).toBe("2025550100");
  });

  it("handles +1 country code", () => {
    expect(normalizePhoneForHash("+1 202-555-0100")).toBe("2025550100");
  });

  it("handles plain digits", () => {
    expect(normalizePhoneForHash("12025550100")).toBe("2025550100");
  });

  it("returns empty for empty input", () => {
    expect(normalizePhoneForHash("")).toBe("");
  });
});
