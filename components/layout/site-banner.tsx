"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Megaphone, X, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DlesButton } from "@/components/design/dles-button";
import { useSettings } from "@/components/settings-provider";
import { useSession, signIn } from "@/lib/auth-client";

export function SiteBanner() {
  const { settings } = useSettings();
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [guestBannerDismissed, setGuestBannerDismissed] = useState(false);

  const isAuthenticated = !!session?.user;

  // Check persisted visibility on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (settings?.welcomeMessage) {
        const dismissedMessage = localStorage.getItem(
          "dismissedWelcomeMessage"
        );
        if (dismissedMessage === settings.welcomeMessage) {
          setIsVisible(false);
        }
      }
      // Check if guest banner was dismissed
      const guestDismissed = localStorage.getItem("dismissedGuestBanner");
      if (guestDismissed === "true") {
        setGuestBannerDismissed(true);
      }
    }
  }, [settings?.welcomeMessage]);

  const isMaintenance = settings?.maintenanceMode;
  const showWelcome =
    settings?.showWelcomeMessage && settings?.welcomeMessage && isVisible;
  const showGuestBanner = !isAuthenticated && !guestBannerDismissed;

  // Maintenance banner (always show if enabled)
  if (isMaintenance) {
    return (
      <div className="relative w-full py-2 px-4 flex items-center justify-center text-xs font-bold uppercase tracking-wider transition-all group overflow-hidden border-b border-border/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 50%, currentColor 50%, currentColor 75%, transparent 75%, transparent)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4 shrink-0 animate-pulse" />
          <p className="text-center">
            <span className="flex flex-col sm:flex-row sm:gap-2 items-center">
              <strong className="uppercase tracking-wider">
                Maintenance Mode:
              </strong>
              <span>
                The site is currently undergoing maintenance. Play tracking may
                be disabled.
              </span>
            </span>
          </p>
        </div>
      </div>
    );
  }

  // Welcome banner
  if (showWelcome) {
    const handleDismiss = () => {
      setIsVisible(false);
      if (settings?.welcomeMessage) {
        localStorage.setItem(
          "dismissedWelcomeMessage",
          settings.welcomeMessage
        );
      }
    };

    return (
      <div className="relative w-full py-2 px-4 flex items-center justify-center text-xs font-bold uppercase tracking-wider transition-all group overflow-hidden border-b border-border/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
        <div className="flex items-center gap-3 max-w-4xl mx-auto pr-8">
          <Megaphone className="h-4 w-4 shrink-0" />
          <p className="text-center">{settings.welcomeMessage}</p>
        </div>
        <DlesButton
          variant="ghost"
          size="icon-sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-indigo-800/60 hover:text-indigo-800 hover:bg-indigo-500/10 dark:text-indigo-300/60 dark:hover:text-indigo-300"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </DlesButton>
      </div>
    );
  }

  // Guest sign-in banner
  if (showGuestBanner) {
    const handleDismiss = () => {
      setGuestBannerDismissed(true);
      localStorage.setItem("dismissedGuestBanner", "true");
    };

    return (
      <div className="relative w-full py-2 px-4 flex items-center justify-center text-xs font-medium transition-all overflow-hidden border-b border-border/40 bg-primary/5 text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 max-w-4xl mx-auto pr-8">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            <span>Sign in to save race history & create custom lists.</span>
          </div>

          <DlesButton
            size="sm"
            variant="outline"
            className="h-7 gap-1.5 text-xs font-semibold bg-background hover:bg-muted border-primary/20 hover:border-primary/50 text-foreground transition-all group/btn"
            onClick={() => signIn.social({ provider: "google" })}
          >
            Continue with Google
            <ArrowRight className="h-3 w-3 opacity-50 group-hover/btn:translate-x-0.5 group-hover/btn:opacity-100 transition-all" />
          </DlesButton>
        </div>
        <DlesButton
          variant="ghost"
          size="icon-sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground/60 hover:text-foreground hover:bg-muted"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </DlesButton>
      </div>
    );
  }

  return null;
}
