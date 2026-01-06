"use client";

import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldError } from "@/components/ui/field";
import { Sliders } from "lucide-react";

export function DisplaySettingsCard() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const newGameMinutes = watch("newGameMinutes");
  const defaultSort = watch("defaultSort");

  return (
    <div className="h-full bg-card/50 border border-border/40 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/40">
        <Sliders className="h-4 w-4 text-primary" />
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
          Display Configuration
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Field>
            <div className="space-y-1 mb-2">
              <Label
                htmlFor="newGameMinutes"
                className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest block"
              >
                New Game Duration
              </Label>
              <p className="text-[11px] text-muted-foreground/60 italic leading-tight">
                How long the "NEW" badge persists
              </p>
            </div>
            <Select
              value={newGameMinutes?.toString()}
              onValueChange={(v) =>
                setValue("newGameMinutes", parseInt(v), { shouldDirty: true })
              }
            >
              <SelectTrigger
                id="newGameMinutes"
                className="h-10 bg-muted/40 border-border/40 focus:border-border transition-all"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 Minutes</SelectItem>
                <SelectItem value="60">1 Hour</SelectItem>
                <SelectItem value="360">6 Hours</SelectItem>
                <SelectItem value="1440">1 Day</SelectItem>
                <SelectItem value="4320">3 Days</SelectItem>
                <SelectItem value="10080">7 Days (Week)</SelectItem>
                <SelectItem value="20160">14 Days (2 Weeks)</SelectItem>
                <SelectItem value="43200">30 Days (Month)</SelectItem>
                <SelectItem value="-1">Never Show</SelectItem>
              </SelectContent>
            </Select>
            {errors.newGameMinutes && (
              <FieldError errors={[errors.newGameMinutes as any]} />
            )}
          </Field>

          <Field>
            <div className="space-y-1 mb-2">
              <Label
                htmlFor="defaultSort"
                className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest block"
              >
                Default Sort Order
              </Label>
              <p className="text-[11px] text-muted-foreground/60 italic leading-tight">
                Initial grid organization strategy
              </p>
            </div>
            <Select
              value={defaultSort}
              onValueChange={(v) =>
                setValue("defaultSort", v, { shouldDirty: true })
              }
            >
              <SelectTrigger
                id="defaultSort"
                className="h-10 bg-muted/40 border-border/40 focus:border-border transition-all"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">A-Z</SelectItem>
                <SelectItem value="topic">Category</SelectItem>
                <SelectItem value="played">Unplayed First</SelectItem>
              </SelectContent>
            </Select>
            {errors.defaultSort && (
              <FieldError errors={[errors.defaultSort as any]} />
            )}
          </Field>
        </div>

        <div className="space-y-6 md:border-l border-border/40 md:pl-8">
          <Field>
            <div className="space-y-1 mb-2">
              <Label
                htmlFor="minPlayStreak"
                className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest block"
              >
                Streak Threshold
              </Label>
              <p className="text-[11px] text-muted-foreground/60 italic leading-tight">
                Minimum plays to show streak UI
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Input
                id="minPlayStreak"
                type="number"
                {...register("minPlayStreak", { valueAsNumber: true })}
                className="w-24 h-10 bg-muted/40 border-border/40 focus:border-border transition-all"
              />
              <span className="text-xs font-mono text-muted-foreground">
                DAYS
              </span>
            </div>
            {errors.minPlayStreak && (
              <FieldError errors={[errors.minPlayStreak as any]} />
            )}
          </Field>
        </div>
      </div>
    </div>
  );
}
