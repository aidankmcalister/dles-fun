import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";

// POST /api/user-games/sync - Bulk sync localStorage IDs to database
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { gameIds } = await request.json();
    if (!Array.isArray(gameIds)) {
      return NextResponse.json(
        { error: "gameIds must be an array" },
        { status: 400 }
      );
    }

    // Batch upsert - create UserGame records for games not already tracked
    const results = await Promise.all(
      gameIds.map((gameId: string) =>
        prisma.userGame.upsert({
          where: {
            userId_gameId: {
              userId: session.user.id,
              gameId,
            },
          },
          update: {}, // Don't update if exists
          create: {
            userId: session.user.id,
            gameId,
          },
        })
      )
    );

    return NextResponse.json({
      synced: results.length,
      message: `Synced ${results.length} games`,
    });
  } catch (error) {
    console.error("Failed to sync games:", error);
    return NextResponse.json(
      { error: "Failed to sync games" },
      { status: 500 }
    );
  }
}
