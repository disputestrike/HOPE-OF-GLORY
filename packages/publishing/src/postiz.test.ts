/**
 * Postiz adapter tests. Verifies platform mapping + fail-safe behavior
 * when POSTIZ_API_KEY is not configured. Does not make network calls.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { schedulePost } from "./postiz";
import type { ComposedPost } from "./types";

describe("schedulePost() — fail safe when no API key", () => {
  let savedKey: string | undefined;
  beforeEach(() => {
    savedKey = process.env.POSTIZ_API_KEY;
    delete process.env.POSTIZ_API_KEY;
  });
  afterEach(() => {
    if (savedKey !== undefined) process.env.POSTIZ_API_KEY = savedKey;
  });

  it("returns failed status with reason when key missing", async () => {
    const post: ComposedPost = {
      platform: "instagram",
      content: "Test",
      media: [],
    };
    const result = await schedulePost({
      post,
      scheduledFor: new Date(),
    });
    expect(result.status).toBe("failed");
    expect(result.error).toMatch(/POSTIZ_API_KEY/);
  });
});

describe("schedulePost() — email platform routing", () => {
  let savedKey: string | undefined;
  beforeEach(() => {
    savedKey = process.env.POSTIZ_API_KEY;
    process.env.POSTIZ_API_KEY = "test-key";
  });
  afterEach(() => {
    if (savedKey === undefined) delete process.env.POSTIZ_API_KEY;
    else process.env.POSTIZ_API_KEY = savedKey;
  });

  it("rejects email platform — must use Resend instead", async () => {
    const post: ComposedPost = {
      platform: "email",
      content: "Test",
      media: [],
    };
    const result = await schedulePost({
      post,
      scheduledFor: new Date(),
    });
    expect(result.status).toBe("failed");
    expect(result.error).toMatch(/Resend|email/i);
  });
});
