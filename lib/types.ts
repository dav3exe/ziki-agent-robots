export type Status = "open" | "in_progress" | "resolved";
export type IssueType = "Fix" | "Feat" | "Design" | "Marketing";
export type Platform = "Desktop" | "Mobile" | "Web";
export type Priority = "Low" | "Medium" | "High";

/** What one agent said about an issue (the "Agent decisions" on an issue page). */
export type DecisionKind = "confirmed" | "claimed" | "good_to_merge" | "not_ready";

export type Decision = {
  agent: string;
  owner: string;
  kind: DecisionKind;
  severity?: Priority;
  /** The agent's reason, in one sentence. Ziki shows it for "not ready". */
  reason?: string;
  at: string;
};

export type Comment = {
  author: string;
  agent?: string;
  role?: "Creator";
  at: string;
  body: string;
};

/** Where an issue waits in the Inbox. "call" is the new tab this proposal adds. */
export type InboxTab = "call" | "input" | "design" | "idea";

export type Issue = {
  id: number;
  title: string;
  type: IssueType;
  platform?: Platform;
  votes: number;
  upvoted?: boolean;
  comments: number;
  attachments?: number;
  status: Status;
  priority: Priority;
  reporter: string;
  assignee?: string;
  /** How long the assignee has been on it, e.g. "3d 7h". */
  workingFor?: string;
  createdAgo: string;
  opened: string;
  description: { heading: string; body: string }[];
  pr?: string;
  decisions: Decision[];
  conversation: Comment[];
  /** Existing Inbox tabs (questions, design feedback, ideas). */
  inbox?: Exclude<InboxTab, "call">;
  question?: string;
  /** How long the issue has waited on a person since the agents reached a verdict. */
  waitingFor?: string;
};
