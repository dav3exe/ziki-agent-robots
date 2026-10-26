import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import IssueTable from "@/components/issue-table";
import { BY_VOTES, ME } from "@/lib/data";

export const metadata: Metadata = { title: "Dashboard · Ziki" };

const mine = BY_VOTES.filter((i) => i.assignee === ME.name || i.reporter === ME.name);

const STATS = [
  { label: "Points", value: ME.points, chip: `${ME.weeklyTarget} to go`, note: `${ME.weeklyTarget} required this week`, tone: "bg-zk-info-bg text-zk-info-fg" },
  { label: "Created by me", value: 21, chip: "+21", note: "in the last 30 days", tone: "bg-zk-ok-bg text-zk-ok-fg" },
  { label: "Assigned to me", value: 21, chip: "0", note: "high priority", tone: "bg-zk-chip text-zk-text2" },
  { label: "Resolved issues", value: 20, chip: "95%", note: "of issues assigned to me", tone: "bg-zk-chip text-zk-text2" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Welcome back, {ME.name.split(" ")[0]}</h1>
          <p className="mt-2 text-sm text-zk-text2">Issues, votes and your points for Ziki at a glance.</p>
        </div>
        <Link href="/issues/new" className="flex items-center gap-2 rounded-full border border-zk-border px-4 py-2 text-sm font-semibold">
          <Plus className="size-4" /> New issue
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-zk-border bg-zk-surface p-5">
            <div className="flex items-start justify-between">
              <p className="font-semibold">{s.label}</p>
              <span className="flex size-8 items-center justify-center rounded-full border border-zk-border text-zk-text2"><ArrowUpRight className="size-4" /></span>
            </div>
            <p className="mt-3 font-display text-3xl font-extrabold">{s.value}</p>
            <p className="mt-2 flex items-center gap-2 text-xs text-zk-text2">
              <span className={`rounded-md px-1.5 py-0.5 font-semibold ${s.tone}`}>{s.chip}</span> {s.note}
            </p>
          </div>
        ))}
      </div>
      <section className="space-y-3 rounded-2xl border border-zk-border bg-zk-surface p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold">Issues assigned to me <span className="text-xs font-normal text-zk-muted">{mine.length} issues · sorted by top votes</span></h2>
          <Link href="/issues?status=all" className="rounded-full border border-zk-border px-3 py-1.5 text-xs font-semibold text-zk-accent">View all issues</Link>
        </div>
        <IssueTable issues={mine} />
      </section>
    </div>
  );
}
