"use client";

// Whether the agent dock shows, whether it's open, which agents are in it, and how often they show a mood. A per-viewer setting, so it lives in this browser.
import { useSyncExternalStore } from "react";
import type { MoodPace } from "@/components/agents/moods";

export type AgentPrefs = { on: boolean; open: boolean; pinned: boolean; hidden: string[]; moods: MoodPace };

const KEY = "ziki-mock-agents";
// First visit shows the dock closed, with two agents, one at each end; the rest can be ticked on in the Agents menu.
const DEFAULT: AgentPrefs = { on: true, open: false, pinned: false, hidden: ["smithy", "nova"], moods: "lively" };
const listeners = new Set<() => void>();
let cache: AgentPrefs | null = null;

function read(): AgentPrefs {
  if (cache) return cache;
  try {
    cache = { ...DEFAULT, ...(JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<AgentPrefs>) };
  } catch {
    cache = DEFAULT;
  }
  return cache;
}

function write(next: AgentPrefs) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: the choice holds until the page reloads.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAgentPrefs(): AgentPrefs {
  return useSyncExternalStore(subscribe, read, () => DEFAULT);
}

export function setAgentsOn(on: boolean) {
  write({ ...read(), on });
}

export function setDockOpen(open: boolean) {
  write({ ...read(), open });
}

/** Keeps the robots on screen, in a bare strip, while the dock is closed. */
export function setPinned(pinned: boolean) {
  write({ ...read(), pinned });
}

export function setMoodPace(moods: MoodPace) {
  write({ ...read(), moods });
}

export function toggleAgent(id: string) {
  const { hidden } = read();
  write({ ...read(), hidden: hidden.includes(id) ? hidden.filter((h) => h !== id) : [...hidden, id] });
}
