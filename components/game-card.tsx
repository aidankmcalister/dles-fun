"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export interface GameCardProps {
  id: string;
  title: string;
  link: string;
  topic: string;
  isPlayed: boolean;
  onPlay: (id: string) => void;
}

// Extract domain from URL for display
function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return domain;
  } catch {
    return url;
  }
}

// Map topic to display colors
const topicColors: Record<string, string> = {
  words: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  puzzle: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  geography: "bg-green-500/20 text-green-700 dark:text-green-300",
  trivia: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  entertainment: "bg-pink-500/20 text-pink-700 dark:text-pink-300",
  gaming: "bg-red-500/20 text-red-700 dark:text-red-300",
  nature: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
  food: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
  sports: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300",
};

export function GameCard({ id, title, link, topic, isPlayed, onPlay }: GameCardProps) {
  const handleClick = () => {
    onPlay(id);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      onClick={handleClick}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
        isPlayed && "opacity-50 grayscale"
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className="truncate">{title}</span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </CardTitle>
        <CardDescription className="truncate">
          {extractDomain(link)}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-0">
        <Badge
          variant="secondary"
          className={cn("capitalize", topicColors[topic] || "")}
        >
          {topic}
        </Badge>
        {isPlayed && (
          <Badge variant="outline" className="ml-auto">
            Played
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
