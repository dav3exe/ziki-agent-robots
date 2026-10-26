import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ResetDemo from "@/components/reset-demo";
import { QUORUM } from "@/lib/verdict";

export const metadata: Metadata = { title: "Ready for your call · About this proposal" };

const CHANGES = [
  {
    title: "A new Inbox tab: “Ready for your call”",
    text: `Once ${QUORUM} agents have reviewed a fix, it lands here as one card: how many agents say merge, how many don't, and what the ones who disagree said. Merge, Send back or Ask the agent who disagreed, without opening the issue.`,
    href: "/issues",
    cta: "Open the Inbox",
  },
  {
    title: "A verdict bar at the top of the issue",
    text: "The same verdict and the same three choices sit above the description. The 18-line list of agent decisions folds away under “Show all”, shown once instead of twice.",
    href: "/issues/143",
    cta: "Open issue #143",
  },
  {
    title: "“Waiting on a person” in the issue list",
    text: "An issue the agents are done with says so, and for how long, in place of “is working on it”. Stuck work stands out instead of looking busy.",
    href: "/issues?status=in_progress",
    cta: "Open In progress",
  },
  {
    title: "Reviews close at the verdict",
    text: `After ${QUORUM} reviews Ziki stops asking agents for more and asks a person instead. No more extra “confirmed it's real” votes on an issue that's already confirmed and fixed.`,
    href: "/issues/143",
    cta: "See it on #143",
  },
];

export default function ProposalPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 pb-8 text-[15px] leading-relaxed text-zk-text2">
      <Link href="/issues" className="inline-flex items-center gap-2 text-sm font-semibold text-zk-accent">
        <ArrowLeft className="size-4" /> Back to the mock-up
      </Link>

      <header className="space-y-3">
        <p className="text-xs font-bold tracking-wider text-zk-accent uppercase">Ziki proposal · human-agent interaction</p>
        <h1 className="font-display text-3xl font-extrabold text-zk-text sm:text-4xl">Ready for your call</h1>
        <p className="text-lg">Agents do the work and the reviewing. A person makes the final call, and Ziki should ask them to, once, clearly.</p>
      </header>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-zk-text">The goal</h2>
        <p>
          A product lead opens Ziki to see what is waiting on them, make the call on it in a tap, and trust that the rest is moving, without reading
          what every agent did.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-zk-text">What was wrong</h2>
        <p>Ziki already has an Inbox where agents “stop when they need a person”. But the moment a person is needed most, the end of a fix, never gets there. On one real issue:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>9 agents said the fix was good to merge and 1 said it wasn&apos;t.</li>
          <li>After that, 3 more agents confirmed the bug was real, work nobody needed.</li>
          <li>It sat “in progress” for three days. Nobody was asked to decide, and the Inbox showed 0.</li>
          <li>To decide, a person had to read 18 agent decisions, listed twice on the page.</li>
        </ul>
        <p>So agents keep going, the person isn’t asked, and finished work never ships.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-zk-text">What changed</h2>
        <p>Same Ziki, same look. Four changes, each marked <span className="rounded-full border border-dashed border-zk-accent/60 px-1.5 text-[10px] font-bold text-zk-accent">NEW</span> in the mock-up:</p>
        <ol className="space-y-3">
          {CHANGES.map((c, i) => (
            <li key={c.title} className="rounded-xl border border-zk-border bg-zk-surface p-4">
              <p className="font-semibold text-zk-text">{i + 1}. {c.title}</p>
              <p className="mt-1 text-sm">{c.text}</p>
              <Link href={c.href} className="mt-2 inline-block text-sm font-semibold text-zk-accent">{c.cta} →</Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-zk-text">Why a person is better off</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li><b className="text-zk-text">They only see what needs them.</b> A count of decisions, not a feed of agent activity.</li>
          <li><b className="text-zk-text">They decide in seconds.</b> The verdict, the disagreement and the choice are on one card.</li>
          <li><b className="text-zk-text">Disagreement isn’t lost.</b> The one agent who said “not ready” is shown first, and can be asked directly.</li>
          <li><b className="text-zk-text">Work ships.</b> A finished fix waits on a named person with a clock on it, not on nobody.</li>
          <li><b className="text-zk-text">Agents stop wasting effort</b> on reviews that can no longer change anything.</li>
        </ul>
      </section>

      <footer className="space-y-2 border-t border-zk-divider pt-5 text-sm">
        <p>This is a front-end mock-up with made-up data. Your choices are kept in this browser only.</p>
        <ResetDemo />
      </footer>
    </article>
  );
}
