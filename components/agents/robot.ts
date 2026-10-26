import type { Palette } from "@/lib/agents";
import type { Painter } from "./painter";

export type Point = [number, number];
export type Arm = { elbow: Point; hand: Point };

/** Everything that decides how a robot looks in one frame. The animations (poses.ts) produce these. */
export type Pose = {
  /** "side" while it works on its own, "front" when it turns to face you. */
  view: "side" | "front";
  dir: 1 | -1;
  /** Upper body moved down by this many pixels (a servo settling, a step). */
  bob: number;
  legs: { kind: "stand" } | { kind: "walk"; phase: number };
  /** Side view: the near arm. Front view: the arm on the viewer's right. */
  near: Arm;
  /** Side view: the far arm. Front view: the arm on the viewer's left. */
  far: Arm;
  /** Head lowered by this many pixels (reading) and visor moved sideways (looking around). */
  tilt: number;
  pan: number;
  visor: string;
  /** A light that sweeps across the visor, line by line. */
  scan: boolean;
  led: string;
  blink: boolean;
  /** Blue light from a monitor on the face and chest. */
  glow?: boolean;
  /** Hands drawn bigger, as when one comes close to the glass. */
  bigHands?: boolean;
};

const GLASS = "#0b1426";
const WHITE = "#ffffff";

function visor(p: Painter, x: number, y: number, w: number, pose: Pose, t: number) {
  p.rect(x - 1, y - 1, w + 2, 7, GLASS);
  p.rect(x, y, w, 5, pose.visor);
  p.rect(x, y, w, 1, "#dbe7fd");
  p.rect(x, y + 4, w, 1, "rgba(0,0,0,0.25)");
  if (pose.scan) p.rect(x + (Math.floor(t * 6) % w), y + 1, 1, 3, WHITE);
  else p.rect(x + 1, y + 1, 2, 1, "rgba(255,255,255,0.7)");
}

function led(p: Painter, x: number, y: number, pose: Pose, t: number, size = 2) {
  if (pose.blink && Math.floor(t * 2.5) % 2) return;
  p.rect(x, y, size, size, pose.led);
}

function sideLeg(p: Painter, pal: Palette, near: boolean, footX: number, lift: number) {
  const hipY = -28;
  const ankle: Point = [footX, -4 - lift];
  const knee: Point = [(footX + 0) / 2 + 2.5, (hipY + ankle[1]) / 2];
  const c = near ? pal[2] : pal[3], top = near ? pal[1] : pal[2];
  p.line(0, hipY, knee[0], knee[1], 5, c, top);
  p.line(knee[0], knee[1], ankle[0], ankle[1], 4, c, top);
  p.disc(Math.round(knee[0]), Math.round(knee[1]), 2, near ? pal[3] : pal[4], near ? pal[2] : undefined);
  p.rect(footX - 4, -3 - Math.round(lift), 10, 3, near ? pal[3] : pal[4]);
  p.rect(footX - 4, -3 - Math.round(lift), 10, 1, c);
  p.rect(footX + 5, -2 - Math.round(lift), 1, 2, near ? pal[4] : "#11151f");
}

function sideArm(p: Painter, pal: Palette, arm: Arm, bob: number, near: boolean) {
  const [ex, ey] = arm.elbow, [hx, hy] = arm.hand;
  const c = near ? pal[2] : pal[3], top = near ? pal[0] : pal[2];
  p.line(1, -46 + bob, ex, ey + bob, 3, c, top);
  p.line(ex, ey + bob, hx, hy + bob, 3, c, top);
  p.disc(Math.round(ex), Math.round(ey + bob), 1, near ? pal[3] : pal[4]);
  p.rect(hx - 2, hy + bob - 2, 4, 4, near ? pal[1] : pal[2]);
  p.rect(hx - 2, hy + bob + 1, 4, 1, near ? pal[3] : pal[4]);
}

/** A robot seen from the side, facing pose.dir. */
export function drawSide(p: Painter, pal: Palette, pose: Pose, t: number) {
  const b = pose.bob;
  p.shadow(22);
  sideArm(p, pal, pose.far, b, false);

  // Legs: far one first.
  for (const near of [false, true]) {
    if (pose.legs.kind === "walk") {
      const ph = pose.legs.phase + (near ? 0 : Math.PI);
      sideLeg(p, pal, near, Math.sin(ph) * 6, Math.max(0, Math.cos(ph)) * 3);
    } else {
      sideLeg(p, pal, near, near ? 2 : -2, 0);
    }
  }

  // Pelvis and power pack.
  p.rect(-7, -31 + b, 14, 4, pal[2]);
  p.rect(-7, -31 + b, 14, 1, pal[1]);
  p.rect(-14, -48 + b, 5, 15, pal[3]);
  p.rect(-14, -48 + b, 5, 1, pal[2]);
  for (let i = 0; i < 3; i++) p.rect(-13, -44 + b + i * 3, 3, 1, pal[4]);

  // Torso: lit from above, with a rim of light on the side it faces.
  p.rect(-9, -50 + b, 19, 20, pal[1]);
  p.rect(-8, -51 + b, 17, 1, pal[0]);
  p.rect(-9, -50 + b, 19, 1, pal[0]);
  p.rect(-9, -50 + b, 2, 20, pal[2]);
  p.rect(9, -49 + b, 1, 18, pal[0]);
  p.rect(-9, -31 + b, 19, 1, pal[3]);
  p.rect(-6, -49 + b, 3, 1, WHITE);
  p.rect(-5, -48 + b, 1, 1, WHITE);
  // Side hatch with two lights, and vents.
  p.rect(-3, -46 + b, 9, 8, pal[2]);
  p.rect(-3, -46 + b, 9, 1, pal[3]);
  p.rect(-3, -39 + b, 9, 1, pal[0]);
  led(p, 3, -44 + b, pose, t);
  p.rect(0, -44 + b, 1, 1, "#3978f6");
  for (let i = 0; i < 3; i++) p.rect(-2, -36 + b + i * 2, 7, 1, pal[3]);
  for (const [rx, ry] of [[-7, -49], [8, -49], [-7, -33], [8, -33]]) p.rect(rx, ry + b, 1, 1, pal[0]);
  if (pose.glow) p.rect(10, -49 + b, 1, 18, "rgba(143,201,255,0.55)");

  // Neck and head.
  p.rect(-2, -54 + b, 6, 4, pal[3]);
  p.rect(-2, -53 + b, 6, 1, pal[2]);
  const hy = -67 + b + pose.tilt;
  p.rect(-8, hy, 18, 13, pal[1]);
  p.rect(-7, hy - 1, 16, 1, pal[0]);
  p.rect(-8, hy, 18, 2, pal[0]);
  p.rect(-8, hy, 2, 13, pal[2]);
  p.rect(-8, hy + 12, 18, 1, pal[3]);
  p.rect(-5, hy + 1, 3, 1, WHITE);
  p.disc(-3, hy + 7, 3, pal[2], pal[1]);
  p.disc(-3, hy + 7, 1, pal[3]);
  visor(p, 3 + pose.pan, hy + 4, 7, pose, t);
  if (pose.glow) p.rect(10, hy + 3, 1, 7, "rgba(143,201,255,0.5)");
  // Antenna.
  p.rect(-5, hy - 5, 1, 5, pal[2]);
  led(p, -5, hy - 6, pose, t, 1);

  sideArm(p, pal, pose.near, b, true);
  p.disc(1, -46 + b, 3, pal[2], pal[1]);
}

/** A robot facing you. */
export function drawFront(p: Painter, pal: Palette, pose: Pose, t: number) {
  const b = pose.bob;
  p.at(p.x, 1);
  p.shadow(26);

  // Legs.
  for (const [lx, c, top] of [[-7, pal[2], pal[1]], [3, pal[3], pal[2]]] as const) {
    p.rect(lx, -28, 5, 25, c);
    p.rect(lx, -28, 1, 25, top);
    p.disc(lx + 2, -15, 2, pal[3], pal[2]);
  }
  p.rect(-9, -3, 8, 3, pal[3]);
  p.rect(1, -3, 8, 3, pal[4]);
  p.rect(-9, -3, 8, 1, pal[2]);
  p.rect(1, -3, 8, 1, pal[3]);

  // Pelvis and torso.
  p.rect(-8, -31 + b, 16, 4, pal[2]);
  p.rect(-11, -51 + b, 22, 21, pal[1]);
  p.rect(-10, -52 + b, 20, 1, pal[0]);
  p.rect(-11, -51 + b, 22, 1, pal[0]);
  p.rect(-11, -51 + b, 2, 21, pal[0]);
  p.rect(9, -51 + b, 2, 21, pal[3]);
  p.rect(-11, -31 + b, 22, 1, pal[3]);
  p.rect(-8, -50 + b, 3, 1, WHITE);
  // Chest panel and seam.
  p.rect(-5, -47 + b, 10, 8, pal[2]);
  p.rect(-5, -47 + b, 10, 1, pal[3]);
  p.rect(-5, -40 + b, 10, 1, pal[0]);
  led(p, -3, -45 + b, pose, t, 3);
  p.rect(2, -45 + b, 1, 1, "#3978f6");
  p.rect(0, -38 + b, 1, 7, pal[3]);
  for (let i = 0; i < 2; i++) p.rect(-4, -36 + b + i * 2, 3, 1, pal[3]);

  // Neck and head.
  p.rect(-3, -54 + b, 6, 3, pal[3]);
  const hy = -68 + b + pose.tilt;
  p.rect(-10, hy, 20, 14, pal[1]);
  p.rect(-9, hy - 1, 18, 1, pal[0]);
  p.rect(-10, hy, 20, 2, pal[0]);
  p.rect(-10, hy, 2, 14, pal[0]);
  p.rect(8, hy, 2, 14, pal[3]);
  p.rect(-10, hy + 13, 20, 1, pal[3]);
  p.rect(-7, hy + 1, 3, 1, WHITE);
  p.rect(-12, hy + 4, 2, 6, pal[2]);
  p.rect(10, hy + 4, 2, 6, pal[3]);
  visor(p, -6 + pose.pan, hy + 5, 12, pose, t);
  p.rect(0, hy - 5, 1, 5, pal[2]);
  led(p, 0, hy - 6, pose, t, 1);

  // Arms: the viewer's left (far), then right (near).
  for (const [side, arm] of [[-1, pose.far], [1, pose.near]] as const) {
    const sx = side * 12;
    const c = side > 0 ? pal[3] : pal[2], top = side > 0 ? pal[2] : pal[0];
    p.line(sx, -48 + b, arm.elbow[0], arm.elbow[1] + b, 3, c, top);
    p.line(arm.elbow[0], arm.elbow[1] + b, arm.hand[0], arm.hand[1] + b, 3, c, top);
    p.disc(sx, -48 + b, 3, pal[2], pal[1]);
    const s = pose.bigHands ? 6 : 4;
    p.rect(arm.hand[0] - s / 2, arm.hand[1] + b - s / 2, s, s, pal[1]);
    p.rect(arm.hand[0] - s / 2, arm.hand[1] + b + s / 2 - 1, s, 1, pal[3]);
  }
}
