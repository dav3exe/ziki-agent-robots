import Link from "next/link";
import { ArrowUpDown, CheckCircle2, ChevronDown, Circle, Filter, Inbox, Layers, Monitor, Plus, Search, Timer } from "lucide-react";
import { COUNTS, PROJECT } from "@/lib/data";
import InboxCount from "./inbox-count";

export type ListView = "inbox" | "open" | "in_progress" | "resolved" | "all";

const STATUSES = [
  { view: "open", label: "Open", icon: Circle, count: COUNTS.open },
  { view: "in_progress", label: "In progress", icon: Timer, count: COUNTS.in_progress },
  { view: "resolved", label: "Done", icon: CheckCircle2, count: COUNTS.resolved },
  { view: "all", label: "All", icon: Layers, count: COUNTS.all },
] as const;

const iconButton = "flex size-9 items-center justify-center rounded-[10px] border border-zk-border text-zk-text2 hover:text-zk-text";

/** The top of the issues page: breadcrumb, search/filter/sort/new, the platform picker, then Inbox and the status counts. */
export default function IssuesToolbar({ view }: { view: ListView }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zk-divider pb-4">
        <p className="flex items-center gap-2 text-[15px]">
          <Link href="/dashboard" className="text-zk-text2 hover:text-zk-text">{PROJECT}</Link>
          <span className="text-zk-muted">›</span>
          <span className="font-bold">Issues</span>
        </p>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Search issues" className={iconButton}><Search className="size-4" /></button>
          <button type="button" aria-label="Filter" className={iconButton}><Filter className="size-4" /></button>
          <button type="button" aria-label="Sort issues" className={iconButton}><ArrowUpDown className="size-4" /></button>
          <Link href="/issues/new" aria-label="New issue" className={iconButton}><Plus className="size-4" /></Link>
          <button type="button" className="flex h-9 items-center gap-2 rounded-[10px] border border-zk-border px-3 text-sm font-semibold">
            <Monitor className="size-4" /> <span className="hidden sm:inline">Platform:</span> All
            <span className="rounded-md bg-zk-chip px-1.5 font-mono text-xs text-zk-text2">0</span>
            <ChevronDown className="size-4 text-zk-muted" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/issues"
          className={`flex h-9 items-center gap-2 rounded-[10px] px-3 text-sm font-semibold ${view === "inbox" ? "bg-zk-blue text-white" : "bg-zk-tint text-zk-text"}`}
        >
          <Inbox className="size-4" /> Inbox
          <span className={`rounded-md px-1.5 font-mono text-xs ${view === "inbox" ? "bg-white/20" : "bg-zk-chip text-zk-text2"}`}><InboxCount /></span>
        </Link>
        <nav aria-label="Status" className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-zk-tint p-1">
          {STATUSES.map(({ view: v, label, icon: Icon, count }) => (
            <Link
              key={v}
              href={`/issues?status=${v}`}
              aria-current={view === v ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-[10px] px-3 py-1.5 text-sm font-semibold ${view === v ? "bg-zk-blue text-white" : "text-zk-text"}`}
            >
              <Icon className={`size-4 ${view === v ? "" : v === "resolved" ? "text-zk-ok-fg" : "text-zk-accent"}`} />
              {label}
              <span className={`font-mono text-xs ${view === v ? "rounded-md bg-white/20 px-1.5" : "text-zk-muted"}`}>{count}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
