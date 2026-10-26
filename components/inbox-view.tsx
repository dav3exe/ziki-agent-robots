"use client";

import Link from "next/link";
import { Bot, Inbox, Settings } from "lucide-react";
import { useState } from "react";
import { useCalls } from "@/lib/calls";
import { MY_AGENT } from "@/lib/data";
import type { InboxTab, Issue } from "@/lib/types";
import { QUORUM, verdictOf } from "@/lib/verdict";
import CallCard from "./call-card";
import NewTag from "./new-tag";

const TABS: { tab: InboxTab; label: string; empty: string; isNew?: boolean }[] = [
  { tab: "call", label: "Ready for your call", empty: "No fix is waiting on your decision.", isNew: true },
  { tab: "input", label: "Need your input", empty: "No agent is waiting on an answer." },
  { tab: "design", label: "Design feedback needed", empty: "No design is waiting on feedback." },
  { tab: "idea", label: "New ideas", empty: "No new ideas right now." },
];

/** Ziki's Inbox. The proposal adds the first tab: fixes the agents have finished reviewing, waiting on a person to decide. */
export default function InboxView({ issues }: { issues: Issue[] }) {
  const calls = useCalls();
  const [tab, setTab] = useState<InboxTab>("call");

  // Decided fixes stay on screen (with Undo) after the undecided ones; only undecided ones count.
  const withVerdict = issues.filter((i) => i.status === "in_progress" && verdictOf(i));
  const ready = withVerdict.filter((i) => !calls[i.id]);
  const lists: Record<InboxTab, Issue[]> = {
    call: [...ready, ...withVerdict.filter((i) => calls[i.id])],
    input: issues.filter((i) => i.inbox === "input"),
    design: issues.filter((i) => i.inbox === "design"),
    idea: issues.filter((i) => i.inbox === "idea"),
  };
  const current = TABS.find((t) => t.tab === tab)!;

  return (
    <div className="space-y-5">
      <div className="grid overflow-hidden rounded-xl border border-zk-border md:grid-cols-[1fr_280px]">
        <div className="flex gap-3 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zk-tint text-zk-accent"><Inbox className="size-5" /></span>
          <div className="text-sm leading-relaxed text-zk-text2">
            <p className="font-semibold text-zk-text">How the Inbox works</p>
            <p>
              Agents work through issues on their own and stop here when they need a person: to answer a question, give feedback on a design, or weigh in on a new idea.{" "}
              <span className="text-zk-text">
                Once {QUORUM} agents have reviewed a fix, Ziki stops asking for more reviews and brings it here for you to merge or send back.
              </span>{" "}
              <NewTag />
            </p>
          </div>
        </div>
        <div className="border-t border-zk-border p-4 md:border-t-0 md:border-l">
          <p className="mb-2 text-xs font-bold tracking-wider text-zk-text2 uppercase">Your agents</p>
          <div className="flex items-start gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-zk-tint text-zk-accent"><Bot className="size-5" /></span>
            <div className="min-w-0 flex-1 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{MY_AGENT.name}</span>
                <span className="flex items-center gap-2">
                  <span className="rounded-full border border-zk-border px-2.5 py-0.5 text-xs text-zk-text2">Work</span>
                  <Settings className="size-4 text-zk-muted" />
                </span>
              </div>
              <span className="mt-1 inline-block rounded-md bg-zk-chip px-2 py-0.5 text-xs text-zk-text2">{MY_AGENT.state}</span>
              <p className="mt-1 text-zk-text2">{MY_AGENT.activity}</p>
              <p className="text-xs text-zk-muted">Last 30 days: {MY_AGENT.confirmed} confirmed</p>
            </div>
          </div>
        </div>
      </div>

      <div role="tablist" aria-label="Inbox" className="flex gap-1 overflow-x-auto border-b border-zk-divider">
        {TABS.map((t) => (
          <button
            key={t.tab}
            role="tab"
            type="button"
            aria-selected={tab === t.tab}
            onClick={() => setTab(t.tab)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-3 pb-2.5 text-sm font-semibold ${tab === t.tab ? "border-zk-accent text-zk-text" : "border-transparent text-zk-text2 hover:text-zk-text"}`}
          >
            {t.label}
            <span className="rounded-md bg-zk-chip px-1.5 font-mono text-xs text-zk-text2">{t.tab === "call" ? ready.length : lists[t.tab].length}</span>
            {t.isNew && <NewTag />}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="space-y-3">
        {tab === "call" && lists.call.map((issue) => <CallCard key={issue.id} issue={issue} verdict={verdictOf(issue)!} />)}
        {tab !== "call" &&
          lists[tab].map((issue) => (
            <Link key={issue.id} href={`/issues/${issue.id}`} className="block rounded-xl border border-zk-border bg-zk-surface p-4 hover:border-zk-muted">
              <p className="font-semibold"><span className="text-zk-muted">#{issue.id}</span> {issue.title}</p>
              {issue.question && <p className="mt-1.5 text-sm text-zk-text2">{issue.question}</p>}
            </Link>
          ))}
        {lists[tab].length === 0 && (
          <div className="rounded-xl border border-zk-border px-4 py-12 text-center">
            <p className="font-semibold">Nothing here right now.</p>
            <p className="mt-1 text-sm text-zk-text2">{current.empty}</p>
            <button type="button" className="mt-3 text-sm font-semibold text-zk-accent">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
