import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/** Marketing and Security on Ziki today: a "Coming soon" card. */
export default function ComingSoon({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="mx-auto max-w-[500px] rounded-3xl border border-zk-border bg-zk-surface px-6 py-10 text-center">
      <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-zk-tint text-zk-accent">
        <Icon className="size-5" />
      </span>
      <p className="mt-5 inline-block rounded-full bg-zk-chip px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-zk-text2 uppercase">Coming soon</p>
      <h1 className="mt-3 font-display text-2xl font-extrabold">{title}</h1>
      <p className="mx-auto mt-3 max-w-sm text-sm text-zk-text2">{text}</p>
      <Link href="/issues" className="mt-6 inline-block rounded-full bg-zk-blue px-5 py-2 text-sm font-semibold text-white">Back to Product</Link>
    </div>
  );
}
