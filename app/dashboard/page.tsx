import { getSession, getCurrentUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { StatsClient } from "./stats-client";

export default async function StatsPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/");
  }

  // Fetch user's played games (not hidden)
  const userGames = await prisma.userGame.findMany({
    where: { userId: session.user.id, hidden: false },
    include: { game: true },
    orderBy: { playedAt: "desc" },
  });

  // Fetch hidden games
  const hiddenGames = await prisma.userGame.findMany({
    where: { userId: session.user.id, hidden: true },
    include: { game: true },
    orderBy: { playedAt: "desc" },
  });

  const totalGames = await prisma.game.count();

  // Calculate stats
  const playedDates = userGames.map((ug) => ug.playedAt);
  const categoryCount: Record<string, number> = {};

  userGames.forEach((ug) => {
    const topic = ug.game.topic;
    categoryCount[topic] = (categoryCount[topic] || 0) + 1;
  });

  return (
    <StatsClient
      playedCount={userGames.length}
      totalGames={totalGames}
      playedDates={playedDates.map((d) => d.toISOString())}
      categoryData={Object.entries(categoryCount).map(([name, count]) => ({
        name,
        count,
      }))}
      hiddenGames={hiddenGames.map((ug) => ({
        id: ug.game.id,
        title: ug.game.title,
        topic: ug.game.topic,
      }))}
    />
  );
}
