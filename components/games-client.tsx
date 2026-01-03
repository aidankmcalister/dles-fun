"use client";

import { useState, useEffect, useMemo } from "react";
import { GameGrid, GameGridSkeleton } from "@/components/game-grid";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Game } from "@/app/generated/prisma/client";
import { Search, X } from "lucide-react";

interface GamesClientProps {
  games: Game[];
}

const COOKIE_NAME = "daily-games-played";

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function setCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  // Set cookie to expire at midnight
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0);
  document.cookie = `${name}=${value}; expires=${tomorrow.toUTCString()}; path=/`;
}

function getPlayedIdsFromCookie(): Set<string> {
  const cookieValue = getCookie(COOKIE_NAME);
  if (!cookieValue) return new Set();
  
  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue));
    const { date, ids } = parsed;
    
    // Check if it's a new day
    if (date !== getTodayDateString()) {
      return new Set();
    }
    
    return new Set(ids as string[]);
  } catch {
    return new Set();
  }
}

function savePlayedIds(ids: Set<string>): void {
  const value = JSON.stringify({
    date: getTodayDateString(),
    ids: [...ids],
  });
  setCookie(COOKIE_NAME, encodeURIComponent(value));
}

type SortOption = "title" | "topic" | "played";
type TopicFilter = "all" | string;

const TOPICS = [
  "words",
  "puzzle",
  "geography",
  "trivia",
  "entertainment",
  "gaming",
  "nature",
  "food",
  "sports",
] as const;

export function GamesClient({ games }: GamesClientProps) {
  const [playedIds, setPlayedIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [topicFilter, setTopicFilter] = useState<TopicFilter>("all");

  // Load played state from cookie on mount
  useEffect(() => {
    setPlayedIds(getPlayedIdsFromCookie());
    setIsLoaded(true);
  }, []);

  // Check for midnight reset
  useEffect(() => {
    const checkMidnight = () => {
      const cookieValue = getCookie(COOKIE_NAME);
      if (cookieValue) {
        try {
          const parsed = JSON.parse(decodeURIComponent(cookieValue));
          if (parsed.date !== getTodayDateString()) {
            setPlayedIds(new Set());
          }
        } catch {
          // Cookie invalid, reset
          setPlayedIds(new Set());
        }
      }
    };

    // Check every minute for midnight reset
    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, []);

  const handlePlay = (id: string) => {
    setPlayedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      savePlayedIds(next);
      return next;
    });
  };

  // Filter and sort games
  const filteredAndSortedGames = useMemo(() => {
    let result = games.filter((game) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.topic.toLowerCase().includes(searchQuery.toLowerCase());

      // Topic filter
      const matchesTopic = topicFilter === "all" || game.topic === topicFilter;

      return matchesSearch && matchesTopic;
    });

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "topic":
          return a.topic.localeCompare(b.topic) || a.title.localeCompare(b.title);
        case "played":
          const aPlayed = playedIds.has(a.id) ? 1 : 0;
          const bPlayed = playedIds.has(b.id) ? 1 : 0;
          return aPlayed - bPlayed || a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [games, searchQuery, topicFilter, sortBy, playedIds]);

  if (!isLoaded) {
    return <GameGridSkeleton count={games.length} />;
  }

  const playedCount = playedIds.size;
  const totalCount = games.length;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-sm">
          {playedCount}/{totalCount} played today
        </Badge>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Select value={topicFilter} onValueChange={(v) => setTopicFilter(v as TopicFilter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {TOPICS.map((topic) => (
                <SelectItem key={topic} value={topic} className="capitalize">
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">A-Z</SelectItem>
              <SelectItem value="topic">Category</SelectItem>
              <SelectItem value="played">Unplayed First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      {(searchQuery || topicFilter !== "all") && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedGames.length} of {games.length} games
        </p>
      )}

      {/* Game grid */}
      {filteredAndSortedGames.length > 0 ? (
        <GameGrid
          games={filteredAndSortedGames.map((g) => ({
            id: g.id,
            title: g.title,
            link: g.link,
            topic: g.topic,
          }))}
          playedIds={playedIds}
          onPlay={handlePlay}
        />
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          No games found matching your criteria.
        </div>
      )}
    </div>
  );
}
