import { describe, expect, it } from "vitest";
import {
  coatingThickness,
  copperAreaPercentage,
  isValidDiameter,
  presets,
} from "./product";

describe("product size calculations", () => {
  it("calculates coating thickness and copper area share", () => {
    expect(coatingThickness(1.6, 2.6)).toBeCloseTo(0.5);
    expect(copperAreaPercentage(1.6, 2.6)).toBeCloseTo(37.8698, 3);
  });

  it("enforces size bounds and 0.05 mm increments", () => {
    expect(isValidDiameter(1.6, 2.6)).toBe(true);
    expect(isValidDiameter(4.05, 4.5)).toBe(false);
    expect(isValidDiameter(1.63, 2.6)).toBe(false);
    expect(isValidDiameter(2, 1.95)).toBe(false);
  });

  it("keeps all supplied presets within valid dimensions", () => {
    expect(
      presets.every(({ copper, overall }) => isValidDiameter(copper, overall)),
    ).toBe(true);
  });
});
