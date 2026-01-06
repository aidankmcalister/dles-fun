"use client";

import { useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/ui/field";
import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteStatusCard() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const maintenanceMode = watch("maintenanceMode");
  const showWelcomeMessage = watch("showWelcomeMessage");

  const statusColor = maintenanceMode ? "text-red-500" : "text-emerald-500";
  const statusBg = maintenanceMode ? "bg-red-500/5" : "bg-emerald-500/5";
  const statusBorder = maintenanceMode
    ? "border-red-500/20"
    : "border-emerald-500/20";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border transition-all duration-500",
        statusBorder,
        statusBg
      )}
    >
      <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                maintenanceMode ? "bg-red-500" : "bg-emerald-500"
              )}
            />
            <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              System Status
            </h2>
          </div>
          <div className="space-y-1">
            <h1
              className={cn(
                "text-xl md:text-2xl font-bold tracking-tight",
                statusColor
              )}
            >
              {maintenanceMode ? "Maintenance Mode" : "Systems Operational"}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-md text-balance">
              {maintenanceMode
                ? "Site is locked. Only administrative accounts can access the dashboard."
                : "All systems running normally. User traffic is being served."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-background/50 backdrop-blur-sm p-4 rounded-lg border border-border/20 shadow-sm">
          <div className="space-y-1 text-right hidden md:block">
            <span className="block text-xs font-semibold text-muted-foreground">
              Maintenance
            </span>
          </div>
          <Switch
            checked={maintenanceMode}
            onCheckedChange={(v) =>
              setValue("maintenanceMode", v, { shouldDirty: true })
            }
            className="data-[state=checked]:bg-red-600"
          />
        </div>
      </div>

      {/* Broadcast Section */}
      <div className="border-t border-border/10 bg-background/30 p-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex items-center gap-3">
            <Megaphone className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground whitespace-nowrap">
              Announcement
            </span>
          </div>
          <div className="flex-1 w-full flex gap-3 items-center">
            <div className="flex items-center gap-2">
              <Switch
                checked={showWelcomeMessage}
                onCheckedChange={(v) =>
                  setValue("showWelcomeMessage", v, { shouldDirty: true })
                }
                id="broadcast-toggle"
              />
            </div>
            <div className="relative flex-1 group w-full">
              <Input
                disabled={!showWelcomeMessage}
                id="welcomeMessage"
                placeholder="Type announcement..."
                {...register("welcomeMessage")}
                className="h-9 bg-background/50 border-input/50 focus:border-primary/20 focus:bg-background/80 transition-all text-sm shadow-none w-full"
              />
            </div>
          </div>
        </div>
        {errors.welcomeMessage && (
          <div className="mt-2 text-right">
            <FieldError errors={[errors.welcomeMessage as any]} />
          </div>
        )}
      </div>
    </div>
  );
}
