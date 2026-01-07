"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ResultsHeaderProps {
  title?: string;
  subtitle?: string;
}

export function ResultsHeader({
  title = "Race Results",
  subtitle = "Match Summary",
}: ResultsHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div className="space-y-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Games
        </Link>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
