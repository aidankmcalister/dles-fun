"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DlesBadge } from "@/components/design/dles-badge";
import { formatTopic } from "@/lib/utils";
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  // Find first incomplete game for auto-expand
  const firstIncompleteId = race.raceGames.find(
    (rg) => !getCompletionForUser(rg.id, myParticipant?.id)
  )?.id;

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
        onRefresh();
      } else {
        toast.error("Failed to complete game");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  const isExpanded = (gameId: string) => {
    // Auto-expand first incomplete, or manually expanded
    if (expandedId === gameId) return true;
    if (expandedId === null && gameId === firstIncompleteId) return true;
    return false;
  };

  // Get the active game - prefer first incomplete, fall back to manually selected
  // If the manually selected game is completed, auto-advance to next incomplete
  const selectedGameCompletion = expandedId
    ? getCompletionForUser(expandedId, myParticipant?.id)
    : null;
  const activeGameId =
    expandedId && !selectedGameCompletion ? expandedId : firstIncompleteId;
  const activeGame = race.raceGames.find((rg) => rg.id === activeGameId);
  const activeGameCompletion = activeGame
    ? getCompletionForUser(activeGame.id, myParticipant?.id)
    : null;
  const activeOpponentCompletion = activeGame
    ? getCompletionForUser(activeGame.id, opponent?.id)
    : null;

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

        {/* Split Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Compact Game List */}
          <div className="lg:col-span-5 space-y-1.5">
            {race.raceGames.map((rg, index) => {
              const myCompletion = getCompletionForUser(
                rg.id,
                myParticipant?.id
              );
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
              const isActive = rg.id === activeGameId;

              return (
                <button
                  key={rg.id}
                  onClick={() =>
                    !myCompletion && !isLocked && setExpandedId(rg.id)
                  }
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-left transition-all duration-150",
                    isActive
                      ? "bg-primary/10 border border-primary/30 shadow-sm"
                      : myCompletion
                      ? myCompletion.skipped
                        ? "bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10"
                        : "bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10"
                      : "bg-card/50 border border-border/30 hover:bg-card hover:border-border/50",
                    isLocked && "opacity-40 pointer-events-none grayscale"
                  )}
                >
                  {/* Left: Icon + Title */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Status Icon */}
                    {myCompletion ? (
                      myCompletion.skipped ? (
                        <div className="h-6 w-6 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0">
                          <SkipForward className="h-3 w-3 text-rose-500" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-emerald-500" />
                        </div>
                      )
                    ) : isActive ? (
                      <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <Loader2 className="h-3 w-3 text-primary animate-spin" />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold text-muted-foreground/40">
                          {index + 1}
                        </span>
                      </div>
                    )}
                    {/* Title */}
                    <span
                      className={cn(
                        "font-semibold text-sm truncate",
                        myCompletion?.skipped && "text-rose-500/70",
                        myCompletion &&
                          !myCompletion.skipped &&
                          "text-emerald-500/70",
                        !myCompletion && isActive && "text-foreground",
                        !myCompletion && !isActive && "text-muted-foreground"
                      )}
                    >
                      {rg.game.title}
                    </span>
                    <DlesBadge
                      text={formatTopic(rg.game.topic)}
                      color={rg.game.topic}
                      size="xs"
                    />
                  </div>

                  {/* Right: Times */}
                  <div className="flex flex-col items-end text-[10px] font-mono tabular-nums leading-tight shrink-0">
                    <div className="flex items-center">
                      <span className="text-muted-foreground/50 w-[32px] text-right">
                        You
                      </span>
                      <span
                        className={cn(
                          "w-[52px] text-right font-semibold",
                          myCompletion?.skipped && "text-rose-400",
                          myCompletion &&
                            !myCompletion.skipped &&
                            "text-emerald-400",
                          !myCompletion && "text-muted-foreground/30"
                        )}
                      >
                        {myCompletion
                          ? myCompletion.skipped
                            ? "SKIP"
                            : formatTime(myCompletion.timeToComplete)
                          : "—:——"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground/50 w-[32px] text-right truncate">
                        {(
                          opponent?.user?.name ||
                          opponent?.guestName ||
                          "Opp"
                        ).slice(0, 4)}
                      </span>
                      <span
                        className={cn(
                          "w-[52px] text-right font-semibold",
                          opponentCompletion?.skipped && "text-rose-400",
                          opponentCompletion &&
                            !opponentCompletion.skipped &&
                            "text-primary",
                          !opponentCompletion && "text-muted-foreground/30"
                        )}
                      >
                        {opponentCompletion
                          ? opponentCompletion.skipped
                            ? "SKIP"
                            : formatTime(opponentCompletion.timeToComplete)
                          : "—:——"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Panel: Active Game Details */}
          <div className="lg:col-span-7">
            {activeGame && !activeGameCompletion ? (
              <Card className="border-primary/20 bg-card shadow-lg">
                <CardContent className="p-6 space-y-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black tracking-tight">
                        {activeGame.game.title}
                      </h2>
                      <a
                        href={activeGame.game.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        {activeGame.game.link.replace(/^https?:\/\//, "")}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <DlesBadge
                      text={formatTopic(activeGame.game.topic)}
                      color={activeGame.game.topic}
                      size="sm"
                    />
                  </div>

                  <div className="h-px bg-border/40" />

                  {/* Status Section */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/50">
                        You
                      </span>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="font-medium">Racing...</span>
                      </div>
                    </div>

                    <div className="space-y-2 border-l pl-6 border-border/40">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/50">
                        Opponent
                      </span>
                      {activeOpponentCompletion ? (
                        activeOpponentCompletion.skipped ? (
                          <div className="flex items-center gap-2 text-rose-500">
                            <SkipForward className="h-4 w-4" />
                            <span className="font-bold">Lost</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-primary">
                            <Check className="h-4 w-4" />
                            <span className="font-bold tabular-nums">
                              {formatTime(
                                activeOpponentCompletion.timeToComplete
                              )}
                            </span>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="font-medium">Racing...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-border/40" />

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      className="h-12 font-bold uppercase tracking-wider"
                      asChild
                    >
                      <a
                        href={activeGame.game.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Play
                      </a>
                    </Button>

                    <Button
                      className="h-12 font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      onClick={() => handleCompleteGame(activeGame.id, false)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Done
                    </Button>

                    <Button
                      variant="outline"
                      className="h-12 font-black uppercase tracking-wider border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
                      onClick={() => handleCompleteGame(activeGame.id, true)}
                    >
                      <SkipForward className="h-4 w-4 mr-2" />
                      Lost
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/40 bg-card/50">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    You&apos;re Done!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Waiting for{" "}
                    {opponent?.user?.name || opponent?.guestName || "opponent"}{" "}
                    to finish...
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
