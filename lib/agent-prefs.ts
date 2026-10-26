"use client";

// Whether your agents walk around on screen, and which ones. A per-viewer setting, so it lives in this browser.
import { useSyncExternalStore } from "react";

export type AgentPrefs = { on: boolean; hidden: string[] };

const KEY = "ziki-mock-agents";
const DEFAULT: AgentPrefs = { on: true, hidden: [] };
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

export function toggleAgent(id: string) {
  const { hidden } = read();
  write({ ...read(), hidden: hidden.includes(id) ? hidden.filter((h) => h !== id) : [...hidden, id] });
}
