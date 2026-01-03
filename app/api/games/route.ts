import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Topic } from "@/app/generated/prisma/client";

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: { title: "asc" },
    });
    return NextResponse.json(games);
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, link, topic } = body as {
      title: string;
      link: string;
      topic: Topic;
    };

    if (!title || !link || !topic) {
      return NextResponse.json(
        { error: "Title, link, and topic are required" },
        { status: 400 }
      );
    }

    const game = await prisma.game.create({
      data: {
        title,
        link,
        topic,
      },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error("Failed to create game:", error);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}
