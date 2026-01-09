"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { DlesButton } from "@/components/design/dles-button";
import { Race } from "@/app/race/[id]/page";
import { Home, Loader2 } from "lucide-react";
import { WinnerCard } from "@/components/features/race/results/winner-card";
import {
  ResultsList,
  ParticipantWithSplits,
  RaceGameWithGame,
} from "@/components/features/race/results/results-list";
import { toast } from "sonner";

export default function RaceResultsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const [race, setRace] = useState<Race | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestId, setGuestId] = useState<string | null>(null);

  const fetchRace = useCallback(async () => {
    try {
      const res = await fetch(`/api/race/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        // Redirect to race page if not completed
        if (data.status !== "completed") {
          router.replace(`/race/${id}`);
          return;
        }
        setRace(data);
      } else {
        toast.error("Failed to load race");
      }
    } catch (error) {
      console.error("Failed to fetch race:", error);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchRace();
  }, [fetchRace]);

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const stored = localStorage.getItem(`race_guest_${id}`);
      if (stored) setGuestId(stored);
    }
  }, [id]);

  // 1. Sort Games by Order
  const sortedGames = useMemo(
    () => (race ? [...race.raceGames].sort((a, b) => a.order - b.order) : []),
    [race]
  ) as RaceGameWithGame[];

  // 2. Calculate Durations (Splits) per Participant
  const participantsWithSplits = useMemo(() => {
    if (!race) return [];
    return race.participants.map((p) => {
      let prevTime = 0;
      const splits = sortedGames.map((rg) => {
        const c = p.completions.find((x) => x.raceGameId === rg.id);
        if (!c) {
          return {
            id: rg.id,
            duration: null,
            skipped: false,
            cumulative: null,
          };
        }
        const duration = c.timeToComplete - prevTime;
        const cumulative = c.timeToComplete;
        prevTime = cumulative;

        return { id: rg.id, duration, skipped: c.skipped, cumulative };
      });

      return { ...p, splits };
    });
  }, [race, sortedGames]) as ParticipantWithSplits[];

  // 3. Sort Participants by:
  //    a) Completion Count (Non-skipped) - Descending
  //    b) Final Total Time - Ascending
  const sortedParticipants = useMemo(() => {
    return [...participantsWithSplits].sort((a, b) => {
      // Count non-skipped games
      const completedA = a.splits.filter(
        (s) => s.duration !== null && !s.skipped
      ).length;
      const completedB = b.splits.filter(
        (s) => s.duration !== null && !s.skipped
      ).length;

      // Primary Sort: Most completed games wins
      if (completedA !== completedB) {
        return completedB - completedA;
      }

      // Secondary Sort: Lowest total time wins
      const timeA = a.totalTime ?? Number.MAX_SAFE_INTEGER;
      const timeB = b.totalTime ?? Number.MAX_SAFE_INTEGER;
      return timeA - timeB;
    });
  }, [participantsWithSplits]);

  const winner = sortedParticipants[0];
  const currentUser = session?.user ?? null;
  const isWinner =
    !!winner &&
    ((!!currentUser && winner.userId === currentUser.id) ||
      (!!guestId && winner.id === guestId));

  const myParticipantId = useMemo(() => {
    return sortedParticipants.find(
      (p) =>
        (currentUser && p.userId === currentUser.id) ||
        (guestId && p.id === guestId)
    )?.id;
  }, [sortedParticipants, currentUser, guestId]);

  if (loading || sessionLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!race) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-heading-page">Race not found</h1>
        <p className="mt-2 text-body text-muted-foreground">
          Make sure you have the correct link.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 space-y-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
        {/* Left Sidebar: Results Summary */}
        <div className="lg:sticky lg:top-8 order-1 lg:order-0">
          <WinnerCard
            winner={winner}
            isWinner={isWinner}
            totalGames={race.raceGames.length}
            sortedGames={sortedGames}
            myResults={sortedParticipants.find((p) => p.id === myParticipantId)}
          />
        </div>

        {/* Right Content: Game List + Actions */}
        <div className="space-y-12 order-2 lg:order-0 min-w-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Race Breakdown
              </h3>
              <span className="text-xs font-mono text-white/30">
                {sortedGames.length} GAMES
              </span>
            </div>
            <ResultsList
              sortedGames={sortedGames}
              participantsWithSplits={participantsWithSplits}
              sortedParticipants={sortedParticipants}
              myParticipantId={myParticipantId}
            />
          </div>

          {/* Actions (Moved here) */}
          <div className="flex flex-col items-center gap-6 pb-20">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <DlesButton
                href="/race/new"
                className="h-14 px-10 font-bold text-lg w-full sm:w-auto min-w-[220px]"
              >
                Start New Race
              </DlesButton>
            </div>

            <div className="flex items-center gap-2">
              <DlesButton
                onClick={() => {
                  const wins =
                    winner?.splits.filter(
                      (s) => s.duration !== null && !s.skipped
                    ).length || 0;
                  const text = `🏁 Race Results 🏁\n\n${
                    isWinner ? "🏆 I Won!" : "🥈 Race Complete"
                  }\n⏱️ Time: ${Math.floor((winner?.totalTime || 0) / 60)}:${(
                    (winner?.totalTime || 0) % 60
                  )
                    .toString()
                    .padStart(2, "0")}\n🎯 Score: ${wins}/${
                    race.raceGames.length
                  }\n\nPlay at dles.fun`;
                  navigator.clipboard.writeText(text);
                  toast.success("Results copied to clipboard!");
                }}
                variant="ghost"
                className="text-muted-foreground hover:text-white"
              >
                Share Results
              </DlesButton>

              <div className="h-4 w-px bg-white/10" />

              <DlesButton
                href="/"
                variant="ghost"
                className="text-muted-foreground hover:text-white"
              >
                <Home className="h-4 w-4 mr-2" /> Home
              </DlesButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
