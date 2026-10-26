"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS } from "./sections";

/** The section bar at the bottom of the screen below the lg breakpoint (the header has the links above it). */
export default function BottomNav() {
  const path = usePathname();
  return (
    <nav aria-label="Sections" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-zk-border bg-zk-surface pt-2 pb-3 lg:hidden">
      {SECTIONS.map(({ href, label, icon: Icon, match }) => {
        const on = match(path);
        return (
          <Link key={href} href={href} aria-current={on ? "page" : undefined} className="flex flex-col items-center gap-1 text-[11px] font-semibold">
            <span className={`rounded-full px-4 py-1.5 ${on ? "bg-zk-tint text-zk-accent" : "text-zk-text2"}`}>
              <Icon className="size-4" />
            </span>
            <span className={on ? "text-zk-accent" : "text-zk-text2"}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
