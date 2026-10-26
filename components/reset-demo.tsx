"use client";

import { resetCalls, useCalls } from "@/lib/calls";

/** Clears the calls made in this browser, so the demo starts fresh. */
export default function ResetDemo() {
  const made = Object.keys(useCalls()).length;
  return (
    <button
      type="button"
      onClick={resetCalls}
      disabled={made === 0}
      className="rounded-[10px] border border-zk-border px-3 py-1.5 font-semibold text-zk-text disabled:opacity-50"
    >
      Reset the demo{made > 0 && ` (${made} ${made === 1 ? "call" : "calls"} made)`}
    </button>
  );
}
