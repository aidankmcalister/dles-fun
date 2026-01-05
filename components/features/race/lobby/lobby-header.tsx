"use client";

import { PageHeader } from "@/components/layout/page-header";
import { UserButton } from "@/components/layout/user-button";
import { Race } from "@/app/race/[id]/page";

interface LobbyHeaderProps {
  race: Race;
}

export function LobbyHeader({ race }: LobbyHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <PageHeader
        title={race.name}
        subtitle={
          race.status === "waiting"
            ? "Waiting for opponents to join the race."
            : "Everyone is here. Let the games begin!"
        }
        backHref="/"
      />
      <UserButton />
    </div>
  );
}
