"use client";

import React, { createContext, useContext, useState } from "react";

interface HeaderStatsData {
  playedCount: number;
  totalCount: number;
  currentStreak: number;
  onClear: () => void;
  isAuthenticated: boolean;
}

interface StatsContextType {
  stats: HeaderStatsData | null;
  setStats: (stats: HeaderStatsData | null) => void;
}

const StatsContext = createContext<StatsContextType>({
  stats: null,
  setStats: () => {},
});

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<HeaderStatsData | null>(null);

  return (
    <StatsContext.Provider value={{ stats, setStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  return useContext(StatsContext);
}
