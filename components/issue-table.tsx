"use client";

import Link from "next/link";
import { ChevronUp, Flag, Hammer, MessageSquare, Paperclip, Timer } from "lucide-react";
import { CALL_TEXT, useCalls } from "@/lib/calls";
import type { Issue, Priority } from "@/lib/types";
import { verdictOf } from "@/lib/verdict";
import NewTag from "./new-tag";

function PriorityBars({ priority }: { priority: Priority }) {
  const on = { Low: 1, Medium: 2, High: 3 }[priority];
  return (
    <span className="flex items-end gap-0.5" aria-label={`${priority} priority`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={`w-[3px] rounded-sm ${n <= on ? "bg-zk-text" : "bg-zk-chip"}`} style={{ height: 4 + n * 3 }} />
      ))}
    </span>
  );
}

/** Ziki's issue list, plus one change: an issue the agents have finished reviewing says it's waiting on a person. */
export default function IssueTable({ issues }: { issues: Issue[] }) {
  const calls = useCalls();
  return (
    <div className="overflow-hidden rounded-xl border border-zk-border">
      <div className="grid grid-cols-[56px_1fr_auto] gap-3 border-b border-zk-border bg-zk-seg px-3 py-2.5 text-xs text-zk-text2 sm:grid-cols-[64px_1fr_220px_64px]">
        <span>Votes</span>
        <span>Issue</span>
        <span className="hidden sm:block">Status</span>
        <span className="text-right sm:text-left">Priority</span>
      </div>
      {issues.length === 0 && <p className="px-4 py-10 text-center text-sm text-zk-muted">No issues here.</p>}
      {issues.map((issue) => {
        const verdict = issue.status === "in_progress" ? verdictOf(issue) : null;
        const call = calls[issue.id];
        return (
          <div key={issue.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 border-b border-zk-divider px-3 py-3 last:border-0 sm:grid-cols-[64px_1fr_220px_64px]">
            <button
              type="button"
              aria-label={`${issue.votes} votes, click to upvote`}
              className={`flex h-12 w-10 flex-col items-center justify-center rounded-lg border text-xs font-semibold ${issue.upvoted ? "border-zk-accent text-zk-accent" : "border-zk-border text-zk-text"}`}
            >
              <ChevronUp className="size-4" />
              {issue.votes}
            </button>
            <div className="min-w-0">
              <Link href={`/issues/${issue.id}`} className="block truncate font-semibold text-zk-text hover:text-zk-accent">
                {issue.title}
              </Link>
              <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-zk-muted">
                <span>#{issue.id}</span>
                <span className="flex items-center gap-1"><Hammer className="size-3.5" /> {issue.type}</span>
                <span className="flex items-center gap-1"><MessageSquare className="size-3.5" /> {issue.comments}</span>
                {issue.attachments ? <span className="flex items-center gap-1"><Paperclip className="size-3.5" /> {issue.attachments}</span> : null}
                {issue.platform && <span>{issue.platform}</span>}
                <span>{issue.createdAgo}</span>
              </p>
              {verdict && (
                <p className="mt-1.5 sm:hidden">
                  <WaitingChip waitingFor={issue.waitingFor} done={call && CALL_TEXT[call.kind]} />
                </p>
              )}
            </div>
            <div className="hidden min-w-0 space-y-1 text-xs sm:block">
              {verdict ? (
                <WaitingChip waitingFor={issue.waitingFor} done={call && CALL_TEXT[call.kind]} />
              ) : issue.assignee ? (
                <>
                  <p className="flex items-center gap-1.5 truncate text-zk-text2">
                    <Flag className="size-3.5 shrink-0 text-zk-ok-fg" /> {issue.assignee}
                  </p>
                  {issue.workingFor && <p className="flex items-center gap-1 pl-5 text-zk-muted"><Timer className="size-3" /> {issue.workingFor}</p>}
                </>
              ) : (
                <span className="text-zk-muted">Unassigned</span>
              )}
            </div>
            <span className="flex justify-end sm:justify-start"><PriorityBars priority={issue.priority} /></span>
          </div>
        );
      })}
    </div>
  );
}

/** "Waiting on a person" once agents have a verdict, or what the person decided. */
function WaitingChip({ waitingFor, done }: { waitingFor?: string; done?: string }) {
  if (done) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-zk-ok-bg px-2 py-0.5 font-semibold text-zk-ok-fg">{done} by you</span>;
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center gap-1 rounded-full border border-zk-warn-bd bg-zk-warn-bg px-2 py-0.5 font-semibold text-zk-warn-fg">
        Waiting on a person{waitingFor && ` · ${waitingFor}`}
      </span>
      <NewTag />
    </span>
  );
}
