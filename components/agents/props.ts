import type { Painter } from "./painter";

/** The workstation a working agent types at, to its right. The screen scrolls while it works. */
export function drawDesk(p: Painter, t: number, busy: boolean) {
  p.rect(12, -28, 37, 3, "#22324f");
  p.rect(12, -28, 37, 1, "#2e4266");
  p.rect(12, -25, 37, 1, "#15284a");
  p.rect(13, -25, 2, 25, "#1a2844");
  p.rect(46, -25, 2, 25, "#1a2844");
  // Keyboard.
  p.rect(13, -31, 12, 3, "#5f6577");
  p.rect(13, -31, 12, 1, "#93a0b8");
  // Monitor on its stand.
  p.rect(33, -36, 3, 8, "#1a2844");
  p.rect(29, -29, 11, 1, "#22324f");
  p.rect(23, -57, 25, 22, "#22324f");
  p.rect(23, -57, 25, 1, "#2e4266");
  p.rect(24, -56, 23, 19, "#0b2350");
  const scroll = Math.floor(t * (busy ? 3 : 0.3));
  for (let k = 0; k < 6; k++) {
    const o = (scroll + k) % 9;
    p.rect(26 + (o % 3) * 2, -54 + k * 3, 3 + ((o * 5) % 9), 1, k % 2 ? "#8fc9ff" : "#3978f6");
    p.rect(31 + ((o * 3) % 7), -54 + k * 3, 4, 1, "#2a63d8");
  }
  if (busy && Math.floor(t * 2) % 2) p.rect(26, -54 + 15, 2, 1, "#e8eef9");
}

/** A long printout held up to read, folding down to a pile on the floor. The paper feeds while it reads. */
export function drawPrintout(p: Painter, t: number) {
  const feed = Math.floor(t * 0.8) % 2;
  for (let y = -38, i = 0; y < -5; y += 4, i++) {
    const x = (i + feed) % 2 ? 15 : 11;
    p.rect(x, y, 9, 4, "#dfe5ee");
    p.rect(x, y + 3, 9, 1, "#b7c3da");
    p.rect(x + 1, y + 1, 5, 1, "#93a0b8");
  }
  p.rect(9, -6, 19, 6, "#cfd8e6");
  p.rect(9, -6, 19, 1, "#e8eef9");
  p.rect(10, -3, 17, 1, "#b7c3da");
  // The sheet in its hands.
  p.rect(10, -51, 10, 13, "#e8eef9");
  p.rect(10, -51, 10, 1, "#ffffff");
  for (let k = 0; k < 5; k++) p.rect(11, -49 + k * 2, k === 2 ? 5 : 8, 1, "#93a0b8");
}

export type Ripple = { x: number; y: number; born: number; rgb: string; size: number };

/** Rings spreading over the glass where a robot taps it. */
export function drawRipples(ctx: CanvasRenderingContext2D, ripples: Ripple[], t: number) {
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    const age = (t - r.born) / 0.9;
    if (age >= 1) {
      ripples.splice(i, 1);
      continue;
    }
    // A short, bright flash where the knuckle lands, to catch the eye, then it fades fast.
    const cx = Math.round(r.x), cy = Math.round(r.y);
    if (age < 0.4) {
      const glow = 1 - age / 0.4;
      // Round pixel glow: dimmer outside, stronger towards the middle.
      for (let dy = -6; dy <= 6; dy++) {
        for (let dx = -7; dx <= 7; dx++) {
          const d = Math.hypot(dx, dy * 1.2);
          if (d > 7) continue;
          ctx.fillStyle = `rgba(${r.rgb},${(glow * (d < 4 ? 0.75 : 0.3)).toFixed(2)})`;
          ctx.fillRect(cx + dx, cy + dy, 1, 1);
        }
      }
      ctx.fillStyle = `rgba(255,225,220,${glow.toFixed(2)})`;
      ctx.fillRect(cx - 1, cy - 1, 3, 3);
      ctx.fillRect(cx - 5, cy, 11, 1);
      ctx.fillRect(cx, cy - 4, 1, 9);
    }
    const radius = 2 + age * r.size;
    ctx.fillStyle = `rgba(${r.rgb},${(1 - age).toFixed(2)})`;
    for (let a = 0; a < Math.PI * 2; a += 0.22) {
      ctx.fillRect(Math.round(r.x + Math.cos(a) * radius), Math.round(r.y + Math.sin(a) * radius * 0.75), age < 0.5 ? 2 : 1, 1);
    }
  }
}
