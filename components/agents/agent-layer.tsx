"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAgentPrefs } from "@/lib/agent-prefs";
import { AGENT_BOTS, type AgentBot, type AgentState, STATE_LABEL } from "@/lib/agents";
import { useCalls } from "@/lib/calls";
import { Painter } from "./painter";
import { basePose, type Runtime, wander } from "./poses";
import { drawDesk, drawPrintout, drawRipples, type Ripple } from "./props";
import { drawFront, drawSide } from "./robot";

const HEIGHT = 84; // canvas pixels
const FLOOR = 80;
const HIT_W = 30, HIT_H = 74;
const SCALE = 1; // screen pixels per canvas pixel: about 68px tall robots
const EDGE = 20; // canvas pixels: a lone robot stands this close to the left edge, clear of the page text

/** What each agent is doing now. An escalation you've answered (merged, sent back, asked) stops escalating. */
function useAgents(): (AgentBot & { now: AgentState })[] {
  const calls = useCalls();
  return useMemo(
    () =>
      AGENT_BOTS.map((b) =>
        b.state === "escalating" && b.issueId && calls[b.issueId]
          ? { ...b, now: "idle" as const, task: `Your call on #${b.issueId} is in`, detail: "Back to looking for work." }
          : { ...b, now: b.state },
      ),
    [calls],
  );
}

/** Your agents as pixel-art robots along the bottom of the screen, doing what they're doing. Hover for the task, click for more. */
export default function AgentLayer() {
  const prefs = useAgentPrefs();
  const agents = useAgents();
  const shown = prefs.on ? agents.filter((a) => !prefs.hidden.includes(a.id)) : [];
  // One robot on its own goes to the far left; two or more keep their own spots.
  const visible = shown.length === 1 ? [{ ...shown[0], home: 0 }] : shown;
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const runtimes = useRef(new Map<string, Runtime>());
  const anchors = useRef(new Map<string, HTMLElement>());

  // Keep each robot where it was when the list or a state changes.
  const key = visible.map((a) => `${a.id}:${a.now}:${a.home}`).join(",");
  useEffect(() => {
    const width = Math.ceil(window.innerWidth / SCALE);
    const next = new Map<string, Runtime>();
    for (const a of visible) {
      const old = runtimes.current.get(a.id);
      const x = old && old.bot.home === a.home ? old.x : Math.max(EDGE, Math.round(a.home * width));
      next.set(a.id, {
        bot: a, state: a.now, x, dir: old?.dir ?? (a.now === "idle" ? -1 : 1),
        walking: false, target: x, pauseUntil: 0, phase: 0, tapped: false,
      });
    }
    runtimes.current = next;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    const el = canvas.current;
    if (!el || visible.length === 0) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const painter = new Painter(ctx, FLOOR);
    const ripples: Ripple[] = [];
    let frame = 0, last = 0;

    const draw = (now: number) => {
      const t = now / 1000, dt = Math.min(0.05, last ? t - last : 0);
      last = t;
      const width = Math.ceil(window.innerWidth / SCALE);
      if (el.width !== width) el.width = width;
      ctx.clearRect(0, 0, el.width, el.height);
      const fx = { tap: (x: number, y: number) => ripples.push({ x, y: FLOOR + y, born: t, rgb: "246,207,107", size: 16 }) };

      for (const rt of runtimes.current.values()) {
        if (rt.state === "idle" && !still) {
          const home = Math.max(EDGE, Math.round(rt.bot.home * width));
          wander(rt, t, dt, Math.max(16, home - 50), Math.min(width - 16, home + 50));
        }
        const pose = basePose(rt, still ? 0 : t, fx);
        painter.at(Math.round(rt.x), pose.dir);
        if (rt.state === "working") drawDesk(painter, t, !still);
        if (pose.view === "front") drawFront(painter, rt.bot.palette, pose, t);
        else drawSide(painter, rt.bot.palette, pose, t);
        if (rt.state === "reviewing") drawPrintout(painter.at(Math.round(rt.x), 1), still ? 0 : t);

        const anchor = anchors.current.get(rt.bot.id);
        if (anchor) anchor.style.left = `${Math.round(rt.x * SCALE)}px`;
      }
      drawRipples(ctx, ripples, t);
      if (!still) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [visible.length, key]);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  if (visible.length === 0) return null;
  const px = (n: number) => `${n * SCALE}px`;

  return (
    <>
      {/* Room at the end of the page, so the robots never hide its last lines. */}
      <div aria-hidden="true" style={{ height: px(HEIGHT) }} />
      <div className="pointer-events-none fixed inset-x-0 bottom-16 z-30 lg:bottom-0" style={{ height: px(HEIGHT) }}>
        <canvas ref={canvas} height={HEIGHT} className="absolute bottom-0 left-0 h-full [image-rendering:pixelated]" style={{ width: "100%" }} />
        {visible.map((a) => (
          <div
            key={a.id}
            ref={(el) => {
              if (el) anchors.current.set(a.id, el);
              else anchors.current.delete(a.id);
            }}
            className="absolute bottom-0"
            style={{ left: `${a.home * 100}%` }}
          >
            <button
              type="button"
              aria-label={`${a.name}, ${STATE_LABEL[a.now]}: ${a.task}`}
              onMouseEnter={() => setHover(a.id)}
              onMouseLeave={() => setHover((h) => (h === a.id ? null : h))}
              onFocus={() => setHover(a.id)}
              onBlur={() => setHover((h) => (h === a.id ? null : h))}
              onClick={() => setOpen(open === a.id ? null : a.id)}
              className="pointer-events-auto absolute bottom-0 -translate-x-1/2 cursor-pointer rounded-md outline-none focus-visible:ring-2 focus-visible:ring-zk-accent"
              style={{ width: px(HIT_W), height: px(HIT_H) }}
            />
            {hover === a.id && open !== a.id && <Hover agent={a} bottom={px(HIT_H + 4)} align={alignOf(a.home)} />}
            {open === a.id && <AgentCard agent={a} bottom={px(HIT_H + 4)} align={alignOf(a.home)} onClose={() => setOpen(null)} />}
          </div>
        ))}
      </div>
    </>
  );
}

type Shown = AgentBot & { now: AgentState };

/** Pop-ups over robots near the edges open inwards, so they stay on screen. */
const alignOf = (home: number) => (home < 0.2 ? "-translate-x-4" : home > 0.8 ? "-translate-x-[calc(100%-1.5rem)]" : "-translate-x-1/2");

function StateChip({ state }: { state: AgentState }) {
  const tone = state === "escalating" ? "border-zk-warn-bd bg-zk-warn-bg text-zk-warn-fg" : "border-transparent bg-zk-info-bg text-zk-info-fg";
  return <span className={`rounded-md border px-1.5 py-0.5 text-[11px] font-semibold ${tone}`}>{STATE_LABEL[state]}</span>;
}

function Hover({ agent, bottom, align }: { agent: Shown; bottom: string; align: string }) {
  return (
    <div role="tooltip" className={`absolute w-60 ${align} rounded-lg border border-zk-border bg-zk-surface px-3 py-2 text-xs shadow-lg`} style={{ bottom }}>
      <p className="flex items-center justify-between gap-2 font-semibold text-zk-text">
        {agent.name} <StateChip state={agent.now} />
      </p>
      <p className="mt-1 text-zk-text2">{agent.task}</p>
    </div>
  );
}

function AgentCard({ agent, bottom, align, onClose }: { agent: Shown; bottom: string; align: string; onClose: () => void }) {
  return (
    <div role="dialog" aria-label={agent.name} className={`pointer-events-auto absolute w-72 ${align} rounded-xl border border-zk-border bg-zk-surface p-4 text-sm shadow-xl`} style={{ bottom }}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">{agent.name}</span>
        <span className="flex items-center gap-2">
          <StateChip state={agent.now} />
          <button type="button" aria-label="Close" onClick={onClose} className="text-zk-muted hover:text-zk-text"><X className="size-4" /></button>
        </span>
      </div>
      <p className="mt-2 font-medium text-zk-text">{agent.task}</p>
      <p className="mt-1 text-zk-text2">{agent.detail}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {agent.now === "escalating" && agent.issueId ? (
          <Link href={`/issues/${agent.issueId}`} onClick={onClose} className="rounded-[10px] bg-zk-blue px-3 py-1.5 text-xs font-semibold text-white">Make the call</Link>
        ) : agent.now !== "idle" && agent.issueId ? (
          <Link href={`/issues/${agent.issueId}`} onClick={onClose} className="rounded-[10px] border border-zk-border px-3 py-1.5 text-xs font-semibold">Open the issue</Link>
        ) : (
          <Link href="/issues?status=open" onClick={onClose} className="rounded-[10px] border border-zk-border px-3 py-1.5 text-xs font-semibold">Give it an issue</Link>
        )}
      </div>
    </div>
  );
}
