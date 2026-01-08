import { describe, it, expect } from "vitest";
import { calculateSettingsDiff, DEFAULT_CONFIG } from "./settings-utils";

describe("calculateSettingsDiff", () => {
  it("returns empty array when configs match", () => {
    // Current matches default exactly
    const current = { ...DEFAULT_CONFIG };
    const diff = calculateSettingsDiff(current as any, DEFAULT_CONFIG);
    expect(diff).toHaveLength(0);
  });

  it("detects single change", () => {
    const current = {
      ...DEFAULT_CONFIG,
      maintenanceMode: true, // Default is false
    };
    const diff = calculateSettingsDiff(current as any, DEFAULT_CONFIG);
    expect(diff).toHaveLength(1);
    expect(diff[0].key).toBe("Maintenance Mode");
    expect(diff[0].old).toBe("true");
    expect(diff[0].new).toBe("false");
  });

  it("detects multiple changes", () => {
    const current = {
      ...DEFAULT_CONFIG,
      maintenanceMode: true,
      newGameMinutes: 60, // Default 10080
    };
    const diff = calculateSettingsDiff(current as any, DEFAULT_CONFIG);
    expect(diff).toHaveLength(2);

    const keys = diff.map((d) => d.key).sort();
    expect(keys).toEqual(["Maintenance Mode", "New Game Minutes"].sort());
  });

  it("handles null/undefined in current config", () => {
    const current = {
      ...DEFAULT_CONFIG,
      welcomeMessage: "Hello", // Default is null
    };
    const diff = calculateSettingsDiff(current as any, DEFAULT_CONFIG);
    expect(diff).toHaveLength(1);
    expect(diff[0].old).toBe("Hello");
    expect(diff[0].new).toBe("null"); // String(null) is "null"
  });
});
