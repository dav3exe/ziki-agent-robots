"use client";

import { useState } from "react";
import { Check, GitMerge, MessageCircleQuestion, Undo2, Undo } from "lucide-react";
import { CALL_TEXT, type CallKind, makeCall, undoCall, useCalls } from "@/lib/calls";
import type { Issue } from "@/lib/types";
import type { Verdict } from "@/lib/verdict";

const DONE_TEXT: Record<CallKind, (issue: Issue, verdict: Verdict) => string> = {
  merged: (i) => `${i.assignee ?? "The assignee"} and the reviewing agents were told, and the issue moves to Done.`,
  sent_back: (i) => `${i.assignee ?? "The assignee"} gets your note. Agents won't review it again until a new push.`,
  asked: (_, v) => `${v.dissent[0]?.agent ?? "The agent"} was asked. The answer comes back to this card, and the issue stays here until you decide.`,
};

/** A person's three choices once agents have reached a verdict: merge, send back, or ask the agent who disagreed. */
export default function CallActions({ issue, verdict }: { issue: Issue; verdict: Verdict }) {
  const call = useCalls()[issue.id];
  const [open, setOpen] = useState<"sent_back" | "asked" | null>(null);
  const dissenter = verdict.dissent[0];
  const [note, setNote] = useState("");

  if (call) {
    return (
      <div role="status" className="flex flex-wrap items-center gap-3 rounded-lg border border-zk-ok-fg/30 bg-zk-ok-bg px-3 py-2.5 text-sm text-zk-ok-fg">
        <Check className="size-4 shrink-0" />
        <span className="min-w-0 flex-1">
          <b>{CALL_TEXT[call.kind]}.</b> {DONE_TEXT[call.kind](issue, verdict)}
          {call.note && <span className="mt-1 block text-zk-text2">“{call.note}”</span>}
        </span>
        <button type="button" onClick={() => undoCall(issue.id)} className="flex items-center gap-1 text-xs font-semibold text-zk-text2 hover:text-zk-text">
          <Undo2 className="size-3.5" /> Undo
        </button>
      </div>
    );
  }

  const start = (kind: "sent_back" | "asked") => {
    setOpen(kind);
    setNote(
      kind === "sent_back"
        ? (dissenter?.reason ?? "")
        : dissenter
          ? `What would make this ready for you? You said: “${dissenter.reason ?? "not ready"}”`
          : "",
    );
  };

  const submit = () => {
    if (!open) return;
    makeCall(issue.id, { kind: open, note: note.trim() || undefined });
    setOpen(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => makeCall(issue.id, { kind: "merged" })}
          className="flex items-center gap-1.5 rounded-[10px] bg-zk-blue px-3.5 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          <GitMerge className="size-4" /> Merge
        </button>
        <button
          type="button"
          onClick={() => start("sent_back")}
          aria-pressed={open === "sent_back"}
          className={`flex items-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-sm font-semibold ${open === "sent_back" ? "border-zk-accent text-zk-accent" : "border-zk-border text-zk-text hover:border-zk-muted"}`}
        >
          <Undo className="size-4" /> Send back
        </button>
        {dissenter && (
          <button
            type="button"
            onClick={() => start("asked")}
            aria-pressed={open === "asked"}
            className={`flex items-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-sm font-semibold ${open === "asked" ? "border-zk-accent text-zk-accent" : "border-zk-border text-zk-text hover:border-zk-muted"}`}
          >
            <MessageCircleQuestion className="size-4" /> Ask {dissenter.agent}
          </button>
        )}
      </div>
      {open && (
        <div className="space-y-2 rounded-lg border border-zk-border bg-zk-seg p-3">
          <label htmlFor={`note-${issue.id}`} className="text-xs font-semibold text-zk-text2">
            {open === "sent_back" ? `Tell ${issue.assignee ?? "the assignee"} what to fix` : `Your question for ${dissenter?.agent}`}
          </label>
          <textarea
            id={`note-${issue.id}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full resize-y rounded-lg border border-zk-border bg-zk-surface px-3 py-2 text-sm text-zk-text outline-none focus:border-zk-accent"
          />
          <div className="flex gap-2">
            <button type="button" onClick={submit} disabled={!note.trim()} className="rounded-[10px] bg-zk-blue px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50">
              {open === "sent_back" ? "Send back" : "Send question"}
            </button>
            <button type="button" onClick={() => setOpen(null)} className="px-2 text-sm text-zk-text2 hover:text-zk-text">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
