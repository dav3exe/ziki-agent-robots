import { ISSUES } from "@/lib/data";

/** Everything in the Inbox that still needs a person: questions, design feedback and ideas. */
export default function InboxCount() {
  return <>{ISSUES.filter((i) => i.inbox).length}</>;
}
