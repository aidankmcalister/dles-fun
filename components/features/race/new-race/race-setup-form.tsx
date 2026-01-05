"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { type GameList } from "@/lib/use-lists";
import { Tag, Library, Trophy, Dices, Gamepad, Globe } from "lucide-react";

export const SYSTEM_TEMPLATES = [
  {
    id: "sys-words",
    name: "Words",
    topic: "words",
    icon: Tag,
    count: 5,
    description: "5 random word games",
  },
  {
    id: "sys-logic",
    name: "Logic",
    topic: "logic",
    icon: Library,
    count: 5,
    description: "5 random logic games",
  },
  {
    id: "sys-trivia",
    name: "Trivia",
    topic: "trivia",
    icon: Trophy,
    count: 5,
    description: "5 random trivia games",
  },
  {
    id: "sys-geography",
    name: "Geography",
    topic: "geography",
    icon: Globe,
    count: 5,
    description: "5 random geography games",
  },
];

interface RaceSetupFormProps {
  name: string;
  onNameChange: (value: string) => void;
  guestName: string;
  onGuestNameChange: (value: string) => void;
  isGuest: boolean;
  lists: GameList[];
  onTemplateSelect: (id: string) => void;
  onRandomSelect: (count: number) => void;
  onManualSelect: () => void;
  onStepFocus: () => void;
}

export function RaceSetupForm({
  name,
  onNameChange,
  guestName,
  onGuestNameChange,
  isGuest,
  lists,
  onTemplateSelect,
  onRandomSelect,
}: RaceSetupFormProps) {
  return (
    <section className="space-y-6">
      {/* Race Details */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="raceName"
            className="text-xs font-medium text-muted-foreground"
          >
            Race Name
          </Label>
          <Input
            id="raceName"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="dles.fun race"
            className="h-11 text-sm font-medium bg-muted/50 border-border/50 focus:border-primary/50 focus:bg-muted rounded-lg px-4 transition-colors"
          />
        </div>

        {isGuest && (
          <div className="space-y-2">
            <Label
              htmlFor="guestName"
              className="text-xs font-medium text-muted-foreground"
            >
              Your Name
            </Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => onGuestNameChange(e.target.value)}
              placeholder="Enter your name"
              className="h-11 text-sm font-medium bg-muted/50 border-border/50 focus:border-primary/50 focus:bg-muted rounded-lg px-4 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Quick Start Section */}
      <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-4">
        <h2 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
          Quick Start — Pick a preset
        </h2>
        <TooltipProvider delayDuration={300}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Random buttons */}
            {[3, 5, 10, 15].map((count) => (
              <Tooltip key={count}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 gap-2 text-xs font-medium bg-background hover:bg-muted border-border/50"
                    onClick={() => onRandomSelect(count)}
                  >
                    <Dices className="h-4 w-4 text-primary" />
                    {count}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">
                    {count} random games from any category
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}

            {/* Category templates */}
            {SYSTEM_TEMPLATES.map((t) => (
              <Tooltip key={t.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 gap-2 text-xs font-medium bg-background hover:bg-muted border-border/50"
                    onClick={() => onTemplateSelect(t.id)}
                  >
                    <t.icon className="h-4 w-4 text-primary" />
                    {t.name}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">{t.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* Your Lists */}
        {lists.length > 0 && (
          <div className="pt-2 border-t border-border/30">
            <Select onValueChange={onTemplateSelect}>
              <SelectTrigger className="h-9 w-full text-xs border-border/50 bg-background">
                <Gamepad className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Or choose from your lists..." />
              </SelectTrigger>
              <SelectContent>
                {lists.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    <div className="flex items-center justify-between gap-4">
                      <span>{list.name}</span>
                      <Badge
                        variant="secondary"
                        className="text-[9px] h-4 px-1.5"
                      >
                        {list.gameCount}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-xs font-medium text-muted-foreground">
            or pick your own games
          </span>
        </div>
      </div>
    </section>
  );
}
