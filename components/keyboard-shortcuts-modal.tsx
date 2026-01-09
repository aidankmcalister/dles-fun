"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard, Search, MonitorPlay, MousePointer2 } from "lucide-react";

interface ShortcutGroupProps {
  title: string;
  shortcuts: { keys: string[]; description: string }[];
}

function ShortcutGroup({ title, shortcuts }: ShortcutGroupProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="grid gap-2">
        {shortcuts.map((shortcut, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span>{shortcut.description}</span>
            <div className="flex gap-1">
              {shortcut.keys.map((key) => (
                <kbd
                  key={key}
                  className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 min-w-[20px] justify-center font-mono text-[10px] font-medium text-muted-foreground opacity-100"
                >
                  {key}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsModal({
  open,
  onOpenChange,
}: KeyboardShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-2">
          <ShortcutGroup
            title="Navigation"
            shortcuts={[
              { keys: ["?"], description: "Show keyboard shortcuts" },
              { keys: ["/"], description: "Focus search bar" },
              { keys: ["Esc"], description: "Close modal / Clear search" },
            ]}
          />
          <ShortcutGroup
            title="Games"
            shortcuts={[
              { keys: ["1", "-", "9"], description: "Open visible game #1-9" },
              { keys: ["K"], description: "Play random game" },
            ]}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
