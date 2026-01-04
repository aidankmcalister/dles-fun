"use client";

import { useState } from "react";
import { getCurrentStreak, getLongestStreak } from "@/lib/streaks";
import { TOPIC_COLORS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";
import { Flame, Trophy, Gamepad2, BarChart3, EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface HiddenGame {
  id: string;
  title: string;
  topic: string;
}

interface StatsClientProps {
  playedCount: number;
  totalGames: number;
  playedDates: string[];
  categoryData: { name: string; count: number }[];
  hiddenGames: HiddenGame[];
}

export function StatsClient({
  playedCount,
  totalGames,
  playedDates,
  categoryData,
  hiddenGames: initialHiddenGames,
}: StatsClientProps) {
  const router = useRouter();
  const [hiddenGames, setHiddenGames] = useState(initialHiddenGames);
  const dates = playedDates.map((d) => new Date(d));
  const currentStreak = getCurrentStreak(dates);
  const longestStreak = getLongestStreak(dates);

  // Sort categories by count descending
  const sortedCategories = [...categoryData].sort((a, b) => b.count - a.count);
  const maxCount = sortedCategories[0]?.count || 1;

  const completionPercent = Math.round((playedCount / totalGames) * 100);

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="min-h-[140px] p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
          <div className="flex flex-col justify-between h-full">
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              Games Played
            </div>
            <div>
              <div className="text-3xl font-bold leading-tight">
                {playedCount}
                <span className="text-lg text-muted-foreground font-normal">
                  /{totalGames}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {completionPercent}% complete
              </p>
            </div>
          </div>
        </Card>

        <Card className="min-h-[140px] p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/10">
          <div className="flex flex-col justify-between h-full">
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Current Streak
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 leading-tight">
                {currentStreak}
                <span className="text-lg font-normal"> days</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep it going!
              </p>
            </div>
          </div>
        </Card>

        <Card className="min-h-[140px] p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/10">
          <div className="flex flex-col justify-between h-full">
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Longest Streak
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-500 leading-tight">
                {longestStreak}
                <span className="text-lg font-normal"> days</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Personal best
              </p>
            </div>
          </div>
        </Card>

        <Card className="min-h-[140px] p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
          <div className="flex flex-col justify-between h-full">
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Top Category
            </div>
            <div>
              {sortedCategories[0] ? (
                <>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-lg capitalize font-medium px-3 py-1 w-fit",
                      TOPIC_COLORS[sortedCategories[0].name]
                    )}
                  >
                    {sortedCategories[0].name}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {sortedCategories[0].count} games played
                  </p>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground text-3xl leading-tight">
                    —
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No games yet
                  </p>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Category Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Games by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedCategories.length > 0 ? (
            <div className="space-y-3">
              {sortedCategories.map(({ name, count }) => (
                <div key={name} className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "w-28 justify-center capitalize shrink-0",
                      TOPIC_COLORS[name]
                    )}
                  >
                    {name}
                  </Badge>
                  <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500 flex items-center justify-end pr-2",
                        TOPIC_COLORS[name]?.replace("text-", "bg-") ||
                          "bg-primary"
                      )}
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-white drop-shadow">
                        {count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Play some games to see your stats!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Hidden Games Section */}
      {hiddenGames.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EyeOff className="h-5 w-5" />
              Hidden Games ({hiddenGames.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hiddenGames.map((game) => {
                const handleUnhide = async () => {
                  try {
                    await fetch(`/api/user-games/${game.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ hidden: false }),
                    });
                    setHiddenGames((prev) =>
                      prev.filter((g) => g.id !== game.id)
                    );
                    router.refresh();
                  } catch (error) {
                    console.error("Failed to unhide game:", error);
                  }
                };

                return (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{game.title}</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "capitalize text-xs",
                          TOPIC_COLORS[game.topic]
                        )}
                      >
                        {game.topic}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleUnhide}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Unhide
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
