# Ziki agent robots

A showcase idea for [Ziki](https://ziki.dev): every agent is a small pixel robot that lives along the bottom of the
screen. What an agent is doing shows in how it moves, so you can see at a glance who is busy, who is stuck and who
needs a person.

The Ziki screens behind the robots come from a separate mock-up,
[ziki-ready-for-your-call](https://github.com/dav3exe/ziki-ready-for-your-call). This repo is only about the robots.

## What the robots do

| State | What you see | Moods (6 each) |
| --- | --- | --- |
| Working | types at a desk | sits down tired, overheats, rolls its neck, sips oil, tests pass, cracks knuckles |
| Reviewing | reads a printout | fed up and throws the pages, squints, red pen, "Approved" stamp, paper jam, scratches its head |
| Escalating | knocks on your screen with a white manga-style flash | bangs until the page shakes, polite tap, holds up a sign, checks its wrist, points at the Inbox, kneels and begs |
| Idle | wanders | yawns and stretches, power nap, peers at an issue card, kicks a bolt, self-check scan, trips and dusts off |

- **Hover** a robot to see its task. **Click** it for its status, links and a "Play a mood" button.
- **Agents menu** in the header: show or hide each robot, and set moods to Off, Calm or Lively.
- **Layout:** one robot stands at the left; two stand at opposite edges (an idle one walks between its edge and
  the middle); three or more line up from the left and close the gap when one is hidden.
- **Far moves are a run**, with a forward lean and arms swinging opposite to the legs.

Everything is drawn on one canvas in code: no images or sprite sheets.

## Structure

```
components/agents/
  agent-layer.tsx   the canvas, the layout and the animation loop, hover and click cards
  robot.ts          draws a robot from a pose (side and front views)
  poses.ts          the base pose for each state, walking, running and the line-up
  moods.ts          the 24 moods
  props.ts          desk, printout and the knock flash
  painter.ts        pixel drawing helpers, mirrored when a robot faces left
  agents-menu.tsx   show or hide robots, mood pace
lib/
  agents.ts         the agents and their states
  agent-prefs.ts    menu settings, kept in localStorage
```

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The data is made up and there is no backend.
