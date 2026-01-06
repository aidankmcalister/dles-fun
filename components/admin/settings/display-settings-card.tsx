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
    <div className="h-full bg-background/50 border border-border/20 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/20">
        <Sliders className="h-4 w-4 text-muted-foreground" />
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
                className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest block font-mono"
              >
                New Game Duration
              </Label>
              <p className="text-[11px] text-muted-foreground/60 italic leading-tight font-mono">
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
                className="h-10 bg-muted/20 border-border/20 focus:border-border transition-all font-mono text-xs"
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
                className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest block font-mono"
              >
                Default Sort Order
              </Label>
              <p className="text-[11px] text-muted-foreground/60 italic leading-tight font-mono">
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
                className="h-10 bg-muted/20 border-border/20 focus:border-border transition-all font-mono text-xs"
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

        <div className="space-y-6 md:border-l border-border/20 md:pl-8">
          <Field>
            <div className="space-y-1 mb-2">
              <Label
                htmlFor="minPlayStreak"
                className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest block font-mono"
              >
                Streak Threshold
              </Label>
              <p className="text-[11px] text-muted-foreground/60 italic leading-tight font-mono">
                Minimum plays to show streak UI
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Input
                id="minPlayStreak"
                type="number"
                {...register("minPlayStreak", { valueAsNumber: true })}
                className="w-24 h-10 bg-muted/20 border-border/20 focus:border-border transition-all font-mono text-sm"
              />
              <span className="text-xs font-mono text-muted-foreground uppercase">
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
