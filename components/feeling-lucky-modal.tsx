"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Game } from "@/app/generated/prisma/client";
import canvasConfetti from "canvas-confetti";
import { GameCard } from "@/components/game-card";
import { TOPIC_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowRight, Loader2, Sparkles, Trophy, Star } from "lucide-react";

const TOPIC_CONFETTI_COLORS: Record<string, string[]> = {
  words: ["#3b82f6", "#2563eb", "#60a5fa"],
  puzzle: ["#a855f7", "#9333ea", "#c084fc"],
  geography: ["#22c55e", "#16a34a", "#4ade80"],
  trivia: ["#eab308", "#ca8a04", "#facc15"],
  entertainment: ["#ec4899", "#db2777", "#f472b6"],
  gaming: ["#ef4444", "#dc2626", "#f87171"],
  nature: ["#10b981", "#059669", "#34d399"],
  food: ["#f97316", "#ea580c", "#fb923c"],
  sports: ["#06b6d4", "#0891b2", "#22d3ee"],
};

const TOPIC_THEMES: Record<
  string,
  {
    border: string;
    shadow: string;
    spinnerInit: string;
    spinnerText: string;
    congratsText: string;
    winnerText: string;
    glow: string;
    ring: string;
    icon: string;
    button: string;
    banner: string;
    bannerPing: string;
  }
> = {
  words: {
    border: "border-blue-500/50",
    shadow: "shadow-[0_0_50px_rgba(59,130,246,0.3)]",
    spinnerInit: "text-blue-500",
    spinnerText: "from-blue-400 to-cyan-500",
    congratsText: "text-blue-500",
    winnerText: "from-blue-300 via-cyan-400 to-blue-300",
    glow: "bg-blue-500/20",
    ring: "ring-blue-400",
    icon: "fill-blue-500",
    button:
      "from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-500 border-blue-800 shadow-blue-900/50",
    banner: "from-blue-600 to-blue-500",
    bannerPing: "bg-blue-600",
  },
  puzzle: {
    border: "border-purple-500/50",
    shadow: "shadow-[0_0_50px_rgba(168,85,247,0.3)]",
    spinnerInit: "text-purple-500",
    spinnerText: "from-purple-400 to-pink-500",
    congratsText: "text-purple-500",
    winnerText: "from-purple-300 via-pink-400 to-purple-300",
    glow: "bg-purple-500/20",
    ring: "ring-purple-400",
    icon: "fill-purple-500",
    button:
      "from-purple-600 via-purple-500 to-purple-600 hover:from-purple-500 hover:to-purple-500 border-purple-800 shadow-purple-900/50",
    banner: "from-purple-600 to-purple-500",
    bannerPing: "bg-purple-600",
  },
  geography: {
    border: "border-green-500/50",
    shadow: "shadow-[0_0_50px_rgba(34,197,94,0.3)]",
    spinnerInit: "text-green-500",
    spinnerText: "from-green-400 to-emerald-500",
    congratsText: "text-green-500",
    winnerText: "from-green-300 via-emerald-400 to-green-300",
    glow: "bg-green-500/20",
    ring: "ring-green-400",
    icon: "fill-green-500",
    button:
      "from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:to-green-500 border-green-800 shadow-green-900/50",
    banner: "from-green-600 to-green-500",
    bannerPing: "bg-green-600",
  },
  trivia: {
    border: "border-yellow-500/50",
    shadow: "shadow-[0_0_50px_rgba(234,179,8,0.3)]",
    spinnerInit: "text-yellow-500",
    spinnerText: "from-yellow-400 to-orange-500",
    congratsText: "text-yellow-500",
    winnerText: "from-yellow-300 via-orange-400 to-yellow-300",
    glow: "bg-yellow-500/20",
    ring: "ring-yellow-400",
    icon: "fill-yellow-500",
    button:
      "from-yellow-600 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-500 border-yellow-800 shadow-yellow-900/50",
    banner: "from-yellow-600 to-yellow-500",
    bannerPing: "bg-yellow-600",
  },
  entertainment: {
    border: "border-pink-500/50",
    shadow: "shadow-[0_0_50px_rgba(236,72,153,0.3)]",
    spinnerInit: "text-pink-500",
    spinnerText: "from-pink-400 to-rose-500",
    congratsText: "text-pink-500",
    winnerText: "from-pink-300 via-rose-400 to-pink-300",
    glow: "bg-pink-500/20",
    ring: "ring-pink-400",
    icon: "fill-pink-500",
    button:
      "from-pink-600 via-pink-500 to-pink-600 hover:from-pink-500 hover:to-pink-500 border-pink-800 shadow-pink-900/50",
    banner: "from-pink-600 to-pink-500",
    bannerPing: "bg-pink-600",
  },
  gaming: {
    border: "border-red-500/50",
    shadow: "shadow-[0_0_50px_rgba(239,68,68,0.3)]",
    spinnerInit: "text-red-500",
    spinnerText: "from-red-400 to-orange-500",
    congratsText: "text-red-500",
    winnerText: "from-red-300 via-orange-400 to-red-300",
    glow: "bg-red-500/20",
    ring: "ring-red-400",
    icon: "fill-red-500",
    button:
      "from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-500 border-red-800 shadow-red-900/50",
    banner: "from-red-600 to-red-500",
    bannerPing: "bg-red-600",
  },
  nature: {
    border: "border-emerald-500/50",
    shadow: "shadow-[0_0_50px_rgba(16,185,129,0.3)]",
    spinnerInit: "text-emerald-500",
    spinnerText: "from-emerald-400 to-teal-500",
    congratsText: "text-emerald-500",
    winnerText: "from-emerald-300 via-teal-400 to-emerald-300",
    glow: "bg-emerald-500/20",
    ring: "ring-emerald-400",
    icon: "fill-emerald-500",
    button:
      "from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-500 border-emerald-800 shadow-emerald-900/50",
    banner: "from-emerald-600 to-emerald-500",
    bannerPing: "bg-emerald-600",
  },
  food: {
    border: "border-orange-500/50",
    shadow: "shadow-[0_0_50px_rgba(249,115,22,0.3)]",
    spinnerInit: "text-orange-500",
    spinnerText: "from-orange-400 to-yellow-500",
    congratsText: "text-orange-500",
    winnerText: "from-orange-300 via-yellow-400 to-orange-300",
    glow: "bg-orange-500/20",
    ring: "ring-orange-400",
    icon: "fill-orange-500",
    button:
      "from-orange-600 via-orange-500 to-orange-600 hover:from-orange-500 hover:to-orange-500 border-orange-800 shadow-orange-900/50",
    banner: "from-orange-600 to-orange-500",
    bannerPing: "bg-orange-600",
  },
  sports: {
    border: "border-cyan-500/50",
    shadow: "shadow-[0_0_50px_rgba(6,182,212,0.3)]",
    spinnerInit: "text-cyan-500",
    spinnerText: "from-cyan-400 to-blue-500",
    congratsText: "text-cyan-500",
    winnerText: "from-cyan-300 via-blue-400 to-cyan-300",
    glow: "bg-cyan-500/20",
    ring: "ring-cyan-400",
    icon: "fill-cyan-500",
    button:
      "from-cyan-600 via-cyan-500 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 border-cyan-800 shadow-cyan-900/50",
    banner: "from-cyan-600 to-cyan-500",
    bannerPing: "bg-cyan-600",
  },
};

interface FeelingLuckyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  games: Game[];
  onPlay: (id: string) => void;
  playedIds: Set<string>;
}

export function FeelingLuckyModal({
  open,
  onOpenChange,
  games,
  onPlay,
  playedIds,
}: FeelingLuckyModalProps) {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Game | null>(null);

  // Ref to track animation frame to cancel it if closed
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const spin = useCallback(() => {
    if (games.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    setCurrentGame(null);

    // Filter unplayed games to prefer them, but fallback to all if needed
    const unplayedGames = games.filter((g) => !playedIds.has(g.id));
    const pool = unplayedGames.length > 0 ? unplayedGames : games;

    // Pick a winner upfront
    const winningGame = pool[Math.floor(Math.random() * pool.length)];

    let speed = 50; // Initial speed (ms per tick)
    let elapsed = 0;
    const totalDuration = 3000 + Math.random() * 1000; // 3-4 seconds

    const tick = () => {
      // Pick a random game to show for "spinning" effect
      const randomShow = games[Math.floor(Math.random() * games.length)];
      setCurrentGame(randomShow);

      elapsed += speed;
      // Exponentially increase delay to simulate slowing down
      speed = speed * 1.1;

      if (elapsed < totalDuration) {
        timeoutRef.current = setTimeout(tick, speed);
      } else {
        // Land on winner
        setCurrentGame(winningGame);
        setWinner(winningGame);
        setIsSpinning(false);
        fireConfetti(winningGame.topic);
        const audio = new Audio("/airhorn.mp3");
        audio.play().catch((e) => console.error("Audio play failed:", e));
      }
    };

    tick();
  }, [games, playedIds]);

  useEffect(() => {
    if (open) {
      spin();
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsSpinning(false);
      setWinner(null);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [open, spin]);

  const fireConfetti = (topic?: string) => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = (topic && TOPIC_CONFETTI_COLORS[topic]) || [
      "#22c55e",
      "#3b82f6",
      "#f59e0b",
      "#ef4444",
    ];

    const frame = () => {
      canvasConfetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      canvasConfetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const handlePlayWinner = () => {
    if (winner) {
      onPlay(winner.id);
      window.open(winner.link, "_blank", "noopener,noreferrer");
      onOpenChange(false);
    }
  };

  // Determine active theme: Gold while spinning/default, Topic Metallic when won
  const activeTheme =
    !isSpinning && winner && winner.topic
      ? TOPIC_THEMES[winner.topic] || TOPIC_THEMES["trivia"]
      : TOPIC_THEMES["trivia"]; // Default to Gold (trivia)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-md bg-linear-to-b from-zinc-900 via-zinc-900 to-black border-4 overflow-hidden transition-colors duration-500",
          activeTheme.border,
          activeTheme.shadow
        )}
      >
        <DialogHeader className="text-center pb-2 relative z-10">
          <DialogTitle className="flex flex-col items-center justify-center gap-2">
            {isSpinning ? (
              <>
                <Loader2
                  className={cn(
                    "h-8 w-8 animate-spin",
                    activeTheme.spinnerInit
                  )}
                />
                <span
                  className={cn(
                    "text-xl font-bold bg-clip-text text-transparent bg-linear-to-r animate-pulse",
                    activeTheme.spinnerText
                  )}
                >
                  SEARCHING FOR WINNER...
                </span>
              </>
            ) : (
              <>
                <div
                  className={cn(
                    "absolute inset-0 blur-3xl animate-pulse -z-10",
                    activeTheme.glow
                  )}
                />
                <div
                  className={cn(
                    "text-sm font-bold tracking-[0.2em] animate-bounce",
                    activeTheme.congratsText
                  )}
                >
                  ★ CONGRATULATIONS ★
                </div>
                <span
                  className={cn(
                    "text-4xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-r animate-shimmer drop-shadow-sm",
                    activeTheme.winnerText
                  )}
                >
                  YOU WON!
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  (Woah!)
                </span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8 min-h-[320px] relative">
          {/* Background Effects */}
          <div
            className={cn(
              "absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent animate-pulse"
              // Override the hardcoded gradient start color if we could, but simpler is to use similar bg color
              // For now keeping generic yellow backdrop or trying to match?
              // Let's replace the from-yellow-500/10 with dynamic glow too if possible, but it's hardcoded string.
              // Let's just rely on the other glow.
            )}
          />

          {currentGame && (
            <div
              className={cn(
                "relative w-full max-w-[280px] transition-all duration-100 perspective-1000",
                isSpinning
                  ? "scale-90 blur-[2px] opacity-70 rotate-1"
                  : "scale-110 opacity-100 z-10 rotate-0"
              )}
            >
              {winner && (
                <div className="absolute -top-6 -right-6 z-20 animate-bounce">
                  <div className="relative">
                    <span
                      className={cn(
                        "absolute inset-0 rounded-full blur-md animate-ping",
                        activeTheme.bannerPing
                      )}
                    />
                    <span
                      className={cn(
                        "relative bg-linear-to-r text-white px-4 py-2 rounded-full text-sm font-black shadow-xl border-2 border-white flex items-center gap-1 uppercase tracking-widest rotate-12",
                        activeTheme.banner
                      )}
                    >
                      <Trophy className="h-4 w-4" /> #1 PICK
                    </span>
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "pointer-events-none transform transition-all",
                  !isSpinning && [
                    "ring-4 ring-offset-4 ring-offset-zinc-900 rounded-xl",
                    activeTheme.ring,
                    activeTheme.shadow.replace("50px", "30px"), // Reuse shadow color but smaller spread
                  ]
                )}
              >
                <GameCard
                  id={currentGame.id}
                  title={currentGame.title}
                  link={currentGame.link}
                  topic={currentGame.topic}
                  playCount={currentGame.playCount || 0}
                  isPlayed={false}
                  onPlay={() => {}}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          {!isSpinning && winner ? (
            <>
              <Button
                onClick={handlePlayWinner}
                size="lg"
                className={cn(
                  "w-full h-16 text-xl font-black uppercase tracking-widest bg-linear-to-r border-b-4 active:border-b-0 active:translate-y-1 transition-all shadow-xl animate-pulse",
                  activeTheme.button
                )}
              >
                <span className="flex items-center gap-2 drop-shadow-md">
                  PLAY GAME NOW
                </span>
              </Button>
              <div className="text-center">
                <button
                  onClick={() => spin()}
                  className="text-xs text-muted-foreground hover:text-white underline decoration-dotted hover:decoration-solid transition-colors"
                >
                  No thanks, I'll take another risk
                </button>
              </div>
            </>
          ) : (
            <Button
              disabled
              variant="secondary"
              className="w-full h-12 text-lg font-bold tracking-widest bg-zinc-800/50 text-zinc-500 border-2 border-zinc-800"
            >
              CALCULATING ODDS...
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
