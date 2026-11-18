export const presets = [
  { copper: 1, overall: 1.5, label: "1.0 / 1.5" },
  { copper: 1.6, overall: 2.6, label: "1.6 / 2.6" },
  { copper: 2.5, overall: 3.5, label: "2.5 / 3.5" },
  { copper: 3.5, overall: 4.7, label: "3.5 / 4.7" },
] as const;

export function isValidDiameter(copper: number, overall: number): boolean {
  return (
    Number.isFinite(copper) &&
    Number.isFinite(overall) &&
    copper >= 0.5 &&
    copper <= 4 &&
    overall >= 0.6 &&
    overall <= 5 &&
    copper <= overall - 0.05 &&
    isStepValue(copper) &&
    isStepValue(overall)
  );
}

function isStepValue(value: number): boolean {
  return (
    Math.abs(value * 100 - Math.round(value * 100)) < 1e-6 &&
    Math.round(value * 100) % 5 === 0
  );
}

export function coatingThickness(copper: number, overall: number): number {
  return (overall - copper) / 2;
}

export function copperAreaPercentage(copper: number, overall: number): number {
  return (copper / overall) ** 2 * 100;
}
