import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";

// GET /api/user-games - Get current user's played games
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userGames = await prisma.userGame.findMany({
      where: { userId: session.user.id },
      include: { game: true },
      orderBy: { playedAt: "desc" },
    });

    return NextResponse.json(userGames);
  } catch (error) {
    console.error("Failed to fetch user games:", error);
    return NextResponse.json(
      { error: "Failed to fetch user games" },
      { status: 500 }
    );
  }
}

// POST /api/user-games - Mark a game as played
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { gameId } = await request.json();
    if (!gameId) {
      return NextResponse.json(
        { error: "gameId is required" },
        { status: 400 }
      );
    }

    // Upsert - create if doesn't exist, update playedAt if it does
    const userGame = await prisma.userGame.upsert({
      where: {
        userId_gameId: {
          userId: session.user.id,
          gameId,
        },
      },
      update: { playedAt: new Date(), played: true },
      create: {
        userId: session.user.id,
        gameId,
        played: true,
      },
    });

    // Also increment global play count
    await prisma.game.update({
      where: { id: gameId },
      data: { playCount: { increment: 1 } },
    });

    return NextResponse.json(userGame);
  } catch (error) {
    console.error("Failed to mark game as played:", error);
    return NextResponse.json(
      { error: "Failed to mark game as played" },
      { status: 500 }
    );
  }
}
