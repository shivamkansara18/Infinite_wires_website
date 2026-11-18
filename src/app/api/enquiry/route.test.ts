import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetRateLimitsForTests } from "@/lib/rate-limit";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
    constructor() {}
  },
}));

import { POST } from "./route";

const validPayload = {
  name: "Alex Customer",
  email: "alex@example.com",
  companyName: "Example Company",
  phone: "",
  copperOD: 1.6,
  overallOD: 2.6,
  quantity: "100 kg",
  message: "Please send product information.",
  website: "",
};

function request(payload: unknown, key = crypto.randomUUID()) {
  return new Request("http://localhost/api/enquiry", {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": key },
    body: JSON.stringify(payload),
  });
}

describe("POST /api/enquiry", () => {
  beforeEach(() => {
    resetRateLimitsForTests();
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: "email-id" }, error: null });
    process.env.RESEND_API_KEY = "test-key";
    vi.stubEnv("COMPANY_ENQUIRY_EMAIL", "");
    process.env.EMAIL_FROM = "website@example.com";
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects invalid input and honeypot submissions", async () => {
    const invalid = await POST(request({ ...validPayload, email: "bad" }));
    expect(invalid.status).toBe(400);

    const spam = await POST(request({ ...validPayload, website: "spam" }));
    expect(spam.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns a development configuration message when email configuration is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const response = await POST(request(validPayload));
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.stringContaining("RESEND_API_KEY"),
    });
  });

  it("fails safely when optional distributed rate-limit configuration is incomplete", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
    const response = await POST(request(validPayload));
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error:
        "We could not process your enquiry right now. Please try again later.",
    });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("reports acceptance only after the provider accepts the email", async () => {
    sendMock.mockResolvedValue({ data: { id: "email-id" }, error: null });
    const response = await POST(request(validPayload));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ accepted: true });
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["infinitewires@gmail.com"],
        subject: "Website enquiry — Alex Customer",
        replyTo: "alex@example.com",
        text: expect.stringContaining("Customer Details:"),
        html: expect.stringContaining("Product Requirements"),
      }),
    );
  });

  it("escapes untrusted email markup", async () => {
    sendMock.mockResolvedValue({ data: { id: "email-id" }, error: null });
    await POST(
      request({ ...validPayload, message: '<img src="x" onerror="alert(1)">' }),
    );
    const sentEmail = sendMock.mock.calls[0]?.[0];
    expect(sentEmail.html).toContain("&lt;img");
    expect(sentEmail.html).not.toContain("<img");
  });

  it("does not claim success when the provider fails", async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: new Error("provider unavailable"),
    });
    const response = await POST(request(validPayload));
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.accepted).toBeUndefined();
    expect(body.error).toContain("could not send");
  });

  it("handles provider request exceptions without exposing provider details", async () => {
    sendMock.mockRejectedValue(new Error("provider details"));
    const response = await POST(request(validPayload));
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      error:
        "We could not send your enquiry right now. Please try again later.",
    });
  });

  it("rejects repeated and over-limit submissions", async () => {
    const id = "same-key";
    const first = await POST(request(validPayload, id));
    expect(first.status).toBe(200);
    const duplicate = await POST(request(validPayload, id));
    expect(duplicate.status).toBe(409);

    for (let index = 0; index < 3; index += 1) {
      await POST(request(validPayload, `request-${index}`));
    }
    const limited = await POST(request(validPayload, "request-over-limit"));
    expect(limited.status).toBe(429);
  });
});
