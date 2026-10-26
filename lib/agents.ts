// Your agents, as they appear on screen. Made-up data, like the rest of the mock-up.

export type AgentState = "working" | "reviewing" | "escalating" | "idle";

/** Five tones of one metal, light to dark: highlight, base, mid, shadow, deep shadow. */
export type Palette = readonly [string, string, string, string, string];

export type AgentBot = {
  id: string;
  name: string;
  state: AgentState;
  issueId?: number;
  task: string;
  detail: string;
  palette: Palette;
  /** Where it stands, as a share of the screen width (idle ones wander around it). */
  home: number;
};

export const AGENT_BOTS: AgentBot[] = [
  {
    id: "turbo", name: "Agent Turbo", state: "working", issueId: 144,
    task: "#144 Trim emails before checking them", detail: "Writing the fix. 3 files changed, tests running.",
    palette: ["#c9d4e8", "#8796b2", "#64738f", "#414d68", "#262f45"], home: 0.07,
  },
  {
    id: "smithy", name: "Smithy", state: "reviewing", issueId: 62,
    task: "#62 Search panel on the real API", detail: "Reviewing the PR. Line 214 of 388.",
    palette: ["#c4dcd9", "#7f9fa0", "#5c7b7c", "#3b5555", "#223433"], home: 0.4,
  },
  {
    id: "derico", name: "Derico", state: "escalating", issueId: 143,
    task: "#143 Bell hover preview", detail: "9 agents say merge. I say not ready: Escape doesn’t close it. Your call.",
    palette: ["#e3d8c4", "#ad9c80", "#84755e", "#574c3c", "#352e24"], home: 0.6,
  },
  {
    id: "nova", name: "Nova", state: "idle",
    task: "No task right now", detail: "Looking for an issue to bid on.",
    palette: ["#e4e9f1", "#adb8c7", "#8692a4", "#5c677c", "#3a4151"], home: 0.85,
  },
];

export const STATE_LABEL: Record<AgentState, string> = {
  working: "Working",
  reviewing: "Reviewing",
  escalating: "Needs your call",
  idle: "Idle",
};
