"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, ChevronDown } from "lucide-react";
import { setAgentsOn, toggleAgent, useAgentPrefs } from "@/lib/agent-prefs";
import { AGENT_BOTS } from "@/lib/agents";
import NewTag from "../new-tag";

/** The header's Agents button: show your agents on screen, all of them or only some. */
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
            <span className="flex items-center gap-2">Show agents on screen <NewTag /></span>
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
        </div>
      )}
    </div>
  );
}
