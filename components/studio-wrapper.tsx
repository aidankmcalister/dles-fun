"use client";

import "@prisma/studio-core/ui/index.css";
import { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

interface StudioWrapperProps {
  children: ReactNode;
}

export default function StudioWrapper({ children }: StudioWrapperProps) {
  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Database Studio
            </h1>
            <p className="mt-2 text-muted-foreground">
              Inspect and manage the database directly.
            </p>
          </div>
          <ThemeToggle />
        </header>
        <div className="h-[calc(100vh-180px)] overflow-hidden rounded-lg border">
          {children}
        </div>
      </div>
    </main>
  );
}
