"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, ChevronDown } from "lucide-react";
import { setAgentsOn, setMoodPace, toggleAgent, useAgentPrefs } from "@/lib/agent-prefs";
import { AGENT_BOTS } from "@/lib/agents";
import NewTag from "../new-tag";
import type { MoodPace } from "./moods";

const PACES: { value: MoodPace; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "calm", label: "Calm" },
  { value: "lively", label: "Lively" },
];

/** The header's Agents button: show your agents on screen, all of them or only some, and how often they show a mood. */
export default function AgentsMenu() {
  const prefs = useAgentPrefs();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => root.current && !root.current.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
        aria-label="Agents"
        className="flex items-center gap-1.5 rounded-full border border-zk-border px-2.5 py-2 text-sm font-semibold sm:px-4"
      >
        <Bot className="size-4 text-zk-accent" /> <span className="hidden sm:inline">Agents</span> <ChevronDown className="hidden size-4 text-zk-muted sm:block" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-zk-border bg-zk-surface p-3 text-sm shadow-xl">
          <label className="flex items-center justify-between gap-2 font-semibold">
            <span className="flex items-center gap-2">Show the agent dock <NewTag /></span>
            <input type="checkbox" checked={prefs.on} onChange={(e) => setAgentsOn(e.target.checked)} className="size-4 accent-zk-blue" />
          </label>
          <ul className="mt-3 space-y-2 border-t border-zk-divider pt-3">
            {AGENT_BOTS.map((a) => (
              <li key={a.id}>
                <label className={`flex items-center justify-between gap-2 ${prefs.on ? "" : "opacity-50"}`}>
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ background: a.palette[1] }} />
                    {a.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={!prefs.hidden.includes(a.id)}
                    disabled={!prefs.on}
                    onChange={() => toggleAgent(a.id)}
                    className="size-4 accent-zk-blue"
                  />
                </label>
              </li>
            ))}
          </ul>
          <div className={`mt-3 border-t border-zk-divider pt-3 ${prefs.on ? "" : "opacity-50"}`}>
            <p className="font-semibold">Moods</p>
            <p className="mt-0.5 text-xs text-zk-muted">How often they yawn, stamp, sip their oil and so on.</p>
            <div role="radiogroup" aria-label="Moods" className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-zk-seg p-1">
              {PACES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  role="radio"
                  aria-checked={prefs.moods === p.value}
                  disabled={!prefs.on}
                  onClick={() => setMoodPace(p.value)}
                  className={`rounded-md py-1 text-xs font-semibold ${prefs.moods === p.value ? "bg-zk-tint text-zk-text" : "text-zk-muted"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
