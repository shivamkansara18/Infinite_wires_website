import { describe, expect, it } from "vitest";
import { enquirySchema } from "./enquiry-schema";

describe("enquirySchema", () => {
  const valid = { name: "A Customer", email: "customer@example.com" };

  it("accepts a valid enquiry with one contact method", () => {
    expect(enquirySchema.safeParse(valid).success).toBe(true);
  });

  it("requires a contact method", () => {
    expect(enquirySchema.safeParse({ name: "A Customer" }).success).toBe(false);
  });

  it("rejects invalid emails and dimensions", () => {
    expect(
      enquirySchema.safeParse({
        ...valid,
        email: "invalid",
        copperOD: 4.1,
      }).success,
    ).toBe(false);
  });

  it("requires the configured 0.05 mm dimension increments", () => {
    expect(
      enquirySchema.safeParse({
        ...valid,
        copperOD: 1.63,
        overallOD: 2.6,
      }).success,
    ).toBe(false);
  });

  it("rejects an overall diameter smaller than the copper diameter", () => {
    expect(
      enquirySchema.safeParse({
        ...valid,
        copperOD: 2.6,
        overallOD: 2.6,
      }).success,
    ).toBe(false);
  });
});
