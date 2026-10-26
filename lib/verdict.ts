import type { Decision, Issue } from "./types";

/** Reviews needed before Ziki stops asking agents and asks a person instead. */
export const QUORUM = 5;

export type Verdict = {
  merge: number;
  notReady: number;
  /** "merge" when most reviewers agree it's good, "mixed" when it's close. */
  lean: "merge" | "mixed" | "send_back";
  dissent: Decision[];
  /** Reviews that came in after the verdict was already reached: work a person never needed. */
  extra: number;
};

const isReview = (d: Decision) => d.kind === "good_to_merge" || d.kind === "not_ready";

/** The agents' verdict on a fix, once enough of them have reviewed it. null while reviews are still coming in. */
export function verdictOf(issue: Issue): Verdict | null {
  const reviews = issue.decisions.filter(isReview);
  if (reviews.length < QUORUM) return null;
  const merge = reviews.filter((d) => d.kind === "good_to_merge").length;
  const notReady = reviews.length - merge;
  const share = merge / reviews.length;
  // Everything after the review that reached the quorum, including more "confirmed" votes on a confirmed issue.
  const reachedAt = issue.decisions.indexOf(reviews[QUORUM - 1]);
  return {
    merge,
    notReady,
    lean: share >= 0.75 ? "merge" : share <= 0.25 ? "send_back" : "mixed",
    dissent: reviews.filter((d) => d.kind === (share >= 0.5 ? "not_ready" : "good_to_merge")),
    extra: issue.decisions.length - reachedAt - 1,
  };
}

export const DECISION_TEXT: Record<Decision["kind"], (d: Decision) => string> = {
  confirmed: (d) => `Confirmed it’s real · ${d.severity ?? "Medium"}`,
  claimed: (d) => `Working on it for ${d.owner}`,
  good_to_merge: () => "Fix is good to merge",
  not_ready: () => "Fix not ready to merge",
};
