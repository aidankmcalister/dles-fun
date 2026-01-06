"use client";

import { Badge } from "@/components/ui/badge";
import { DlesTopic } from "@/components/design/dles-topic";
import { DlesButton } from "@/components/design/dles-button";
import { cn } from "@/lib/utils";
import { ExternalLink, Check, X, Loader2, Clock } from "lucide-react";
import type { SubmissionStatus, Topic } from "@/app/generated/prisma/client";
import { formatDistanceToNow } from "date-fns";

interface Submission {
  id: string;
  title: string;
  link: string;
  topic: Topic;
  description: string | null;
  status: SubmissionStatus;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface SubmissionItemProps {
  submission: Submission;
  isProcessing: boolean;
  canManage: boolean;
  onUpdateStatus: (id: string, status: SubmissionStatus) => Promise<void>;
}

export function SubmissionItem({
  submission,
  isProcessing,
  canManage,
  onUpdateStatus,
}: SubmissionItemProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full items-start md:items-center py-2">
      {/* Status Column */}
      <div className="w-[100px] shrink-0">
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] px-2 h-5 font-bold uppercase tracking-wider border transition-colors w-24 justify-center",
            submission.status === "APPROVED"
              ? "bg-green-500/10 text-green-600 border-green-500/20"
              : submission.status === "REJECTED"
              ? "bg-red-500/10 text-red-600 border-red-500/20"
              : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
          )}
        >
          {submission.status}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 grid gap-1">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold truncate">{submission.title}</span>
          <DlesTopic topic={submission.topic} size="sm" />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
          <span
            className="truncate max-w-[200px] hover:text-primary transition-colors cursor-pointer"
            title={submission.link}
            onClick={() => window.open(submission.link, "_blank")}
          >
            {submission.link}
          </span>
          <ExternalLink className="h-3 w-3 opacity-50" />
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>from {submission.user.name || submission.user.email}</span>
        </div>

        {submission.description && (
          <p className="text-xs text-muted-foreground italic mt-1 line-clamp-2">
            "{submission.description}"
          </p>
        )}
      </div>

      {/* Meta & Actions */}
      <div className="flex items-center gap-4 ml-auto md:w-[250px] justify-end">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest font-mono whitespace-nowrap">
          <Clock className="h-3 w-3 opacity-50" />
          {formatDistanceToNow(new Date(submission.createdAt))} ago
        </div>

        {canManage && submission.status === "PENDING" && (
          <div className="flex items-center gap-1 pl-4 border-l border-border/40">
            <DlesButton
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
              onClick={() => onUpdateStatus(submission.id, "REJECTED")}
              disabled={isProcessing}
              title="Reject"
            >
              {isProcessing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
            </DlesButton>
            <DlesButton
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-500/10 rounded-full"
              onClick={() => onUpdateStatus(submission.id, "APPROVED")}
              disabled={isProcessing}
              title="Approve"
            >
              {isProcessing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
            </DlesButton>
          </div>
        )}
      </div>
    </div>
  );
}
