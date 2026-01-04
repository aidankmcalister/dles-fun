import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";

// POST /api/lists/[id]/games - Add game to list
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { gameId } = await request.json();

    // Verify ownership
    const list = await prisma.gameList.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    const updated = await prisma.gameList.update({
      where: { id },
      data: {
        games: {
          connect: { id: gameId },
        },
      },
      include: { games: { select: { id: true } } },
    });

    return NextResponse.json({
      ...updated,
      gameCount: updated.games.length,
      games: updated.games.map((g) => g.id),
    });
  } catch (error) {
    console.error("Failed to add game to list:", error);
    return NextResponse.json(
      { error: "Failed to add game to list" },
      { status: 500 }
    );
  }
}

// DELETE /api/lists/[id]/games - Remove game from list
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { gameId } = await request.json();

    // Verify ownership
    const list = await prisma.gameList.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    const updated = await prisma.gameList.update({
      where: { id },
      data: {
        games: {
          disconnect: { id: gameId },
        },
      },
      include: { games: { select: { id: true } } },
    });

    return NextResponse.json({
      ...updated,
      gameCount: updated.games.length,
      games: updated.games.map((g) => g.id),
    });
  } catch (error) {
    console.error("Failed to remove game from list:", error);
    return NextResponse.json(
      { error: "Failed to remove game from list" },
      { status: 500 }
    );
  }
}
