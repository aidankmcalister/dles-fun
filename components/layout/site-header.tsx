"use client";

import { Logo } from "@/components/design/logo";
import { HeaderNav } from "@/components/header/header-nav";
import { UserButton } from "@/components/layout/user-button";
import { HeaderStats } from "@/components/header/header-stats";
import { useStats } from "@/lib/stats-context";

interface SiteHeaderProps {
  /** Page title to show after logo (e.g., "Lists", "Start a Race") */
  pageTitle?: string;
  /** Whether to show the navigation bar (default: true) */
  showNav?: boolean;
}

/**
 * Global site header with logo, optional page title, stats, navigation, and user button.
 * Used across all pages for consistent navigation.
 */
export function SiteHeader({ pageTitle, showNav = true }: SiteHeaderProps) {
  const { stats } = useStats();

  return (
    <header className="border-b border-border/30">
      <div className="px-4 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Top bar: Logo (+ Page Title) + Stats + User */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Logo size="lg" href="/" />
              {pageTitle && (
                <>
                  <span className="text-muted-foreground/40 font-mono text-3xl sm:text-4xl">
                    /
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground/90">
                    {pageTitle}
                  </h1>
                </>
              )}
            </div>

            {/* Right side: Stats + User */}
            <div className="flex items-center gap-4">
              {stats && (
                <HeaderStats
                  playedCount={stats.playedCount}
                  totalCount={stats.totalCount}
                  currentStreak={stats.currentStreak}
                  onClear={stats.onClear}
                  isAuthenticated={stats.isAuthenticated}
                />
              )}
              <UserButton />
            </div>
          </div>

          {/* Navigation bar */}
          {showNav && (
            <div className="flex items-center py-3 -mt-2">
              <HeaderNav />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
