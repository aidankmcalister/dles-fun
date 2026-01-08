import { describe, it, expect } from "vitest";
import { cn, formatTopic } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
      expect(cn("class1", false && "class2", "class3")).toBe("class1 class3");
    });

    it("should merge tailwind classes properly", () => {
      // tailwind-merge functionality
      expect(cn("p-4", "p-2")).toBe("p-2");
    });
  });

  describe("formatTopic", () => {
    it("should capitalize and replace underscores", () => {
      expect(formatTopic("video_games")).toBe("Video Games");
    });

    it("should handle single words", () => {
      expect(formatTopic("words")).toBe("Words");
    });

    it("should handle all caps topics if needed or standard ones", () => {
      expect(formatTopic("movies_tv")).toBe("Movies/Tv");
    });
  });
});
