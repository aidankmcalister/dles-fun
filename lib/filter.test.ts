import { describe, it, expect } from "vitest";
import { cleanText } from "./filter";

describe("cleanText", () => {
  it("should return clean text unchanged", () => {
    expect(cleanText("Hello world")).toBe("Hello world");
  });

  it("should filter profanity", () => {
    // bad-words default placeholder is usually asterisks or similar
    const badWord = "hell"; // common default word
    const cleaned = cleanText(`Go to ${badWord}`);
    expect(cleaned).not.toContain(badWord);
    expect(cleaned).toContain("****");
  });

  it("should handle empty input", () => {
    expect(cleanText("")).toBe("");
  });
});
