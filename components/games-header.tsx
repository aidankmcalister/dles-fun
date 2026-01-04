"use client";

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
import { Button } from "@/components/ui/button";
import { TOPICS } from "@/lib/constants";
import {
  Search,
  X,
  RotateCcw,
  Sparkles,
  Flame,
  Eye,
  EyeOff,
} from "lucide-react";

import { GameList } from "@/lib/use-lists";

type SortOption = "title" | "topic" | "played";

interface GamesHeaderProps {
  playedCount: number;
  totalCount: number;
  filteredCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  topicFilter: string;
  onTopicFilterChange: (topic: string) => void;
  listFilter: string;
  onListFilterChange: (listId: string) => void;
  lists: GameList[];
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onClear: () => void;
  onRandom: () => void;
  currentStreak?: number;
  showHidden?: boolean;
  onShowHiddenChange?: (show: boolean) => void;
  hiddenCount?: number;
  isAuthenticated?: boolean;
}

export function GamesHeader({
  playedCount,
  totalCount,
  filteredCount,
  searchQuery,
  onSearchChange,
  topicFilter,
  onTopicFilterChange,
  listFilter,
  onListFilterChange,
  lists,
  sortBy,
  onSortChange,
  onClear,
  onRandom,
  currentStreak = 0,
  showHidden = false,
  onShowHiddenChange,
  hiddenCount = 0,
  isAuthenticated = false,
}: GamesHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search - Grows to fill remaining space */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-20 w-full"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {filteredCount} games
            </span>
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters and Progress - Fixed width/Shrink wrapped */}
        <div className="flex shrink-0 items-center gap-3 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {isAuthenticated && lists.length > 0 && (
            <Select value={listFilter} onValueChange={onListFilterChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="List" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                {lists.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={topicFilter} onValueChange={onTopicFilterChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {TOPICS.map((t) => (
                <SelectItem key={t} value={t} className="capitalize">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(v) => onSortChange(v as SortOption)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">A-Z</SelectItem>
              <SelectItem value="topic">Category</SelectItem>
              <SelectItem value="played">Unplayed First</SelectItem>
            </SelectContent>
          </Select>

          <div className="h-6 w-px bg-border hidden sm:block" />

          <Button
            variant="outline"
            size="sm"
            onClick={onRandom}
            className="group relative h-7 overflow-hidden border-primary/20 hover:border-primary/50 hover:bg-primary/5 hidden sm:flex"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="h-4 w-4 group-hover:animate-bounce" />
              Feeling Lucky
            </span>
          </Button>

          {/* Show hidden toggle (only for authenticated users with hidden games) */}
          {isAuthenticated && hiddenCount > 0 && onShowHiddenChange && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShowHiddenChange(!showHidden)}
              className="h-7 gap-1.5 text-muted-foreground"
            >
              {showHidden ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">
                {showHidden ? "Hide" : "Show"} {hiddenCount}
              </span>
            </Button>
          )}
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <div className="flex items-center gap-3 whitespace-nowrap">
          {/* Streak display */}
          {isAuthenticated && currentStreak > 0 && (
            <span className="flex items-center gap-1 text-sm font-medium text-orange-500">
              <Flame className="h-4 w-4" />
              {currentStreak} {currentStreak === 1 ? "day" : "days"}
            </span>
          )}

          <span className="text-sm text-muted-foreground font-medium">
            {playedCount}/{totalCount}
            <span className="hidden sm:inline"> played</span>
          </span>
          {playedCount > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  title="Reset Progress"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset daily progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will unmark all games as played for today.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onClear}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
