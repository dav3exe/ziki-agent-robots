import type { Metadata } from "next";
import InboxView from "@/components/inbox-view";
import IssueTable from "@/components/issue-table";
import IssuesToolbar, { type ListView } from "@/components/issues-toolbar";
import { BY_VOTES, COUNTS, ISSUES } from "@/lib/data";

export const metadata: Metadata = { title: "Issues · Ziki" };

const LABEL: Record<Exclude<ListView, "inbox">, string> = { open: "open", in_progress: "in progress", resolved: "done", all: "" };
const VIEWS = ["open", "in_progress", "resolved", "all"] as const;

export default async function IssuesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const view: ListView = VIEWS.find((v) => v === status) ?? "inbox";
  const list = view === "all" ? BY_VOTES : BY_VOTES.filter((i) => i.status === view);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 rounded-xl bg-zk-surface p-3 sm:p-5">
      <IssuesToolbar view={view} />
      {view === "inbox" ? (
        <InboxView issues={ISSUES} />
      ) : (
        <>
          <p className="sr-only">{COUNTS[view]} {LABEL[view]} issues, sorted by top votes</p>
          <IssueTable issues={list} />
        </>
      )}
    </div>
  );
}
