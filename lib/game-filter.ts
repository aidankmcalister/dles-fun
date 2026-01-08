import { Topic } from "@/app/generated/prisma/client";

export interface Game {
  id: string;
  title: string;
  description: string;
  topic: Topic;
  archived?: boolean;
  embedSupported?: boolean;
}

export interface FilterOptions {
  searchQuery: string;
  selectedTopics: string[];
  onlyEmbeddable: boolean;
}

export function filterGames(games: Game[], options: FilterOptions): Game[] {
  const { searchQuery, selectedTopics, onlyEmbeddable } = options;

  return games.filter((game) => {
    const matchesSearch = game.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // "all" is a UI construct, but we handle it here for convenience
    const matchesTopic =
      selectedTopics.length === 0 ||
      selectedTopics.includes("all") ||
      selectedTopics.includes(game.topic);

    const matchesEmbed = !onlyEmbeddable || game.embedSupported !== false;

    return matchesSearch && matchesTopic && matchesEmbed;
  });
}
