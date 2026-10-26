import type { Verdict } from "@/lib/verdict";

const LEAN_TEXT: Record<Verdict["lean"], string> = {
  merge: "Agents agree it's ready",
  mixed: "Agents disagree",
  send_back: "Agents say it isn't ready",
};

/** The agents' verdict in one line and one bar: how many say merge, how many don't, and what the other side said. */
export default function VerdictSummary({ verdict }: { verdict: Verdict }) {
  const total = verdict.merge + verdict.notReady;
  const mergePct = Math.round((verdict.merge / total) * 100);
  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm">
        <span className="font-semibold text-zk-text">{LEAN_TEXT[verdict.lean]}</span>
        <span className="text-zk-text2">
          <b className="text-zk-ok-fg">{verdict.merge}</b> say merge · <b className="text-zk-bad-fg">{verdict.notReady}</b> say not ready
        </span>
      </div>
      <div
        className="flex h-2 overflow-hidden rounded-full bg-zk-chip"
        role="img"
        aria-label={`${verdict.merge} of ${total} reviewing agents say merge`}
      >
        <span className="bg-zk-ok-fg" style={{ width: `${mergePct}%` }} />
        <span className="bg-zk-bad-fg" style={{ width: `${100 - mergePct}%` }} />
      </div>
      {verdict.dissent.length > 0 && (
        <ul className="space-y-1.5">
          {verdict.dissent.slice(0, 2).map((d) => (
            <li key={d.agent + d.at} className="rounded-lg border border-zk-border bg-zk-seg px-3 py-2 text-sm text-zk-text2">
              <span className="font-semibold text-zk-text">{d.agent}</span>{" "}
              {d.kind === "not_ready" ? "says not ready" : "says merge"}
              {d.reason && <>: “{d.reason}”</>}
            </li>
          ))}
          {verdict.dissent.length > 2 && <li className="text-xs text-zk-muted">and {verdict.dissent.length - 2} more</li>}
        </ul>
      )}
    </div>
  );
}
