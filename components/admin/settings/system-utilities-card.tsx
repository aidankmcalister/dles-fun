"use client";

import { DlesButton } from "@/components/design/dles-button";
import { Database, FileJson, Users2, Download } from "lucide-react";

export function SystemUtilitiesCard() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2">
      <div className="flex items-center gap-3 text-muted-foreground self-start md:self-center">
        <Database className="h-4 w-4 opacity-50" />
        <span className="font-mono text-xs font-bold uppercase tracking-widest opacity-70">
          System Operations
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        <DlesButton
          type="button"
          variant="outline"
          className="group h-10 border-dashed border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all"
          onClick={() => window.open("/api/admin/export/games", "_blank")}
        >
          <FileJson className="h-3.5 w-3.5 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Export Games
          </span>
        </DlesButton>

        <DlesButton
          type="button"
          variant="outline"
          className="group h-10 border-dashed border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all"
          onClick={() => window.open("/api/admin/export/users", "_blank")}
        >
          <Users2 className="h-3.5 w-3.5 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Export Users
          </span>
        </DlesButton>
      </div>

      <div className="hidden lg:flex items-center gap-2 text-muted-foreground/40 md:ml-auto lg:ml-0">
        <Download className="h-3 w-3" />
        <span className="text-[10px] font-mono">JSON Dump</span>
      </div>
    </div>
  );
}
