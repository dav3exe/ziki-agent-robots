import Link from "next/link";
import { Clock } from "lucide-react";
import type { Issue } from "@/lib/types";
import type { Verdict } from "@/lib/verdict";
import CallActions from "./call-actions";
import VerdictSummary from "./verdict-summary";

/** One issue in the Inbox's "Ready for your call" tab: the verdict and the three choices, without opening the issue. */
export default function CallCard({ issue, verdict }: { issue: Issue; verdict: Verdict }) {
  return (
    <article className="space-y-4 rounded-xl border border-zk-border bg-zk-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={`/issues/${issue.id}`} className="font-semibold text-zk-text hover:text-zk-accent">
            <span className="text-zk-muted">#{issue.id}</span> {issue.title}
          </Link>
          <p className="mt-1 text-xs text-zk-muted">
            {issue.type} · {issue.platform} · by {issue.assignee}
            {issue.pr && <> · PR {issue.pr}</>}
          </p>
        </div>
        {issue.waitingFor && (
          <span className="flex items-center gap-1 rounded-full border border-zk-warn-bd bg-zk-warn-bg px-2 py-0.5 text-xs font-semibold text-zk-warn-fg">
            <Clock className="size-3.5" /> Waiting {issue.waitingFor}
          </span>
        )}
      </div>
      <VerdictSummary verdict={verdict} />
      <CallActions issue={issue} verdict={verdict} />
    </article>
  );
}
