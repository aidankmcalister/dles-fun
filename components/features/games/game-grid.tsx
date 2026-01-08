"use client";

import {
  GameCard,
  type GameCardProps,
} from "@/components/features/games/game-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";

interface GameGridProps {
  games: Omit<GameCardProps, "isPlayed" | "onPlay" | "onHide">[];
  playedIds: Set<string>;
  onPlay: (id: string) => void;
  onHide?: (id: string) => void;
}

const GRID_CLASSES =
  "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";

export function GameGrid({ games, playedIds, onPlay, onHide }: GameGridProps) {
  return (
    <div className={GRID_CLASSES}>
      {games.map((game, index) => (
        <GameCard
          key={game.id}
          index={index}
          {...game}
          isPlayed={playedIds.has(game.id)}
          onPlay={onPlay}
          onHide={onHide}
        />
      ))}
    </div>
  );
}

export function GameGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className={`${GRID_CLASSES} animate-in fade-in duration-300`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
          style={{ animationDelay: `${i * 30}ms`, animationDuration: "300ms" }}
        >
          <CardHeader className="p-1.5">
            <div className="space-y-0.5">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2 w-1/2" />
            </div>
            <div className="pt-1.5">
              <Skeleton className="h-3 w-10 rounded-full" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
