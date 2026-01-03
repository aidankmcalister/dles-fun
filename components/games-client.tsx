"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { GameGrid, GameGridSkeleton } from "@/components/game-grid";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import type { Game, Topic } from "@/app/generated/prisma/client";
import { Search, X, RotateCcw, Plus } from "lucide-react";

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

const TOPICS: Topic[] = [
  "words",
  "puzzle",
  "geography",
  "trivia",
  "entertainment",
  "gaming",
  "nature",
  "food",
  "sports",
];

export function GamesClient({ games }: GamesClientProps) {
  const router = useRouter();
  const [playedIds, setPlayedIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [topicFilter, setTopicFilter] = useState<TopicFilter>("all");

  // Add game form state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newGameTitle, setNewGameTitle] = useState("");
  const [newGameLink, setNewGameLink] = useState("");
  const [newGameTopic, setNewGameTopic] = useState<Topic>("puzzle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPlayedIds(getPlayedIdsFromCookie());
    setIsLoaded(true);
  }, []);

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
          setPlayedIds(new Set());
        }
      }
    };

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

  const handleClearPlayed = () => {
    setPlayedIds(new Set());
    savePlayedIds(new Set());
  };

  const handleAddGame = async () => {
    if (!newGameTitle.trim() || !newGameLink.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newGameTitle.trim(),
          link: newGameLink.trim(),
          topic: newGameTopic,
        }),
      });

      if (res.ok) {
        setNewGameTitle("");
        setNewGameLink("");
        setNewGameTopic("puzzle");
        setAddDialogOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to add game:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAndSortedGames = useMemo(() => {
    let result = games.filter((game) => {
      const matchesSearch =
        searchQuery === "" ||
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.topic.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTopic = topicFilter === "all" || game.topic === topicFilter;

      return matchesSearch && matchesTopic;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "topic":
          return (
            a.topic.localeCompare(b.topic) || a.title.localeCompare(b.title)
          );
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
      {/* Progress, Clear, and Add buttons */}
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-sm">
          {playedCount}/{totalCount} played
        </Badge>
        {playedCount > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3" />
                Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset your played status for all games today.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearPlayed}>
                  Clear
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Add Game Dialog */}
        <AlertDialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto h-7 gap-1.5 text-xs"
            >
              <Plus className="h-3 w-3" />
              Add Game
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add Custom Game</AlertDialogTitle>
              <AlertDialogDescription>
                Add a new game to your collection.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <Field>
                <FieldLabel htmlFor="game-title">Title</FieldLabel>
                <Input
                  id="game-title"
                  placeholder="Game name"
                  value={newGameTitle}
                  onChange={(e) => setNewGameTitle(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="game-link">Link</FieldLabel>
                <Input
                  id="game-link"
                  placeholder="https://example.com/game"
                  value={newGameLink}
                  onChange={(e) => setNewGameLink(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="game-topic">Category</FieldLabel>
                <Select
                  value={newGameTopic}
                  onValueChange={(v) => setNewGameTopic(v as Topic)}
                >
                  <SelectTrigger id="game-topic" className="w-full capitalize">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOPICS.map((topic) => (
                      <SelectItem
                        key={topic}
                        value={topic}
                        className="capitalize"
                      >
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                onClick={handleAddGame}
                disabled={
                  isSubmitting || !newGameTitle.trim() || !newGameLink.trim()
                }
              >
                {isSubmitting ? "Adding..." : "Add Game"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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

        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
          <Select
            value={topicFilter}
            onValueChange={(v) => setTopicFilter(v as TopicFilter)}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
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

          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortOption)}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
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
