"use client";

import { useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserLimitsCard() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const enableCommunitySubmissions = watch("enableCommunitySubmissions");

  return (
    <div className="h-full bg-card/50 border border-border/40 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/40">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
          User Permissions
        </h3>
      </div>

      <div className="space-y-8">
        <div>
          <div className="space-y-1 mb-2">
            <Label
              htmlFor="maxCustomLists"
              className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest block"
            >
              List Capacity
            </Label>
            <p className="text-[11px] text-muted-foreground/60 italic leading-tight">
              Max lists per user account
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              id="maxCustomLists"
              type="number"
              {...register("maxCustomLists", { valueAsNumber: true })}
              className="w-24 h-10 bg-muted/40 border-border/40 focus:border-border transition-all"
            />
            <span className="text-xs font-mono text-muted-foreground">
              LISTS
            </span>
          </div>
          {errors.maxCustomLists && (
            <FieldError errors={[errors.maxCustomLists as any]} />
          )}
        </div>

        <div className="pt-4 border-t border-border/40">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest block">
                Public Submissions
              </Label>
              <p className="text-[11px] text-muted-foreground/60 italic">
                Allow users to suggest games
              </p>
            </div>
            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50 transition-colors hover:border-border">
              <span
                className={cn(
                  "text-[10px] font-bold font-mono transition-colors w-6 text-center select-none",
                  enableCommunitySubmissions
                    ? "text-primary"
                    : "text-muted-foreground/40"
                )}
              >
                {enableCommunitySubmissions ? "ON" : "OFF"}
              </span>
              <Switch
                checked={enableCommunitySubmissions}
                onCheckedChange={(v) =>
                  setValue("enableCommunitySubmissions", v, {
                    shouldDirty: true,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
