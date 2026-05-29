import { describe, expect, it } from "vitest";
import { getReleaseReadiness } from "@hog/shared";
import { localAskHopeAnswer } from "../apps/web/src/lib/local-ask-hope";
import { crisisDbSeverity, prayerRiskLevel } from "../apps/web/src/lib/ops";

describe("release readiness", () => {
  it("defines exactly twenty launch gates", () => {
    expect(getReleaseReadiness()).toHaveLength(20);
  });

  it("keeps public Ask Hope useful without live provider keys", () => {
    const answer = localAskHopeAnswer("Was the Bible corrupted and what about tahrif?");
    expect(answer.answer).toMatch(/Scripture|Bible|Scroll/i);
    expect(answer.citations.length).toBeGreaterThan(0);
  });

  it("maps crisis labels to database enums", () => {
    expect(crisisDbSeverity("watch")).toBe("concern");
    expect(crisisDbSeverity("active")).toBe("urgent");
    expect(crisisDbSeverity("imminent")).toBe("imminent");
    expect(prayerRiskLevel("imminent")).toBe("critical");
  });
});

