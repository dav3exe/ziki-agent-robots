import type { AgentBot, AgentState } from "@/lib/agents";
import type { Pose } from "./robot";

/** One robot on screen, and what it's doing right now. */
export type Runtime = {
  bot: AgentBot;
  state: AgentState;
  x: number;
  dir: 1 | -1;
  walking: boolean;
  target: number;
  pauseUntil: number;
  phase: number;
  tapped: boolean;
};

/** Things a pose can set off, like a tap on the glass. */
export type Effects = { tap: (x: number, y: number) => void };

const VISOR = { working: "#8fc9ff", reviewing: "#8fc9ff", escalating: "#f6cf6b", idle: "#4f7fc4" };
const LED = { working: "#6ee7a8", reviewing: "#8fc9ff", escalating: "#f6cf6b", idle: "#3978f6" };

/** A servo settling now and then: the body drops a pixel, briefly. */
const settle = (t: number, seed: number) => (Math.sin(t * 1.1 + seed) > 0.9 ? 1 : 0);

/** Short, precise keystrokes: each hand is either up or on the key. */
const key = (t: number, seed: number) => (Math.sin(t * 13 + seed) > 0 ? 0 : -1);

/** The pose for what the robot is doing normally. The moods (tired, fed up and so on) come in later. */
export function basePose(rt: Runtime, t: number, fx: Effects): Pose {
  const common = { visor: VISOR[rt.state], led: LED[rt.state], tilt: 0, pan: 0, scan: false, blink: false };
  const seed = rt.x;

  switch (rt.state) {
    case "working":
      return {
        ...common, view: "side", dir: 1, bob: settle(t, seed), legs: { kind: "stand" }, glow: true,
        near: { elbow: [8, -38], hand: [15, -32 + key(t, 0)] },
        far: { elbow: [7, -39], hand: [14, -33 + key(t, 1.7)] },
      };
    case "reviewing":
      return {
        ...common, view: "side", dir: 1, bob: settle(t, seed), legs: { kind: "stand" }, tilt: 2, scan: true,
        near: { elbow: [7, -40], hand: [12, -46] },
        far: { elbow: [6, -41], hand: [12, -48] },
      };
    case "escalating": {
      // Taps the glass every couple of seconds: a slow reach, a firm tap, back down.
      const cycle = (t % 2.4) / 2.4;
      const reach = cycle < 0.5 ? 0 : Math.sin(((cycle - 0.5) / 0.5) * Math.PI);
      const hand: [number, number] = [11 - reach * 3, -40 - reach * 12];
      if (reach > 0.95 && !rt.tapped) {
        rt.tapped = true;
        fx.tap(rt.x + hand[0], hand[1]);
      }
      if (reach < 0.5) rt.tapped = false;
      return {
        ...common, view: "front", dir: 1, bob: 0, legs: { kind: "stand" }, blink: true, bigHands: reach > 0.9,
        near: { elbow: [15, -41 - reach * 4], hand },
        far: { elbow: [-14, -39], hand: [-14, -30] },
      };
    }
    case "idle": {
      const swing = rt.walking ? Math.sin(rt.phase) : 0;
      const look = Math.sin(t * 0.6 + seed);
      return {
        ...common, view: "side", dir: rt.dir,
        bob: rt.walking ? Math.round(Math.abs(Math.sin(rt.phase))) : settle(t, seed),
        legs: rt.walking ? { kind: "walk", phase: rt.phase } : { kind: "stand" },
        pan: rt.walking ? 0 : look > 0.5 ? 1 : look < -0.5 ? -1 : 0,
        near: { elbow: [1 + swing * 3, -37], hand: [2 + swing * 5, -29] },
        far: { elbow: [1 - swing * 3, -37], hand: [2 - swing * 5, -29] },
      };
    }
  }
}

/** Moves a wandering robot towards its next spot, at a walking pace, with pauses in between. */
export function wander(rt: Runtime, t: number, dt: number, left: number, right: number) {
  if (rt.walking) {
    const d = rt.target - rt.x;
    rt.dir = d > 0 ? 1 : -1;
    const step = Math.min(Math.abs(d), 11 * dt);
    rt.x += rt.dir * step;
    rt.phase += step * 0.3;
    if (Math.abs(d) < 0.5) {
      rt.walking = false;
      rt.pauseUntil = t + 3 + Math.random() * 3;
    }
  } else if (t > rt.pauseUntil) {
    rt.target = left + Math.random() * (right - left);
    rt.walking = Math.abs(rt.target - rt.x) > 6;
    if (!rt.walking) rt.pauseUntil = t + 2;
  }
}
