import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";

// PATCH /api/user-games/[gameId] - Toggle hidden status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { gameId } = await params;
    const { hidden, played } = await request.json();

    // Check if record exists to preserve played status
    const existing = await prisma.userGame.findUnique({
      where: {
        userId_gameId: {
          userId: session.user.id,
          gameId,
        },
      },
    });

    // Upsert to handle case where user hides a game they haven't played yet
    const userGame = await prisma.userGame.upsert({
      where: {
        userId_gameId: {
          userId: session.user.id,
          gameId,
        },
      },
      update: {
        hidden: hidden !== undefined ? hidden : undefined,
        played: played !== undefined ? played : undefined,
      },
      create: {
        userId: session.user.id,
        gameId,
        hidden: hidden || false,
        played: played || false,
      },
    });

    return NextResponse.json(userGame);
  } catch (error) {
    console.error("Failed to update game:", error);
    return NextResponse.json(
      { error: "Failed to update game" },
      { status: 500 }
    );
  }
}

// DELETE /api/user-games/[gameId] - Remove from played
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { gameId } = await params;

    await prisma.userGame.delete({
      where: {
        userId_gameId: {
          userId: session.user.id,
          gameId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user game:", error);
    return NextResponse.json(
      { error: "Failed to delete user game" },
      { status: 500 }
    );
  }
}
