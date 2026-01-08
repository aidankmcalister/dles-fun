import { describe, it, expect } from "vitest";
import { cn, formatTopic } from "./utils";

describe("lib/utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("c1", "c2")).toBe("c1 c2");
    });

    it("handles conditional classes", () => {
      expect(cn("c1", true && "c2", false && "c3")).toBe("c1 c2");
    });

    it("resolves tailwind conflicts", () => {
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });
  });

  describe("formatTopic", () => {
    it("formats simple topics", () => {
      expect(formatTopic("words")).toBe("Words");
      expect(formatTopic("logic")).toBe("Logic");
    });

    it("formats multi-word topics", () => {
      expect(formatTopic("video_games")).toBe("Video Games");
      expect(formatTopic("board_games")).toBe("Board Games");
    });

    it("formats special case movies_tv", () => {
      // Current implementation: topic.split('_').map(...).join(topic === "movies_tv" ? "/" : " ")
      // "movies_tv" -> ["movies", "tv"] -> ["Movies", "Tv"]
      // join with "/" -> "Movies/Tv"
      expect(formatTopic("movies_tv")).toBe("Movies/Tv");
    });
  });
});
