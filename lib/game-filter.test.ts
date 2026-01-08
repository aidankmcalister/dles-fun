import { describe, it, expect } from "vitest";
import { filterGames, Game } from "./game-filter";

describe("filterGames", () => {
  const mockGames: Game[] = [
    {
      id: "1",
      title: "Wordle",
      description: "Words",
      topic: "words",
      embedSupported: true,
    },
    {
      id: "2",
      title: "Travle",
      description: "Maps",
      topic: "geography",
      embedSupported: false,
    },
    {
      id: "3",
      title: "Connections",
      description: "Groups",
      topic: "logic",
      embedSupported: true,
    },
    {
      id: "4",
      title: "Sudoku",
      description: "Numbers",
      topic: "logic",
      embedSupported: true,
    },
  ];

  it("returns all games when filters are empty", () => {
    const result = filterGames(mockGames, {
      searchQuery: "",
      selectedTopics: [],
      onlyEmbeddable: false, // Default is usually true in UI, but false means "show all"
    });
    expect(result).toHaveLength(4);
  });

  it("filters by search query", () => {
    const result = filterGames(mockGames, {
      searchQuery: "word",
      selectedTopics: [],
      onlyEmbeddable: false,
    });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Wordle");
  });

  it("filters by topic", () => {
    const result = filterGames(mockGames, {
      searchQuery: "",
      selectedTopics: ["logic"],
      onlyEmbeddable: false,
    });
    expect(result).toHaveLength(2);
    expect(result.map((g) => g.title)).toContain("Connections");
    expect(result.map((g) => g.title)).toContain("Sudoku");
  });

  it("handles 'all' topic", () => {
    const result = filterGames(mockGames, {
      searchQuery: "",
      selectedTopics: ["all"],
      onlyEmbeddable: false,
    });
    expect(result).toHaveLength(4);
  });

  it("filters by embedSupported (Modal Only)", () => {
    const result = filterGames(mockGames, {
      searchQuery: "",
      selectedTopics: [],
      onlyEmbeddable: true,
    });
    // Travle is embedSupported: false
    expect(result).toHaveLength(3);
    expect(result.find((g) => g.title === "Travle")).toBeUndefined();
  });

  it("combines filters", () => {
    // Search "o" (matches Wordle, Maps(in desc? no title only), Connections, Sudoku)
    // Topic "logic" (Connections, Sudoku)
    // Embeddable true (Connections, Sudoku)
    const result = filterGames(mockGames, {
      searchQuery: "o", // Sudoku, Connections, Wordle
      selectedTopics: ["logic"], // Sudoku, Connections
      onlyEmbeddable: true, // Sudoku, Connections
    });
    expect(result).toHaveLength(2);
    expect(result.map((g) => g.title).sort()).toEqual(
      ["Connections", "Sudoku"].sort()
    );
  });
});
