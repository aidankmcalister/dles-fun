import { getSession } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ListsClient } from "./lists-client";

export default async function ListsPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/");
  }

  const lists = await prisma.gameList.findMany({
    where: { userId: session.user.id },
    include: {
      games: {
        select: {
          id: true,
          title: true,
          topic: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <ListsClient initialLists={lists} />;
}
