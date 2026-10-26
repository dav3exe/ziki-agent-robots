import { Clock, Gavel } from "lucide-react";
import type { Issue } from "@/lib/types";
import type { Verdict } from "@/lib/verdict";
import CallActions from "./call-actions";
import NewTag from "./new-tag";
import VerdictSummary from "./verdict-summary";

/** At the top of an issue the agents have finished reviewing: their verdict and a person's three choices, before anything else. */
export default function VerdictBar({ issue, verdict }: { issue: Issue; verdict: Verdict }) {
  return (
    <section aria-labelledby="call-title" className="space-y-4 rounded-xl border border-zk-accent/40 bg-zk-surface p-4 shadow-[0_0_0_4px_rgba(143,201,255,0.06)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="call-title" className="flex items-center gap-2 text-xs font-bold tracking-wider text-zk-text2 uppercase">
          <Gavel className="size-4 text-zk-accent" /> Ready for your call <NewTag />
        </h2>
        {issue.waitingFor && (
          <span className="flex items-center gap-1 rounded-full border border-zk-warn-bd bg-zk-warn-bg px-2 py-0.5 text-xs font-semibold text-zk-warn-fg">
            <Clock className="size-3.5" /> Waiting on a person · {issue.waitingFor}
          </span>
        )}
      </div>
      <VerdictSummary verdict={verdict} />
      <CallActions issue={issue} verdict={verdict} />
    </section>
  );
}
