import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronUp, ExternalLink, Plus } from "lucide-react";
import Avatar from "@/components/avatar";
import Card from "@/components/card";
import DecisionStrip from "@/components/decision-strip";
import { ISSUES, issueById } from "@/lib/data";
import type { Status } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return ISSUES.map((i) => ({ id: String(i.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const issue = issueById(Number((await params).id));
  return { title: issue ? `#${issue.id} ${issue.title} · Ziki` : "Issue not found · Ziki" };
}

const STATUS_TEXT: Record<Status, string> = { open: "Open", in_progress: "In progress", resolved: "Resolved" };
const CONVERSATION_TABS = ["All", "Comments", "Bids", "Reviews", "Deliveries", "Merge requests"];

export default async function IssuePage({ params }: Props) {
  const issue = issueById(Number((await params).id));
  if (!issue) notFound();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-3">
          <h1 className="flex gap-2 font-display text-2xl leading-tight font-extrabold sm:text-[28px]">
            <Link href="/issues" aria-label="Back to issues" className="mt-1.5 shrink-0 text-zk-text2 hover:text-zk-text">
              <ArrowLeft className="size-5" />
            </Link>
            <span>
              <span className="text-zk-text2">#{issue.id}</span> {issue.title}
            </span>
          </h1>
          <div className="flex gap-2 text-xs font-semibold">
            <span className="rounded-md bg-zk-chip px-2 py-0.5 text-zk-text2">{issue.type}</span>
            {issue.platform && <span className="rounded-md bg-zk-chip px-2 py-0.5 text-zk-text2">{issue.platform}</span>}
          </div>
        </div>
        <button type="button" className="flex items-center gap-2 rounded-full border border-zk-border px-4 py-2 text-sm font-semibold">
          <ChevronUp className="size-4" /> Upvote <span className="rounded-md bg-zk-chip px-1.5 font-mono text-xs text-zk-text2">{issue.votes}</span>
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-5">
          <Card label="Description">
            <div className="space-y-1 text-sm leading-relaxed text-zk-text2">
              {issue.description.map((part) => (
                <div key={part.heading}>
                  <p className="font-bold text-zk-text">{part.heading}</p>
                  <p>{part.body}</p>
                </div>
              ))}
            </div>
          </Card>
          {issue.attachments ? (
            <Card label="Attachments">
              <div className="h-24 w-36 rounded-lg border border-zk-border bg-gradient-to-br from-zk-tint to-zk-seg" />
            </Card>
          ) : null}
          <DecisionStrip decisions={issue.decisions} />
          <Card label="Goal budgets" right={<span className="text-xs text-zk-muted">1 goal in this project</span>}>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zk-border p-3 text-sm">
              <div>
                <p className="font-semibold">Complete independent review and triage coverage for the Zedu backlog</p>
                <p className="text-xs text-zk-muted">0 of 0 credits split · 0 left · 0%</p>
              </div>
              <span className="flex gap-1.5 text-xs">
                <span className="rounded-md bg-zk-info-bg px-2 py-0.5 text-zk-info-fg">active</span>
                <span className="rounded-md bg-zk-chip px-2 py-0.5 text-zk-text2">No budget</span>
              </span>
            </div>
          </Card>
          <Card
            label={`Conversation ${issue.conversation.length}`}
            right={<button type="button" className="flex items-center gap-1 text-sm font-semibold text-zk-accent"><Plus className="size-4" /> Add comment</button>}
          >
            <div className="mb-4 flex gap-1 overflow-x-auto">
              {CONVERSATION_TABS.map((t, i) => (
                <span key={t} className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${i === 0 ? "bg-zk-blue text-white" : "text-zk-text2"}`}>
                  {t} <span className="font-mono">{i < 2 ? issue.conversation.length : 0}</span>
                </span>
              ))}
            </div>
            {issue.conversation.length === 0 && <p className="py-6 text-center text-sm text-zk-muted">No comments yet.</p>}
            <ul className="space-y-3">
              {issue.conversation.map((c, i) => (
                <li key={i} className="rounded-lg border border-zk-border p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Avatar name={c.author} />
                    <b className="text-zk-text">{c.author}</b>
                    {c.agent && <span className="text-zk-muted">via {c.agent}</span>}
                    {c.agent && <span className="rounded bg-zk-chip px-1.5 text-zk-text2">agent</span>}
                    {c.role && <span className="rounded bg-zk-info-bg px-1.5 text-zk-info-fg">{c.role}</span>}
                    <span className="ml-auto text-zk-muted">{c.at}</span>
                  </div>
                  <p className="mt-2 text-zk-text2">{c.body}</p>
                  <button type="button" className="mt-2 text-xs font-semibold text-zk-accent">Reply</button>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card label="Status">
            <div className="flex gap-2 text-xs font-semibold">
              <span className="rounded-md bg-zk-info-bg px-2 py-0.5 text-zk-info-fg">● {STATUS_TEXT[issue.status]}</span>
              <span className="rounded-md bg-zk-warn-bg px-2 py-0.5 text-zk-warn-fg">{issue.priority}</span>
            </div>
            <p className="mt-2 text-xs text-zk-muted">Opened {issue.opened} by {issue.reporter}</p>
          </Card>
          <Card label="People">
            <dl className="space-y-3 text-sm">
              {[["Reporter", issue.reporter], ["Assignee", issue.assignee]].map(([role, name]) => (
                <div key={role} className="flex items-center gap-3">
                  <dt className="w-16 text-xs text-zk-muted">{role}</dt>
                  <dd className="flex items-center gap-2">
                    {name ? <><Avatar name={name} /> {name}</> : <span className="text-zk-muted">Nobody yet</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
          {issue.pr && (
            <Card label="GitHub PR">
              <span className="flex items-center gap-2 text-sm text-zk-accent"><ExternalLink className="size-4" /> {issue.pr}</span>
            </Card>
          )}
          <Card label={`Activity (${issue.decisions.length})`}>
            <p className="text-xs text-zk-muted">Read-only history of changes on this issue.</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
