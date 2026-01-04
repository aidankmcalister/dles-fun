"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { TOPICS } from "@/lib/constants";
import { Plus, Loader2 } from "lucide-react";
import type { Topic } from "@/app/generated/prisma/client";
import { GameItem } from "./game-item";

interface Game {
  id: string;
  title: string;
  link: string;
  topic: string;
  playCount: number;
  createdAt: string;
}

export function GamesTab({ canManageGames }: { canManageGames: boolean }) {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search and filter states
  const [gameSearch, setGameSearch] = useState("");
  const [gameTopicFilter, setGameTopicFilter] = useState<Topic | "all">("all");
  const [gameSortBy, setGameSortBy] = useState<
    "title" | "topic" | "playCount" | "createdAt"
  >("title");
  const [gameSortOrder, setGameSortOrder] = useState<"asc" | "desc">("asc");

  // Game form state
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // New game form state
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newTopic, setNewTopic] = useState<Topic>("puzzle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await fetch("/api/games");
      const data = await res.json();
      setGames(data);
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGame = async () => {
    if (!newTitle || !newLink) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          link: newLink,
          topic: newTopic,
        }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewLink("");
        setNewTopic("puzzle");
        setShowAddDialog(false);
        fetchGames();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateGame = async (
    id: string,
    data: { title: string; link: string; topic: Topic }
  ) => {
    try {
      const res = await fetch(`/api/games/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setEditingGameId(null);
        fetchGames();
      }
    } catch (error) {
      console.error("Failed to update game:", error);
    }
  };

  const handleDeleteGame = async (id: string) => {
    try {
      const res = await fetch(`/api/games/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchGames();
      }
    } catch (error) {
      console.error("Failed to delete game:", error);
    }
  };

  const filteredGames = useMemo(() => {
    const q = gameSearch.trim().toLowerCase();

    return games
      .filter((game) => {
        const matchesSearch =
          q.length === 0 ||
          game.title.toLowerCase().includes(q) ||
          game.link.toLowerCase().includes(q);
        const matchesTopic =
          gameTopicFilter === "all" || game.topic === gameTopicFilter;
        return matchesSearch && matchesTopic;
      })
      .sort((a, b) => {
        let comparison = 0;

        if (gameSortBy === "title") {
          comparison = a.title.localeCompare(b.title);
        } else if (gameSortBy === "topic") {
          comparison = a.topic.localeCompare(b.topic);
        } else if (gameSortBy === "playCount") {
          comparison = (a.playCount || 0) - (b.playCount || 0);
        } else {
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }

        return gameSortOrder === "asc" ? comparison : -comparison;
      });
  }, [games, gameSearch, gameTopicFilter, gameSortBy, gameSortOrder]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold">
          All Games ({filteredGames.length})
        </h2>
        {canManageGames && (
          <AlertDialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Plus className="h-3.5 w-3.5" />
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
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="game-link">Link</FieldLabel>
                  <Input
                    id="game-link"
                    placeholder="https://example.com/game"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="game-topic">Category</FieldLabel>
                  <Select
                    value={newTopic}
                    onValueChange={(v) => setNewTopic(v as Topic)}
                  >
                    <SelectTrigger
                      id="game-topic"
                      className="w-full capitalize"
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOPICS.map((t) => (
                        <SelectItem key={t} value={t} className="capitalize">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowAddDialog(false)}>
                  Cancel
                </AlertDialogCancel>
                <Button
                  onClick={handleAddGame}
                  disabled={isSubmitting || !newTitle.trim() || !newLink.trim()}
                >
                  {isSubmitting ? "Adding..." : "Add Game"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search games..."
            value={gameSearch}
            onChange={(e) => setGameSearch(e.target.value)}
            className="max-w-md h-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={gameTopicFilter}
            onValueChange={(value) =>
              setGameTopicFilter(value as Topic | "all")
            }
          >
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="Topic" />
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
            value={`${gameSortBy}-${gameSortOrder}`}
            onValueChange={(value) => {
              const [sortBy, order] = value.split("-") as [
                "title" | "topic" | "playCount" | "createdAt",
                "asc" | "desc"
              ];
              setGameSortBy(sortBy);
              setGameSortOrder(order);
            }}
          >
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="playCount-desc">Most Played</SelectItem>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <div className="divide-y relative">
          {filteredGames.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No games found.
            </div>
          ) : (
            filteredGames.map((game) => (
              <div
                key={game.id}
                className="px-4 py-3 hover:bg-muted/40 transition-colors"
              >
                <GameItem
                  game={game}
                  isEditing={editingGameId === game.id}
                  canManage={canManageGames}
                  onEdit={() => setEditingGameId(game.id)}
                  onCancelEdit={() => setEditingGameId(null)}
                  onUpdate={handleUpdateGame}
                  onDelete={handleDeleteGame}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
