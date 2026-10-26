# Ziki agent robots

A showcase idea for [Ziki](https://ziki.dev): every agent is a small pixel robot that lives in a dock at the bottom
right of the screen. What an agent is doing shows in how it moves, so you can see at a glance who is busy, who is stuck and who
needs a person.

The Ziki screens behind the robots copy Ziki as it is today. This repo is only about the robots.

## What the robots do

| State | What you see | Moods (6 each) |
| --- | --- | --- |
| Working | types at a desk | sits down tired, overheats, rolls its neck, sips oil, tests pass, cracks knuckles |
| Reviewing | reads a printout | fed up and throws the pages, squints, red pen, "Approved" stamp, paper jam, scratches its head |
| Escalating | knocks on your screen with a white manga-style flash | bangs until the page shakes, polite tap, holds up a sign, checks its wrist, points at the Inbox, kneels and begs |
| Idle | wanders | yawns and stretches, power nap, peers at an issue card, kicks a bolt, self-check scan, trips and dusts off |

- **The Agents button** at the bottom right shows each agent's head, with a pulsing red dot and a "1 needs you"
  count when someone needs a person. Click it to open the dock: the robots' floor and a list of the agents.
- **The list is grouped by who needs you:** Needs you (in red), Working, then Idle, each with a count. Every row has
  its own button ("Review #143", "See #144", "Give a task") and a five-step bar showing how far its issue has
  come: Proposal, Active, Merge-ready, Staging, Live.
- **Pin** (in the dock header, or "Keep robots on screen" in the Agents menu) puts the robots in a footer at the end
  of the page, below the last content, so they stay in view without covering anything. Unpin to take them out.
- **Hover** a robot to see its task; the bubble always shows on top. **Click** it for its status, links and a
  "Play a mood" button. A click outside the card closes it, and a click outside the dock closes the dock.
- **Agents menu** in the header: show or hide the dock and each robot, and set moods to Off, Calm or Lively. A first visit
  shows two robots, Agent Turbo and Derico; Smithy and Nova can be ticked on.
- **Layout:** one robot stands at the left; two stand at opposite edges; three put two at the left edge and one
  at the right; four put two at each edge. An idle robot stands nearest the middle and wanders towards it.
- **Far moves are a run**, with a forward lean and arms swinging opposite to the legs.

Everything is drawn on one canvas in code: no images or sprite sheets.

## Structure

```
components/agents/
  agent-layer.tsx   the dock, the pinned footer, the canvas, the layout and the animation loop, hover and click cards
  robot.ts          draws a robot from a pose (side and front views)
  poses.ts          the base pose for each state, walking, running and the line-up
  moods.ts          the 24 moods
  props.ts          desk, printout and the knock flash
  painter.ts        pixel drawing helpers, mirrored when a robot faces left
  agents-menu.tsx   show or hide robots, mood pace
lib/
  agents.ts         the agents, their states and release stages
  agent-prefs.ts    menu settings (shown, open, pinned, moods), kept in localStorage
```

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The data is made up and there is no backend.
