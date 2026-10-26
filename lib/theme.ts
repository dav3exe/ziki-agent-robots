"use client";

// Dark or light, kept in this browser. The choice lives on <html data-theme>, which the colours in globals.css read; a small script in the layout sets it before the first paint so a light page never flashes dark.
import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const THEME_KEY = "ziki-mock-theme"; // the layout's pre-paint script reads the same key
const listeners = new Set<() => void>();

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "dark");
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage blocked: the choice holds until the page reloads.
  }
  listeners.forEach((l) => l());
}
