"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { setDockOpen, useAgentPrefs } from "@/lib/agent-prefs";
import { AGENT_BOTS, type AgentBot, type AgentState, STATE_LABEL } from "@/lib/agents";
import { Painter } from "./painter";
import { updateMood } from "./moods";
import { basePose, type Effects, lineUp, lineUpRight, type Runtime, walkTo, wander } from "./poses";
import { drawDesk, drawPrintout, drawRipples, type Ripple } from "./props";
import { drawFront, drawSide } from "./robot";

const HEIGHT = 84; // canvas pixels
const FLOOR = 80;
const HIT_W = 30, HIT_H = 74;
const SCALE = 1; // screen pixels per canvas pixel: about 68px tall robots
const ROAM = 160; // how far right of its place an idle robot may wander
const VISOR: Record<AgentState, string> = { working: "#5aa2ff", reviewing: "#7fe0c8", escalating: "#ffd36b", idle: "#8fc9ff" };

const AGENTS = AGENT_BOTS.map((b) => ({ ...b, now: b.state }));

/** Your agents in a dock at the bottom right: a small button with their heads, which opens to a floor where they work as pixel-art robots. Hover a robot for its task, click for more. */
export default function AgentLayer() {
  const prefs = useAgentPrefs();
  const agents = AGENTS;
  const dockOpen = prefs.open;
  // Half stand at the left edge and half at the right; with an odd number the extra one goes left.
  // Idle ones stand nearest the middle, so their wandering never crosses the busy ones.
  const shown = prefs.on
    ? agents.filter((a) => !prefs.hidden.includes(a.id)).sort((a, b) => Number(a.now === "idle") - Number(b.now === "idle"))
    : [];
  const leftCount = Math.ceil(shown.length / 2);
  const right = shown.slice(leftCount).sort((a, b) => Number(b.now === "idle") - Number(a.now === "idle"));
  const visible = [...shown.slice(0, leftCount), ...right];
  const slots = lineUp(visible.slice(0, leftCount).map((a) => a.now));
  const insets = lineUpRight(right.map((a) => a.now));
  const atEnd = (i: number) => i >= leftCount;
  const insetOf = (i: number) => insets[i - leftCount];
  const waiting = visible.filter((a) => a.now === "escalating");
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [align, setAlign] = useState("-translate-x-4");
  const canvas = useRef<HTMLCanvasElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  const runtimes = useRef(new Map<string, Runtime>());
  const anchors = useRef(new Map<string, HTMLElement>());
  // Read by the animation loop, which runs outside React.
  const pace = useRef(prefs.moods);
  pace.current = prefs.moods;

  // When the line changes, robots already on the floor walk to their new place. One switched back on walks in from the nearest edge.
  const key = visible.map((a) => `${a.id}:${a.now}`).join(",");
  useEffect(() => {
    if (!dockOpen) return;
    const width = Math.ceil((floor.current?.clientWidth ?? 320) / SCALE);
    const next = new Map<string, Runtime>();
    visible.forEach((a, i) => {
      const old = runtimes.current.get(a.id);
      const end = atEnd(i);
      const inset = end ? insetOf(i) : 0;
      const slot = end ? width - inset : slots[i];
      const x = old?.x ?? (!runtimes.current.size ? slot : end ? width + 12 : -12);
      next.set(a.id, {
        bot: a, state: a.now, x, slot, end, inset, dir: old?.dir ?? 1,
        walking: false, running: false, target: x, pauseUntil: 0, phase: old?.phase ?? 0, tapped: false,
        // A mood carries on through a change in the line, unless what the agent is doing changed.
        mood: old?.state === a.now ? old.mood : null, nextMood: old?.nextMood ?? NaN, beat: old?.beat ?? -1, forceMood: false,
        moodIndex: old?.moodIndex ?? Math.floor(Math.random() * 6),
      });
    });
    runtimes.current = next;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, dockOpen]);

  useEffect(() => {
    const el = canvas.current;
    if (!el || !dockOpen || visible.length === 0) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const painter = new Painter(ctx, FLOOR);
    const ripples: Ripple[] = [];
    let frame = 0, last = 0, shakeUntil = 0, shaking = false;
    const dock = el.closest<HTMLElement>("[data-dock]");

    const draw = (now: number) => {
      const t = now / 1000, dt = Math.min(0.05, last ? t - last : 0);
      last = t;
      const width = Math.ceil(el.clientWidth / SCALE);
      if (el.width !== width) el.width = width;
      ctx.clearRect(0, 0, el.width, el.height);
      const fx: Effects = {
        tap: (x, y, scale = 1) => ripples.push({ x, y: FLOOR + y, born: t, rgb: "214,48,48", size: 14, scale }),
        bang: (x, y) => ripples.push({ x, y: FLOOR + y, born: t, rgb: "235,40,40", size: 18, scale: 1.6 }),
        shake: () => (shakeUntil = t + 0.22),
      };
      const quiet: Effects = { tap: () => {}, bang: () => {}, shake: () => {} };

      // A heavy bang shakes the dock for a moment.
      if (dock && (t < shakeUntil || shaking)) {
        shaking = t < shakeUntil;
        dock.style.transform = shaking ? `translate(${Math.round(Math.random() * 4 - 2)}px, ${Math.round(Math.random() * 2 - 1)}px)` : "";
      }

      for (const rt of runtimes.current.values()) {
        if (rt.end) rt.slot = width - rt.inset;
        if (!still) updateMood(rt, t, pace.current);
        if (still) rt.x = rt.slot;
        // A robot in the middle of a mood stays where it is until the mood ends.
        else if (rt.mood) rt.walking = rt.running = false;
        // On the right, an idle robot strolls between its place and about the middle of the floor; on the left, out to just short of the middle.
        else if (rt.state === "idle" && rt.end) wander(rt, t, dt, Math.min(rt.slot, Math.round(width * 0.45)), rt.slot);
        else if (rt.state === "idle") wander(rt, t, dt, rt.slot, Math.max(rt.slot, Math.min(Math.round(width * 0.4), rt.slot + ROAM)));
        // Hurries over long distances (like crossing to the right edge) and slows to a walk as it arrives.
        else walkTo(rt, rt.slot, dt, Math.min(120, Math.max(24, Math.abs(rt.slot - rt.x) * 0.8)));
        const base = basePose(rt, still ? 0 : t, rt.mood ? quiet : fx);
        const m = rt.mood && { rt, u: (t - rt.mood.start) / rt.mood.mood.seconds, t: t - rt.mood.start, base, fx };
        const mood = rt.mood?.mood;
        const pose = m && mood ? mood.pose(m) : base;
        // The desk stays at its place in the line; a robot on its way walks up to it.
        if (rt.state === "working") drawDesk(painter.at(rt.slot, 1), t, !still);
        painter.at(Math.round(rt.x), pose.dir);
        if (pose.view === "front") drawFront(painter, rt.bot.palette, pose, t);
        else drawSide(painter, rt.bot.palette, pose, t);
        if (rt.state === "reviewing" && !rt.walking) {
          const sheet = m && mood?.sheet ? mood.sheet(m.u) : [0, 0];
          drawPrintout(painter.at(Math.round(rt.x), 1), still ? 0 : t, sheet as [number, number] | null, !(m && mood?.jammed?.(m.u)));
        }
        if (m && mood?.props) mood.props(painter.at(Math.round(rt.x), pose.view === "front" ? 1 : pose.dir), m, pose);

        const anchor = anchors.current.get(rt.bot.id);
        if (anchor) anchor.style.left = `${Math.round(rt.x * SCALE)}px`;
      }
      drawRipples(ctx, ripples, t);
      if (!still) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      if (dock) dock.style.transform = "";
    };
  }, [visible.length, key, dockOpen]);

  useEffect(() => {
    if (!open && !dockOpen) return;
    const close = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (open) setOpen(null);
      else setDockOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open, dockOpen]);

  if (visible.length === 0) return null;
  const px = (n: number) => `${n * SCALE}px`;
  // Pop-ups open inwards from where the robot is right now, so they stay inside the dock.
  const alignAt = (id: string) => {
    const x = (runtimes.current.get(id)?.x ?? 0) * SCALE;
    const width = floor.current?.clientWidth ?? 320;
    return x < 120 ? "-translate-x-4" : x > width - 120 ? "-translate-x-[calc(100%-1rem)]" : "-translate-x-1/2";
  };
  // Plays the robot's next mood straight away, so a demo can step through them all.
  const playMood = (id: string) => {
    const rt = runtimes.current.get(id);
    if (rt) rt.forceMood = true;
  };
  const show = (id: string) => {
    setAlign(alignAt(id));
    setHover(id);
  };
  const pick = (id: string) => {
    setAlign(alignAt(id));
    setOpen(open === id ? null : id);
  };
  const toggleDock = () => {
    setOpen(null);
    setHover(null);
    setDockOpen(!dockOpen);
  };

  return (
    <div data-dock className="fixed right-3 bottom-[4.75rem] z-40 flex flex-col items-end gap-2 lg:right-6 lg:bottom-5">
      {dockOpen && (
        <section aria-label="Your agents" className="w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-zk-border bg-zk-surface p-3 shadow-xl">
          <div className="flex items-center justify-between gap-2 px-1">
            <p className="font-display text-sm font-bold text-zk-text">Your agents</p>
            <span className="text-xs text-zk-muted">{visible.length} on the floor</span>
          </div>
          <div ref={floor} className="relative mt-2 rounded-xl border-b-2 border-zk-border bg-zk-bg" style={{ height: px(HEIGHT + 4) }}>
            <canvas ref={canvas} height={HEIGHT} className="absolute bottom-0 left-0 [image-rendering:pixelated]" style={{ width: "100%", height: px(HEIGHT) }} />
            {visible.map((a, i) => (
              <div
                key={a.id}
                ref={(el) => {
                  if (el) anchors.current.set(a.id, el);
                  else anchors.current.delete(a.id);
                }}
                className="absolute bottom-0"
                style={{ left: atEnd(i) ? `calc(100% - ${px(insetOf(i))})` : px(slots[i]) }}
              >
                <button
                  type="button"
                  aria-label={`${a.name}, ${STATE_LABEL[a.now]}: ${a.task}`}
                  onMouseEnter={() => show(a.id)}
                  onMouseLeave={() => setHover((h) => (h === a.id ? null : h))}
                  onFocus={() => show(a.id)}
                  onBlur={() => setHover((h) => (h === a.id ? null : h))}
                  onClick={() => pick(a.id)}
                  className="absolute bottom-0 -translate-x-1/2 cursor-pointer rounded-md outline-none focus-visible:ring-2 focus-visible:ring-zk-accent"
                  style={{ width: px(HIT_W), height: px(HIT_H) }}
                />
                {hover === a.id && open !== a.id && <Hover agent={a} bottom={px(HIT_H + 4)} align={align} />}
                {open === a.id && <AgentCard agent={a} bottom={px(HIT_H + 4)} align={align} onClose={() => setOpen(null)} onMood={() => playMood(a.id)} />}
              </div>
            ))}
          </div>
          <ul className="mt-2 space-y-1">
            {visible.map((a) => (
              <li key={a.id}>
                <button type="button" onClick={() => pick(a.id)} className="flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left text-xs hover:bg-zk-tint">
                  <Head agent={a} />
                  <span className="shrink-0 font-semibold text-zk-text">{a.name}</span>
                  <span className="min-w-0 flex-1 truncate text-zk-muted">{a.task}</span>
                  <StateChip state={a.now} />
                </button>
              </li>
            ))}
          </ul>
          {waiting.map((a) => (
            <Link
              key={a.id}
              href={`/issues/${a.issueId}`}
              onClick={() => setDockOpen(false)}
              className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-zk-bad-bd bg-zk-bad-bg px-3 py-2 text-xs font-semibold text-zk-bad-fg"
            >
              {a.name} needs your call on #{a.issueId}
              <span className="shrink-0 underline">Open it</span>
            </Link>
          ))}
        </section>
      )}
      <button
        type="button"
        onClick={toggleDock}
        aria-expanded={dockOpen}
        aria-label={dockOpen ? "Close your agents" : `Your agents${waiting.length ? `, ${waiting.length} need your call` : ""}`}
        className="flex items-center gap-2 rounded-full border border-zk-border bg-zk-surface py-1.5 pr-3 pl-2 text-xs font-semibold text-zk-text shadow-lg hover:bg-zk-tint"
      >
        <span className="flex items-center gap-1">
          {visible.map((a) => (
            <span key={a.id} className="relative">
              <Head agent={a} />
              {a.now === "escalating" && !dockOpen && (
                <span className="absolute -top-1 -right-1 flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
                </span>
              )}
            </span>
          ))}
        </span>
        {dockOpen ? <X className="size-4" /> : "Agents"}
      </button>
    </div>
  );
}

/** A tiny pixel head in the robot's own metal, with its visor lit in the colour of what it's doing. */
function Head({ agent }: { agent: Shown }) {
  return (
    <span aria-hidden="true" className="relative block h-3.5 w-4 rounded-[2px]" style={{ background: agent.palette[1], boxShadow: `inset 0 -2px 0 ${agent.palette[3]}` }}>
      <span className="absolute top-1 right-0.5 left-0.5 h-1.5 rounded-[1px]" style={{ background: VISOR[agent.now] }} />
    </span>
  );
}

type Shown = AgentBot & { now: AgentState };

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

function AgentCard({ agent, bottom, align, onClose, onMood }: { agent: Shown; bottom: string; align: string; onClose: () => void; onMood: () => void }) {
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
          <Link href={`/issues/${agent.issueId}`} onClick={onClose} className="rounded-[10px] bg-zk-blue px-3 py-1.5 text-xs font-semibold text-white">Open #{agent.issueId}</Link>
        ) : agent.now !== "idle" && agent.issueId ? (
          <Link href={`/issues/${agent.issueId}`} onClick={onClose} className="rounded-[10px] border border-zk-border px-3 py-1.5 text-xs font-semibold">Open the issue</Link>
        ) : (
          <Link href="/issues?status=open" onClick={onClose} className="rounded-[10px] border border-zk-border px-3 py-1.5 text-xs font-semibold">Give it an issue</Link>
        )}
        <button type="button" onClick={onMood} className="rounded-[10px] border border-dashed border-zk-accent/60 px-3 py-1.5 text-xs font-semibold text-zk-accent">
          Play a mood
        </button>
      </div>
    </div>
  );
}
