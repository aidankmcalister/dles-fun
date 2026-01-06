"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoSize = "xs" | "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
  href?: string;
  className?: string;
  showCursor?: boolean;
}

const sizeStyles: Record<LogoSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-xl sm:text-2xl",
  lg: "text-2xl sm:text-4xl",
};

export function Logo({
  size = "lg",
  href = "/",
  className,
  showCursor = true,
}: LogoProps) {
  const content = (
    <span
      className={cn(
        "font-bold tracking-tight flex items-baseline font-mono",
        sizeStyles[size],
        className
      )}
    >
      <span className="mr-1 text-brand-700 dark:text-brand-400 transition-all duration-300 group-hover/logo:translate-x-1 group-hover/logo:text-brand-600 dark:group-hover/logo:text-brand-300 drop-shadow-[0_0_10px_var(--color-brand-500)]">
        &gt;
      </span>

      <span className="text-foreground tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.25)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
        dles
      </span>

      <span className="text-brand-700 dark:text-brand-400 transition-all duration-300 group-hover/logo:text-brand-600 dark:group-hover/logo:text-brand-300 tracking-tighter drop-shadow-[0_0_10px_var(--color-brand-500)]">
        .fun
      </span>

      {showCursor && (
        <span className="animate-prompt-cursor ml-0.5 text-brand-700 dark:text-brand-400 font-bold drop-shadow-[0_0_10px_var(--color-brand-500)]">
          _
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="block w-fit group/logo select-none">
        {content}
      </Link>
    );
  }

  return content;
}
