"use client";

import { usePathname } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { UserButton } from "@/components/layout/user-button";

export default function RaceStatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between">
          <PageHeader
            title="Race Stats"
            subtitle="Your stats and race history."
            backHref="/"
          />
          <UserButton />
        </div>

        {children}
      </div>
    </main>
  );
}
