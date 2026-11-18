import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkEnquiryLimit, resetRateLimitsForTests } from "./rate-limit";

const { redisSet, redisLimit } = vi.hoisted(() => ({
  redisSet: vi.fn(),
  redisLimit: vi.fn(),
}));

vi.mock("@upstash/redis", () => ({
  Redis: class {
    set = redisSet;
  },
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    limit = redisLimit;
    constructor() {}
    static slidingWindow() {
      return {};
    }
  },
}));

describe("enquiry rate limiting", () => {
  beforeEach(() => {
    resetRateLimitsForTests();
    redisSet.mockReset().mockResolvedValue("OK");
    redisLimit.mockReset().mockResolvedValue({ success: true });
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows four requests, blocks the next, and recognizes a duplicate", async () => {
    const now = 1000;
    expect(await checkEnquiryLimit("visitor", "1", now)).toBe("allowed");
    expect(await checkEnquiryLimit("visitor", "1", now)).toBe("duplicate");
    expect(await checkEnquiryLimit("visitor", "2", now)).toBe("allowed");
    expect(await checkEnquiryLimit("visitor", "3", now)).toBe("allowed");
    expect(await checkEnquiryLimit("visitor", "4", now)).toBe("allowed");
    expect(await checkEnquiryLimit("visitor", "5", now)).toBe("limited");
  });

  it("uses shared Upstash limits and idempotency when configured", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    redisSet
      .mockResolvedValueOnce("OK")
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce("OK");
    redisLimit
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ success: false });

    expect(await checkEnquiryLimit("203.0.113.8", "request-1")).toBe("allowed");
    expect(await checkEnquiryLimit("203.0.113.8", "request-1")).toBe(
      "duplicate",
    );
    expect(await checkEnquiryLimit("203.0.113.8", "request-2")).toBe("limited");
    expect(redisLimit).toHaveBeenCalledTimes(2);
    expect(redisLimit.mock.calls[0]?.[0]).not.toBe("203.0.113.8");
  });

  it("fails closed when only one Upstash credential is configured", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
    await expect(checkEnquiryLimit("visitor", "request")).rejects.toThrow(
      "Both Upstash Redis environment variables are required.",
    );
  });
});
