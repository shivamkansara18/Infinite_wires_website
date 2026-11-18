import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Entry = { count: number; resetAt: number };
type LimitResult = "limited" | "duplicate" | "allowed";

const requests = new Map<string, Entry>();
const duplicateKeys = new Map<string, number>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 4;
const MAX_MEMORY_KEYS = 10_000;

let distributedLimiter:
  { redis: Redis; limiter: Ratelimit; config: string } | undefined;

function getDistributedLimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url && !token) return undefined;
  if (!url || !token) {
    throw new Error("Both Upstash Redis environment variables are required.");
  }

  const config = `${url}:${token}`;
  if (distributedLimiter?.config === config) return distributedLimiter;

  const redis = new Redis({ url, token });
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "1 h"),
    prefix: "infinite-wires:enquiry",
    analytics: false,
    ephemeralCache: false,
    timeout: 0,
  });
  distributedLimiter = { redis, limiter, config };
  return distributedLimiter;
}

export async function checkEnquiryLimit(
  key: string,
  idempotencyKey: string,
  now = Date.now(),
): Promise<LimitResult> {
  const distributed = getDistributedLimiter();
  if (distributed) {
    const identifier = createHash("sha256").update(key).digest("hex");
    const idempotencyResult = await distributed.redis.set(
      `idempotency:${identifier}:${idempotencyKey}`,
      "1",
      { nx: true, ex: 120 },
    );
    if (idempotencyResult !== "OK") return "duplicate";
    const { success } = await distributed.limiter.limit(identifier);
    return success ? "allowed" : "limited";
  }

  for (const [storedKey, entry] of requests) {
    if (entry.resetAt <= now) requests.delete(storedKey);
  }
  for (const [storedKey, expiry] of duplicateKeys) {
    if (expiry <= now) duplicateKeys.delete(storedKey);
  }

  const duplicateKey = `${key}:${idempotencyKey}`;
  if (duplicateKeys.has(duplicateKey)) return "duplicate";

  const entry = requests.get(key);
  if (entry && entry.count >= MAX_REQUESTS && entry.resetAt > now) {
    return "limited";
  }
  if (!entry && requests.size >= MAX_MEMORY_KEYS) {
    return "limited";
  }

  if (!entry || entry.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
  duplicateKeys.set(duplicateKey, now + 2 * 60 * 1000);
  return "allowed";
}

export function resetRateLimitsForTests(): void {
  requests.clear();
  duplicateKeys.clear();
  distributedLimiter = undefined;
}
