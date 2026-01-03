"use client";

import "@prisma/studio-core/ui/index.css";
import { ReactNode } from "react";

interface StudioWrapperProps {
  children: ReactNode;
}

export default function StudioWrapper({ children }: StudioWrapperProps) {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Database Studio</h1>
        <p className="text-muted-foreground">
          View and manage your database directly.
        </p>
      </header>
      <div className="h-[calc(100vh-160px)] overflow-hidden rounded-lg border">
        {children}
      </div>
    </main>
  );
}
