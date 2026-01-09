"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { getPlayedIds, savePlayedIds } from "@/lib/played-state";
import { getCurrentStreak, getLongestStreak } from "@/lib/streaks";

interface UserGame {
  id: string;
  gameId: string;
  playedAt: string;
  hidden: boolean;
  played: boolean;
}

interface UsePlayedGamesResult {
  playedIds: Set<string>;
  hiddenIds: Set<string>;
  currentStreak: number;
  longestStreak: number;
  isLoading: boolean;
  isAuthenticated: boolean;
  markAsPlayed: (gameId: string) => Promise<void>;
  unmarkAsPlayed: (gameId: string) => Promise<void>;
  toggleHidden: (gameId: string, hidden: boolean) => Promise<void>;
  syncFromLocalStorage: () => Promise<void>;
  clearLocalPlayed: () => void;
  playedDates: Record<string, string[]>;
}

export function usePlayedGames(gameIds: string[]): UsePlayedGamesResult {
  const { data: session, isPending } = useSession();
  const [playedIds, setPlayedIds] = useState<Set<string>>(new Set());
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  // Store played dates as map: gameId -> array of ISO date strings
  const [playedDatesMap, setPlayedDatesMap] = useState<
    Record<string, string[]>
  >({});
  const [historyDates, setHistoryDates] = useState<Date[]>([]); // For streak calculation
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!session?.user;

  // Create a stable key for gameIds to avoid re-renders from array reference changes
  const gameIdsKey = useMemo(() => gameIds.slice().sort().join(","), [gameIds]);

  // Fetch user games from API if authenticated
  useEffect(() => {
    if (isPending) return;

    const fetchData = async () => {
      setIsLoading(true);

      if (isAuthenticated) {
        try {
          // Fetch user games for today's played status and hidden status
          const res = await fetch("/api/user-games");
          if (res.ok) {
            const userGames: UserGame[] = await res.json();
            const played = new Set<string>();
            const hidden = new Set<string>();

            const today = new Date().toISOString().split("T")[0];
            userGames.forEach((ug) => {
              if (gameIds.includes(ug.gameId)) {
                // Only count as played if played field is true AND it was played today
                const playedDate = new Date(ug.playedAt)
                  .toISOString()
                  .split("T")[0];
                if (ug.played && playedDate === today) {
                  played.add(ug.gameId);
                }

                if (ug.hidden) {
                  hidden.add(ug.gameId);
                }
              }
            });

            setPlayedIds(played);
            setHiddenIds(hidden);

            const map: Record<string, string[]> = {};
            userGames.forEach((ug) => {
              if (!map[ug.gameId]) map[ug.gameId] = [];
              map[ug.gameId].push(ug.playedAt);
            });
            setPlayedDatesMap(map);
          }

          // Fetch play history from GamePlayLog for accurate streak calculation
          const historyRes = await fetch("/api/user-games/history");
          if (historyRes.ok) {
            const { dates: dateStrings } = await historyRes.json();
            const dates = dateStrings.map((d: string) => new Date(d));
            setHistoryDates(dates);
          }
        } catch (error) {
          console.error("Failed to fetch user games:", error);
        }
      } else {
        // Use localStorage for guests
        const storedIds = getPlayedIds();
        const validIds = new Set<string>();
        storedIds.forEach((id) => {
          if (gameIds.includes(id)) {
            validIds.add(id);
          }
        });
        setPlayedIds(validIds);
        setHiddenIds(new Set()); // Guests can't hide
        setHistoryDates([]); // No streak tracking for guests
      }

      setIsLoading(false);
    };

    fetchData();
  }, [isAuthenticated, isPending, gameIdsKey]);

  const markAsPlayed = useCallback(
    async (gameId: string) => {
      // Optimistic update
      setPlayedIds((prev) => new Set(prev).add(gameId));

      if (isAuthenticated) {
        try {
          await fetch("/api/user-games", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId }),
          });
          setHistoryDates((prev) => [...prev, new Date()]);
          setPlayedDatesMap((prev) => ({
            ...prev,
            [gameId]: [...(prev[gameId] || []), new Date().toISOString()],
          }));
        } catch (error) {
          console.error("Failed to mark as played:", error);
          // Revert on failure
          setPlayedIds((prev) => {
            const next = new Set(prev);
            next.delete(gameId);
            return next;
          });
        }
      } else {
        // Save to localStorage for guests
        setPlayedIds((prev) => {
          const next = new Set(prev).add(gameId);
          savePlayedIds(next);
          return next;
        });
        // Update local map (optional, but good for immediate sort update for guests)
        setPlayedDatesMap((prev) => ({
          ...prev,
          [gameId]: [...(prev[gameId] || []), new Date().toISOString()],
        }));

        // Still update play count
        fetch(`/api/games/${gameId}/play`, { method: "PATCH" }).catch(
          console.error
        );
      }
    },
    [isAuthenticated]
  );

  const toggleHidden = useCallback(
    async (gameId: string, hidden: boolean) => {
      if (!isAuthenticated) return; // Guests can't hide

      // Optimistic update
      setHiddenIds((prev) => {
        const next = new Set(prev);
        if (hidden) {
          next.add(gameId);
        } else {
          next.delete(gameId);
        }
        return next;
      });

      try {
        await fetch(`/api/user-games/${gameId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hidden }),
        });
      } catch (error) {
        console.error("Failed to toggle hidden:", error);
        // Revert on failure
        setHiddenIds((prev) => {
          const next = new Set(prev);
          if (hidden) {
            next.delete(gameId);
          } else {
            next.add(gameId);
          }
          return next;
        });
      }
    },
    [isAuthenticated]
  );

  const unmarkAsPlayed = useCallback(
    async (gameId: string) => {
      // Optimistic update
      setPlayedIds((prev) => {
        const next = new Set(prev);
        next.delete(gameId);
        return next;
      });

      if (isAuthenticated) {
        try {
          await fetch(`/api/user-games/${gameId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ played: false }),
          });
        } catch (error) {
          console.error("Failed to unmark as played:", error);
          // Revert on failure
          setPlayedIds((prev) => new Set(prev).add(gameId));
        }
      } else {
        // Save to localStorage for guests
        setPlayedIds((prev) => {
          const next = new Set(prev);
          next.delete(gameId);
          savePlayedIds(next);
          return next;
        });
      }
    },
    [isAuthenticated]
  );

  const syncFromLocalStorage = useCallback(async () => {
    if (!isAuthenticated) return;

    const localIds = getPlayedIds();
    if (localIds.size === 0) return;

    try {
      await fetch("/api/user-games/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameIds: [...localIds] }),
      });
      // Clear localStorage after successful sync
      savePlayedIds(new Set());
    } catch (error) {
      console.error("Failed to sync from localStorage:", error);
    }
  }, [isAuthenticated]);

  const clearLocalPlayed = useCallback(async () => {
    setPlayedIds(new Set());
    savePlayedIds(new Set());

    if (isAuthenticated) {
      try {
        await fetch("/api/user-games", { method: "DELETE" });
      } catch (error) {
        console.error("Failed to clear database played games:", error);
      }
    }
  }, [isAuthenticated]);

  return {
    playedIds,
    hiddenIds,
    currentStreak: getCurrentStreak(historyDates),
    longestStreak: getLongestStreak(historyDates),
    isLoading,
    isAuthenticated,
    markAsPlayed,
    unmarkAsPlayed,
    toggleHidden,
    syncFromLocalStorage,
    clearLocalPlayed,
    playedDates: playedDatesMap,
  };
}
