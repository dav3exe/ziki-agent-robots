"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";

/** A small floating link to the one-page write-up, on every screen but the write-up itself. */
export default function ProposalLink() {
  if (usePathname() === "/proposal") return null;
  return (
    <Link
      href="/proposal"
      className="fixed top-[70px] right-3 z-50 flex items-center gap-1.5 rounded-full border border-dashed border-zk-accent/60 bg-zk-surface px-3 py-2 text-xs font-semibold text-zk-accent shadow-lg lg:top-[76px] lg:right-6"
    >
      <FileText className="size-4" /> About this proposal
    </Link>
  );
}
