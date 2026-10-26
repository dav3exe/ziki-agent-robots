import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ResetDemo from "@/components/reset-demo";

export const metadata: Metadata = { title: "Ziki agent robots · About this idea" };

const STATES = [
  {
    title: "Working: at the desk",
    text: "Types at a small desk and monitor. Now and then it gets tired and sits down, overheats, rolls its neck, sips a mug of oil, cracks its knuckles or punches the air when the tests pass.",
  },
  {
    title: "Reviewing: reading a printout",
    text: "Reads pages as they print. It squints, marks them with a red pen, stamps “Approved”, scratches its head, fights a paper jam, or gets fed up, throws the pages and kneels to pick them up.",
  },
  {
    title: "Escalating: knocking on your screen",
    text: "This one needs a person. It knocks on the glass with a white, manga-style flash that catches the eye from the corner of the screen. It also holds up a sign, checks its wrist, points at the Inbox, kneels and begs, or loses its temper and bangs until the page shakes.",
  },
  {
    title: "Idle: wandering",
    text: "Walks about. It yawns and stretches, takes a power nap, peers at a floating issue card, kicks a bolt, runs a self-check, or trips, blushes and dusts itself off.",
  },
];

export default function ProposalPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 pb-8 text-[15px] leading-relaxed text-zk-text2">
      <Link href="/issues" className="inline-flex items-center gap-2 text-sm font-semibold text-zk-accent">
        <ArrowLeft className="size-4" /> Back to the robots
      </Link>

      <header className="space-y-3">
        <p className="text-xs font-bold tracking-wider text-zk-accent uppercase">Ziki idea · agent visualization</p>
        <h1 className="font-display text-3xl font-extrabold text-zk-text sm:text-4xl">Your agents, at work along the bottom of the screen</h1>
        <p className="text-lg">Each Ziki agent is a small pixel robot. What it is doing shows in how it moves, so you can tell at a glance who is busy, who is stuck and who needs you.</p>
      </header>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-zk-text">The idea</h2>
        <p>
          Agent activity is usually a feed of text. Here every agent gets a body instead. You don&apos;t read a status; you see a robot typing, reading,
          wandering or knocking on your screen. The one that needs a person is the one you notice.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-zk-text">Four states, six moods each</h2>
        <ol className="space-y-3">
          {STATES.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-zk-border bg-zk-surface p-4">
              <p className="font-semibold text-zk-text">{i + 1}. {s.title}</p>
              <p className="mt-1 text-sm">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-zk-text">Try it</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li><b className="text-zk-text">Hover a robot</b> to see its task. <b className="text-zk-text">Click it</b> for its status, links and a “Play a mood” button.</li>
          <li><b className="text-zk-text">Agents menu</b> in the header: show or hide each robot, and set moods to Off, Calm or Lively.</li>
          <li><b className="text-zk-text">Two robots to start</b>, one at each edge. Tick Smithy and Nova on in the Agents menu and watch them line up: one stands at the left, two take the two edges, three or more line up from the left.</li>
          <li><b className="text-zk-text">Far moves are a run</b>, not a slow walk, so robots never take long to reach their place.</li>
        </ul>
      </section>

      <footer className="space-y-2 border-t border-zk-divider pt-5 text-sm">
        <p>This is a front-end showcase with made-up data, drawn on a canvas with no images. Your settings and any calls you make are kept in this browser only.</p>
        <ResetDemo />
      </footer>
    </article>
  );
}
