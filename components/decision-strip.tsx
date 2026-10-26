"use client";

import { CircleCheck, CircleX, Hand, ShieldCheck } from "lucide-react";
import type { Decision } from "@/lib/types";
import { DECISION_TEXT } from "@/lib/decisions";

const ICON = { confirmed: ShieldCheck, claimed: Hand, good_to_merge: CircleCheck, not_ready: CircleX };
const TONE = { confirmed: "text-zk-accent", claimed: "text-zk-warn-fg", good_to_merge: "text-zk-ok-fg", not_ready: "text-zk-bad-fg" };

/** "Agent decisions": Ziki's strip of what each agent said, with the full list below it. */
export default function DecisionStrip({ decisions }: { decisions: Decision[] }) {
  if (decisions.length === 0) return null;
  return (
    <section className="rounded-xl border border-zk-border bg-zk-surface">
      <div className="flex items-stretch gap-3 overflow-x-auto p-3">
        <div className="flex w-[72px] shrink-0 flex-col items-center justify-center rounded-lg border border-zk-border px-2 py-1.5 text-center">
          <span className="font-display text-2xl font-extrabold">{decisions.length}</span>
          <span className="text-[9px] leading-tight font-bold tracking-wider text-zk-muted uppercase">Agent decisions</span>
        </div>
        {decisions.slice(0, 6).map((d, i) => (
          <DecisionChip key={i} d={d} />
        ))}
      </div>
      <ol className="space-y-2 border-t border-zk-divider p-4">
          {decisions.map((d, i) => {
            const Icon = ICON[d.kind];
            return (
              <li key={i} className="flex gap-2.5 text-sm">
                <Icon className={`mt-0.5 size-4 shrink-0 ${TONE[d.kind]}`} />
                <span className="min-w-0 text-zk-text2">
                  <b className="text-zk-text">{d.agent}</b> {DECISION_TEXT[d.kind](d).toLowerCase()} on behalf of {d.owner}
                  <span className="block text-xs text-zk-muted">{d.at}</span>
                </span>
              </li>
            );
          })}
      </ol>
    </section>
  );
}

function DecisionChip({ d }: { d: Decision }) {
  const Icon = ICON[d.kind];
  return (
    <div className="flex w-[180px] shrink-0 items-center gap-2.5 px-1">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zk-tint">
        <Icon className={`size-4 ${TONE[d.kind]}`} />
      </span>
      <span className="min-w-0 text-xs">
        <b className="block truncate text-zk-text">{d.agent}</b>
        <span className="block truncate text-zk-text2">“{DECISION_TEXT[d.kind](d)}”</span>
      </span>
    </div>
  );
}
