"use client";

import { useState, useMemo, useEffect } from "react";
import { GameGrid, GameGridSkeleton } from "@/components/game-grid";
import { GamesHeader } from "@/components/games-header";
import type { Game } from "@/app/generated/prisma/client";
import { usePlayedGames } from "@/lib/use-played-games";
import { useLists } from "@/lib/use-lists";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

import dynamic from "next/dynamic";

const FeelingLuckyModal = dynamic(
  () =>
    import("@/components/feeling-lucky-modal").then(
      (mod) => mod.FeelingLuckyModal
    ),
  {
    ssr: false,
  }
);

const GuestSyncBanner = dynamic(
  () =>
    import("@/components/guest-sync-banner").then((mod) => mod.GuestSyncBanner),
  {
    ssr: false,
  }
);

type SortOption = "title" | "topic" | "played";

export function GamesClient({ games: initialGames }: { games: Game[] }) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [topicFilter, setTopicFilter] = useState("all");
  const [listFilter, setListFilter] = useState("all");
  const [showHidden, setShowHidden] = useState(false);
  const [isLuckyModalOpen, setIsLuckyModalOpen] = useState(false);

  const { lists } = useLists();

  const gameIds = useMemo(() => games.map((g) => g.id), [games]);

  const {
    playedIds,
    hiddenIds,
    currentStreak,
    isLoading,
    isAuthenticated,
    markAsPlayed,
    toggleHidden,
    syncFromLocalStorage,
    clearLocalPlayed,
  } = usePlayedGames(gameIds);

  // Sync localStorage to server on sign-in
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      syncFromLocalStorage();
    }
  }, [isAuthenticated, isLoading, syncFromLocalStorage]);

  const handlePlay = async (id: string) => {
    await markAsPlayed(id);

    const gameIndex = games.findIndex((g) => g.id === id);
    if (gameIndex !== -1) {
      const game = games[gameIndex];

      // Optimistic update for play count
      const updatedGames = [...games];
      updatedGames[gameIndex] = {
        ...game,
        playCount: (game.playCount || 0) + 1,
      };
      setGames(updatedGames);

      toast.success("Game played", {
        description: `Marked ${game.title} as played.`,
      });
    }
  };

  const handleHide = async (id: string) => {
    await toggleHidden(id, true);
    const game = games.find((g) => g.id === id);
    if (game) {
      toast.success("Game hidden", {
        description: `${game.title} is now hidden.`,
      });
    }
  };

  const handleClear = () => {
    clearLocalPlayed();
    toast.success("Progress reset", {
      description: "All daily progress has been cleared.",
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setTopicFilter("all");
    setListFilter("all");
    setSortBy("title");
  };

  const handleRandomGame = () => {
    setIsLuckyModalOpen(true);
  };

  const filteredGames = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return games
      .filter((g) => {
        // Hide games if not showing hidden
        if (!showHidden && hiddenIds.has(g.id)) return false;

        // Filter by list
        if (listFilter !== "all" && lists.length > 0) {
          const list = lists.find((l) => l.id === listFilter);
          if (list && !list.games.includes(g.id)) {
            return false;
          }
        }

        return (
          (topicFilter === "all" || g.topic === topicFilter) &&
          (query === "" ||
            g.title.toLowerCase().includes(query) ||
            g.topic.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => {
        if (sortBy === "topic")
          return (
            a.topic.localeCompare(b.topic) || a.title.localeCompare(b.title)
          );
        if (sortBy === "played")
          return (
            (playedIds.has(a.id) ? 1 : 0) - (playedIds.has(b.id) ? 1 : 0) ||
            a.title.localeCompare(b.title)
          );
        return a.title.localeCompare(b.title);
      });
  }, [
    games,
    searchQuery,
    topicFilter,
    listFilter,
    lists,
    sortBy,
    playedIds,
    hiddenIds,
    showHidden,
  ]);

  if (isLoading) return <GameGridSkeleton count={games.length} />;

  return (
    <div className="space-y-6">
      {!isAuthenticated && <GuestSyncBanner />}

      <GamesHeader
        playedCount={playedIds.size}
        totalCount={games.length}
        filteredCount={filteredGames.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        topicFilter={topicFilter}
        onTopicFilterChange={setTopicFilter}
        listFilter={listFilter}
        onListFilterChange={setListFilter}
        lists={lists}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClear={handleClear}
        onRandom={handleRandomGame}
        currentStreak={currentStreak}
        showHidden={showHidden}
        onShowHiddenChange={setShowHidden}
        hiddenCount={hiddenIds.size}
        isAuthenticated={isAuthenticated}
      />

      <FeelingLuckyModal
        open={isLuckyModalOpen}
        onOpenChange={setIsLuckyModalOpen}
        games={games}
        playedIds={playedIds}
        onPlay={handlePlay}
      />

      {filteredGames.length > 0 ? (
        <GameGrid
          games={filteredGames.map((g) => ({
            id: g.id,
            title: g.title,
            link: g.link,
            topic: g.topic,
            playCount: g.playCount || 0,
            createdAt: g.createdAt,
          }))}
          playedIds={playedIds}
          onPlay={handlePlay}
          onHide={isAuthenticated ? handleHide : undefined}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted/50 rounded-full p-4 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No games found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            We couldn't find any games matching your current search and filters.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={handleClearFilters}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
