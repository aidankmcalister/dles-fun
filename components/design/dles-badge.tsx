import React from "react";
import { cn, formatTopic } from "@/lib/utils";
import { TOPIC_COLORS, LIST_CARD_STYLES, TOPICS } from "@/lib/constants";

export type BadgeSize = "xs" | "sm" | "md" | "lg";

export interface DlesBadgeProps {
  /** The text to display */
  text: string;
  /** Color key - can be a topic (words, geography, etc.) or a list color (slate, red, etc.) or 'brand' */
  color: string;
  /** Optional count to display on the right side */
  count?: number;
  /** Size variant */
  size?: BadgeSize;
  /** Additional CSS classes */
  className?: string;
  /** Optional icon on the left */
  icon?: React.ReactNode;
}

const SIZE_CLASSES: Record<BadgeSize, string> = {
  xs: "text-[8px] px-1.5 py-0.5 font-bold",
  sm: "text-[10px] px-2.5 py-1 font-bold",
  md: "text-body-small px-3 py-1.5 font-semibold",
  lg: "text-sm px-4 py-2 font-semibold",
};

/**
 * Unified badge component for topics, list chips, and general colored badges.
 *
 * @example
 * // Topic badge
 * <DlesBadge text="Words" color="words" />
 *
 * // List badge with count
 * <DlesBadge text="My Favorites" color="blue" count={12} />
 *
 * // Brand badge
 * <DlesBadge text="All Topics" color="brand" />
 */
export function DlesBadge({
  text,
  color,
  count,
  size = "md",
  className,
  icon,
}: DlesBadgeProps) {
  // Determine the color classes
  const getColorClasses = () => {
    // Special "all" for topics
    if (color === "all") {
      return "bg-brand-500/10 border-brand-500/30 text-brand-700 dark:text-brand-300";
    }

    // Brand color
    if (color === "brand") {
      return (
        LIST_CARD_STYLES["brand"]?.card ||
        "bg-brand-500/10 border-brand-500/30 text-brand-700 dark:text-brand-300"
      );
    }

    // Check if it's a topic color
    if (TOPICS.includes(color)) {
      return TOPIC_COLORS[color] || "bg-muted text-muted-foreground";
    }

    // Check if it's a list card style
    if (LIST_CARD_STYLES[color]) {
      return LIST_CARD_STYLES[color].card;
    }

    // Fallback
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-between rounded-full border transition-colors",
        "w-fit max-w-full",
        SIZE_CLASSES[size],
        getColorClasses(),
        className
      )}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{text}</span>
      </div>

      {count !== undefined && (
        <span className="ml-2 font-mono font-bold tabular-nums opacity-80 shrink-0">
          {count}
        </span>
      )}
    </div>
  );
}

/**
 * Helper function to format topic names for display.
 * Re-exported for convenience when migrating from DlesTopic.
 */
export { formatTopic };
