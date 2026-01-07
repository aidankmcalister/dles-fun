"use client";

import { Badge } from "@/components/ui/badge";
import { UserButton } from "@/components/layout/user-button";
import { useImpersonation } from "@/components/impersonation-provider";
import { cn } from "@/lib/utils";
import type { Role } from "@/app/generated/prisma/client";

const ROLE_COLORS: Record<Role, string> = {
  owner:
    "bg-brand-500/5 text-brand-700 dark:text-brand-300 border-brand-500/20 border",
  coowner:
    "bg-violet-500/5 text-violet-700 dark:text-violet-300 border-violet-500/20 border",
  admin:
    "bg-blue-500/5 text-blue-700 dark:text-blue-300 border-blue-500/20 border",
  member:
    "bg-zinc-500/5 text-zinc-700 dark:text-zinc-300 border-zinc-500/20 border",
};

const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  coowner: "Co-owner",
  admin: "Admin",
  member: "Member",
};

export function AdminHeader({ canManageUsers }: { canManageUsers: boolean }) {
  const { effectiveRole, viewAsRole } = useImpersonation();

  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <Badge
            className={cn(
              "capitalize text-body-small",
              ROLE_COLORS[effectiveRole || "member"],
              viewAsRole && "border-dashed border-2"
            )}
          >
            {viewAsRole && "Viewing as "}
            {ROLE_LABELS[effectiveRole || "member"]}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Manage games{canManageUsers ? " and users" : ""}.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <UserButton />
      </div>
    </div>
  );
}
