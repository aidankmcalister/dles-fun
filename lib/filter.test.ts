import { describe, it, expect } from "vitest";
import { cleanText, isProfane } from "./filter";

describe("lib/filter", () => {
  describe("isProfane", () => {
    it("returns false for clean text", () => {
      expect(isProfane("Hello world")).toBe(false);
      expect(isProfane("This is a test")).toBe(false);
    });

    it("returns true for profane text", () => {
      // Using a standard mild profanity for testing purposes
      expect(isProfane("hell")).toBe(true);
      expect(isProfane("damn")).toBe(true);
    });

    it("handles empty strings", () => {
      expect(isProfane("")).toBe(false);
    });
  });

  describe("cleanText", () => {
    it("returns clean text unchanged", () => {
      expect(cleanText("Hello world")).toBe("Hello world");
    });

    it("censors profane words", () => {
      const input = "what the hell";
      const output = cleanText(input);
      expect(output).not.toContain("hell");
      expect(output).toContain("***");
    });
  });
});
