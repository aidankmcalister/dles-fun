"use client";

import { useEffect } from "react";
import { cn, formatTopic } from "@/lib/utils";
import { ParticipantWithSplits, RaceGameWithGame } from "./results-list";
import { Trophy, Clock, Target, SkipForward, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { DlesBadge } from "@/components/design/dles-badge";

interface WinnerCardProps {
  winner: ParticipantWithSplits;
  isWinner: boolean;
  totalGames: number;
  sortedGames: RaceGameWithGame[];
  myResults: ParticipantWithSplits | undefined;
}

export function WinnerCard({
  winner,
  isWinner,
  totalGames,
  sortedGames,
  myResults,
}: WinnerCardProps) {
  useEffect(() => {
    if (isWinner) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isWinner]);

  // Stats Logic (Calculated for MY RESULTS defaultly now)
  const mySplits = myResults?.splits || [];

  const successfulSplits = mySplits
    .map((s, idx) => ({ ...s, game: sortedGames[idx].game }))
    .filter((s) => s.duration !== null && !s.skipped);

  const fastestSplit =
    successfulSplits.length > 0
      ? successfulSplits.reduce((prev, curr) =>
          curr.duration! < prev.duration! ? curr : prev
        )
      : null;

  const avgTime =
    successfulSplits.length > 0
      ? Math.round(
          successfulSplits.reduce((acc, curr) => acc + curr.duration!, 0) /
            successfulSplits.length
        )
      : 0;

  // Category Logic
  const categoryCounts: Record<string, { count: number; totalTime: number }> =
    {};
  successfulSplits.forEach((s) => {
    const topic = s.game.topic;
    if (!categoryCounts[topic])
      categoryCounts[topic] = { count: 0, totalTime: 0 };
    categoryCounts[topic].count++;
    categoryCounts[topic].totalTime += s.duration!;
  });

  let bestCategory = null;
  let bestAvg = Infinity;

  Object.entries(categoryCounts).forEach(([topic, stats]) => {
    const avg = stats.totalTime / stats.count;
    if (avg < bestAvg) {
      bestAvg = avg;
      bestCategory = topic;
    }
  });

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!winner) return null;

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 text-center backdrop-blur-sm shadow-2xl h-full">
        {/* Background Glow - REMOVED per user request */}

        <div className="relative z-10 flex flex-col gap-8 w-full h-full">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center gap-4 shrink-0">
            <div
              className={cn(
                "flex h-24 w-24 items-center justify-center rounded-full border shadow-2xl animate-in zoom-in duration-500",
                isWinner
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/20"
                  : "bg-zinc-800/50 border-white/10 text-zinc-400"
              )}
            >
              {isWinner ? (
                <Trophy className="h-10 w-10 drop-shadow-md" />
              ) : (
                <Clock className="h-10 w-10" />
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-sm uppercase">
                {isWinner ? "VICTORY" : "RACE OVER"}
              </h1>
              <p className="text-base text-muted-foreground font-medium max-w-[200px] mx-auto leading-tight">
                {isWinner
                  ? "You finished first!"
                  : `Winner: ${
                      winner.user?.name || winner.guestName || "Opponent"
                    }`}
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-white/5" />

          {/* My Stats Section */}
          <div className="flex-1 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">
              Your Performance
            </h4>

            {/* Primary Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/20 border border-white/5">
                <Clock className="h-4 w-4 text-primary mb-1 opacity-80" />
                <span className="text-xl font-black tabular-nums text-white tracking-tight">
                  {formatTime(myResults?.totalTime || null)}
                </span>
                <span className="text-[9px] uppercase font-bold text-white/30 tracking-wider">
                  Total Time
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/20 border border-white/5">
                <Target className="h-4 w-4 text-emerald-400 mb-1 opacity-80" />
                <span className="text-xl font-black tabular-nums text-white tracking-tight">
                  {successfulSplits.length}
                </span>
                <span className="text-[9px] uppercase font-bold text-white/30 tracking-wider">
                  Wins
                </span>
              </div>
            </div>

            {/* Detailed Stats List */}
            <div className="space-y-4 px-2">
              {/* Fastest Solve */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Fastest Solve</span>
                  <Zap className="h-3.5 w-3.5 text-yellow-400" />
                </div>
                {fastestSplit ? (
                  <div>
                    <div className="text-lg font-black font-mono text-white tracking-tight">
                      {formatTime(fastestSplit.duration)}
                    </div>
                    <div className="text-[10px] text-white/40 truncate">
                      {fastestSplit.game.title}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs">--</span>
                )}
              </div>

              <div className="h-px bg-white/5" />

              {/* Avg Time */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Avg Solve Time</span>
                  <Clock className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <div className="text-lg font-black font-mono text-white tracking-tight">
                  {formatTime(avgTime)}
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Best Category */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Best Category</span>
                  <Trophy className="h-3.5 w-3.5 text-purple-400" />
                </div>
                {bestCategory ? (
                  <DlesBadge
                    text={formatTopic(bestCategory)}
                    color={bestCategory}
                    size="sm"
                  />
                ) : (
                  <span className="text-muted-foreground text-xs">--</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
