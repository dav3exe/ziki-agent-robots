"use client";

// The calls a person made in this mock-up (merge, send back, ask). There's no backend, so they live in this
// browser only, and every screen reads the same copy: deciding on the issue page also clears it from the Inbox.
import { useSyncExternalStore } from "react";

export type CallKind = "merged" | "sent_back" | "asked";
export type Call = { kind: CallKind; note?: string };
type Calls = Record<number, Call>;

const KEY = "ziki-mock-calls";
const listeners = new Set<() => void>();
const EMPTY: Calls = {};
let cache: Calls | null = null;

function read(): Calls {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Calls;
  } catch {
    cache = {};
  }
  return cache;
}

function write(next: Calls) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode or blocked storage: the call still shows until the page reloads.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCalls(): Calls {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function makeCall(id: number, call: Call) {
  write({ ...read(), [id]: call });
}

export function undoCall(id: number) {
  const next = { ...read() };
  delete next[id];
  write(next);
}

export function resetCalls() {
  write({});
}

export const CALL_TEXT: Record<CallKind, string> = {
  merged: "Merged",
  sent_back: "Sent back",
  asked: "Asked the agent",
};
