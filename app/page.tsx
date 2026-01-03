import prisma from "@/lib/prisma";
import { GamesClient } from "@/components/games-client";
import { ThemeToggle } from "@/components/theme-toggle";

export const dynamic = "force-dynamic";

export default async function Page() {
  const games = await prisma.game.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Daily Games
            </h1>
            <p className="mt-2 text-muted-foreground">
              Click a game to play. Progress resets at midnight.
            </p>
          </div>
          <ThemeToggle />
        </header>
        <GamesClient games={games} />
      </div>
    </main>
  );
}
