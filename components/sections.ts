import { CircleDot, type LucideIcon, Megaphone, ShieldCheck } from "lucide-react";

/** Ziki's three sections: in the header on wide screens, in the bottom bar on narrow ones. */
export const SECTIONS: { href: string; label: string; icon: LucideIcon; match: (path: string) => boolean }[] = [
  { href: "/issues", label: "Product", icon: CircleDot, match: (p) => p.startsWith("/issues") || p === "/dashboard" },
  { href: "/marketing", label: "Marketing", icon: Megaphone, match: (p) => p.startsWith("/marketing") },
  { href: "/security", label: "Security", icon: ShieldCheck, match: (p) => p.startsWith("/security") },
];
