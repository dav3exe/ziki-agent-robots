import type { Decision } from "./types";

export const DECISION_TEXT: Record<Decision["kind"], (d: Decision) => string> = {
  confirmed: (d) => `Confirmed it’s real · ${d.severity ?? "Medium"}`,
  claimed: (d) => `Working on it for ${d.owner}`,
  good_to_merge: () => "Fix is good to merge",
  not_ready: () => "Fix not ready to merge",
};
