"use client";

import { useCalls } from "@/lib/calls";
import { ISSUES } from "@/lib/data";
import { verdictOf } from "@/lib/verdict";

/** Everything in the Inbox that still needs a person: questions, design feedback, ideas, and fixes waiting on a call. */
export default function InboxCount() {
  const calls = useCalls();
  const waiting = ISSUES.filter((i) => i.inbox || (i.status === "in_progress" && verdictOf(i) && !calls[i.id])).length;
  return <>{waiting}</>;
}
