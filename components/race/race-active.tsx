"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DlesBadge } from "@/components/design/dles-badge";
import { formatTopic } from "@/lib/utils";
import { GameModal } from "@/components/features/games/game-modal";
import { Race } from "@/app/race/[id]/page";
import {
  Check,
  ExternalLink,
  Timer,
  Loader2,
  SkipForward,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RaceActiveProps {
  race: Race;
  currentUser: { id: string; name: string } | null;
  onRefresh: () => void;
}

export function RaceActive({ race, currentUser, onRefresh }: RaceActiveProps) {
  const [time, setTime] = useState(0);
  const [guestId, setGuestId] = useState<string | null>(null);

  // Replace expanded ID with modal state
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`race_guest_${race.id}`);
      if (stored) setGuestId(stored);
    }
  }, [race.id]);

  useEffect(() => {
    if (!race.startedAt) return;
    const start = new Date(race.startedAt).getTime();
    const interval = setInterval(() => {
      setTime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [race.startedAt]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const myParticipant = race.participants.find(
    (p) =>
      (currentUser && p.userId === currentUser.id) ||
      (guestId && p.id === guestId)
  );
  const opponent = race.participants.find((p) => p.id !== myParticipant?.id);

  const getCompletionForUser = (
    raceGameId: string,
    participantId: string | undefined
  ) => {
    if (!participantId) return null;
    const participant = race.participants.find((p) => p.id === participantId);
    return participant?.completions?.find((c) => c.raceGameId === raceGameId);
  };

  const handleCompleteGame = async (
    raceGameId: string,
    skipped: boolean = false
  ) => {
    try {
      const res = await fetch(`/api/race/${race.id}/complete-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raceGameId,
          skipped,
          participantId: myParticipant?.id,
        }),
      });
      if (res.ok) {
        toast.success(skipped ? "Game skipped!" : "Game marked as done!");
        setActiveGameId(null); // Close modal
        onRefresh();
      } else {
        toast.error("Failed to complete game");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  const activeGame = race.raceGames.find((rg) => rg.id === activeGameId);

  // Mark unsupported handler - no-op for races since game embed status
  // doesn't need to persist from race context
  const handleMarkUnsupported = async (_id: string) => {
    // No-op for races
  };

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl py-6 space-y-6">
        {/* Compact Header Bar */}
        <div className="flex items-center justify-between gap-4 px-5 py-3 rounded-xl bg-card/60 border border-border/40 backdrop-blur-sm">
          {/* You */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">
              You
            </span>
            <span className="text-xl font-black tabular-nums tracking-tight">
              <span className="text-primary">
                {myParticipant?.completions?.length || 0}
              </span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-muted-foreground/60">
                {race.raceGames.length}
              </span>
            </span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Timer className="h-4 w-4 text-primary" />
            <span className="text-lg font-black tabular-nums tracking-tight text-primary">
              {formatTime(time)}
            </span>
          </div>

          {/* Opponent */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tabular-nums tracking-tight">
              <span className="text-primary">
                {opponent?.completions?.length || 0}
              </span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-muted-foreground/60">
                {race.raceGames.length}
              </span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 truncate max-w-[80px]">
              {opponent?.user?.name || opponent?.guestName || "Opponent"}
            </span>
          </div>
        </div>

        {/* Game List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {race.raceGames.map((rg, index) => {
            const myCompletion = getCompletionForUser(rg.id, myParticipant?.id);
            const opponentCompletion = getCompletionForUser(
              rg.id,
              opponent?.id
            );
            const isLocked =
              index > 0 &&
              !getCompletionForUser(
                race.raceGames[index - 1].id,
                myParticipant?.id
              );
            const isNext = !myCompletion && !isLocked;

            return (
              <button
                key={rg.id}
                onClick={() => isNext && setActiveGameId(rg.id)}
                disabled={!isNext}
                className={cn(
                  "relative group flex flex-col items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200",
                  isNext
                    ? "bg-card border-primary/20 shadow-lg shadow-primary/5 hover:-translate-y-1 hover:border-primary/40 cursor-pointer"
                    : myCompletion
                    ? myCompletion.skipped
                      ? "bg-rose-950/10 border-rose-500/20 opacity-70"
                      : "bg-emerald-950/10 border-emerald-500/20 opacity-70"
                    : "bg-muted/10 border-border/20 opacity-50 grayscale cursor-not-allowed"
                )}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground/40 bg-muted/50 px-1.5 py-0.5 rounded-full">
                      #{index + 1}
                    </span>
                    <DlesBadge
                      text={formatTopic(rg.game.topic)}
                      color={rg.game.topic}
                      size="xs"
                    />
                  </div>
                  {myCompletion ? (
                    myCompletion.skipped ? (
                      <DlesBadge text="Skipped" color="red" size="xs" />
                    ) : (
                      <DlesBadge
                        text={formatTime(myCompletion.timeToComplete)}
                        color="green"
                        size="xs"
                      />
                    )
                  ) : isNext ? (
                    <DlesBadge text="Play Now" color="blue" size="xs" />
                  ) : (
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/30">
                      Locked
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  className={cn(
                    "font-bold leading-tight line-clamp-2",
                    isNext ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {rg.game.title}
                </h3>

                {/* Opponent Progress (absolute bottom right) */}
                {opponentCompletion && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-[10px] bg-background/80 px-2 py-1 rounded-full border border-border shadow-sm">
                    <span className="text-muted-foreground uppercase font-bold">
                      {(
                        opponent?.user?.name ||
                        opponent?.guestName ||
                        "Opp"
                      ).slice(0, 3)}
                      :
                    </span>
                    <span
                      className={cn(
                        "font-mono font-bold",
                        opponentCompletion.skipped
                          ? "text-rose-500"
                          : "text-emerald-500"
                      )}
                    >
                      {opponentCompletion.skipped
                        ? "SKIP"
                        : formatTime(opponentCompletion.timeToComplete)}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Locked Game Modal */}
      <GameModal
        game={activeGame ? { ...activeGame.game } : null}
        open={activeGameId !== null}
        onOpenChange={(open) => !open && /* Prevent simple close */ null}
        onMarkPlayed={() => {} /* No-op for races */}
        onMarkUnsupported={handleMarkUnsupported}
        locked={true}
        footer={
          activeGame && (
            <div className="w-full flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground hidden sm:inline-block">
                Race in progress...
              </span>
              <div className="flex items-center gap-3 ml-auto">
                <Button
                  variant="outline"
                  className="h-9 px-4 font-bold border-rose-500/20 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                  onClick={() => handleCompleteGame(activeGame.id, true)}
                >
                  <SkipForward className="h-3.5 w-3.5 mr-2" />
                  Skip (Lose)
                </Button>
                <Button
                  className="h-9 px-6 font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  onClick={() => handleCompleteGame(activeGame.id, false)}
                >
                  <Check className="h-3.5 w-3.5 mr-2" />
                  Done (Win)
                </Button>
              </div>
            </div>
          )
        }
      />
    </div>
  );
}
