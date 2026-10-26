"use client";

import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "@/lib/theme";

/** The header's sun and moon button: switches between the dark and light look. */
export default function ThemeToggle() {
  const theme = useTheme();
  const light = theme === "light";
  return (
    <button
      type="button"
      onClick={() => setTheme(light ? "dark" : "light")}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      title={light ? "Switch to dark mode" : "Switch to light mode"}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-zk-border text-zk-text2 transition hover:border-zk-muted hover:text-zk-text active:scale-[0.97]"
    >
      {light ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}
