import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";

// GET /api/user-games/history - Get user's play history for streak calculation
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all play logs for streak calculation
    // We only need unique dates, so we can group by date
    const playLogs = await prisma.gamePlayLog.findMany({
      where: { userId: session.user.id },
      select: { playedAt: true },
      orderBy: { playedAt: "desc" },
    });

    // Return array of ISO date strings
    const dates = playLogs.map((log) => log.playedAt.toISOString());

    return NextResponse.json({ dates });
  } catch (error) {
    console.error("Failed to fetch play history:", error);
    return NextResponse.json(
      { error: "Failed to fetch play history" },
      { status: 500 }
    );
  }
}
