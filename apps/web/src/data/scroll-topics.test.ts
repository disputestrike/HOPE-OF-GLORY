import { describe, expect, it } from "vitest";
import {
  REQUIRED_SCROLL_TOPIC_TITLES,
  SCROLL_TOPIC_SLUGS,
  SCROLL_TOPICS,
} from "./scroll-topics";

describe("Scroll topics", () => {
  it("preserves every founder-approved Scroll topic", () => {
    const titles = new Set(SCROLL_TOPICS.map((topic) => topic.title));

    for (const required of REQUIRED_SCROLL_TOPIC_TITLES) {
      expect(titles.has(required), required).toBe(true);
    }
  });

  it("uses unique slugs", () => {
    expect(new Set(SCROLL_TOPIC_SLUGS).size).toBe(SCROLL_TOPIC_SLUGS.length);
  });

  it("keeps every topic useful enough to publish", () => {
    for (const topic of SCROLL_TOPICS) {
      expect(topic.summary.length).toBeGreaterThan(40);
      expect(topic.coreClaim.length).toBeGreaterThan(40);
      expect(topic.keyScriptures.length).toBeGreaterThanOrEqual(3);
      expect(topic.subtopics.length).toBeGreaterThanOrEqual(4);
      expect(topic.askHopePrompt.length).toBeGreaterThan(20);
    }
  });
});
