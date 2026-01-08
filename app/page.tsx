import prisma from "@/lib/prisma";
import type { Game } from "@/app/generated/prisma/client";
import { Suspense } from "react";
import { GameGridSkeleton } from "@/components/features/games/game-grid";
import { GamesClient } from "@/components/features/games/games-client";

export const revalidate = 60;

async function GamesFetcher() {
  let games: Game[] = [];

  try {
    games = await prisma.game.findMany({
      where: { archived: false },
      orderBy: [{ playCount: "desc" }, { title: "asc" }],
    });
  } catch {
    // Table may not exist yet
  }

  const siteConfig = await prisma.siteConfig.findUnique({
    where: { id: "default" },
  });

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-300">
        <h1 className="text-heading-page text-foreground mb-2">dles.fun</h1>
        <p className="text-heading-section text-muted-foreground">
          No games yet.
        </p>
        <p className="text-body-small text-muted-foreground/80 mt-1">
          Add a game using the admin tools, or run the seed script.
        </p>
      </div>
    );
  }

  return (
    <GamesClient games={games} newGameMinutes={siteConfig?.newGameMinutes} />
  );
}

export default function Page() {
  return (
    <main className="min-h-screen px-4 pt-4 pb-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Suspense
          fallback={
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-64 bg-muted rounded-md animate-pulse" />
                  <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
                  <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
                </div>
              </div>
              <GameGridSkeleton count={48} />
            </div>
          }
        >
          <GamesFetcher />
        </Suspense>
      </div>
    </main>
  );
}
