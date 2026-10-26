"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Trophy } from "lucide-react";
import { ME, PROJECT } from "@/lib/data";
import AgentsMenu from "./agents/agents-menu";
import Avatar from "./avatar";
import ZikiLogo from "./ziki-logo";
import { SECTIONS } from "./sections";

export default function AppHeader() {
  const path = usePathname();
  return (
    <header className="relative z-40 border-b border-zk-border bg-zk-surface shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:sticky lg:top-0">
      <div className="mx-auto flex h-[60px] max-w-[1400px] items-center gap-3 px-3 sm:px-6">
        <Link href="/dashboard" aria-label="Ziki" className="flex items-center gap-1.5">
          <ZikiLogo />
        </Link>
        <span className="h-5 w-px bg-zk-border" />
        <Link href="/dashboard" className="flex items-center gap-1 text-sm font-semibold text-zk-text">
          {PROJECT} <ChevronDown className="size-4 text-zk-muted" />
        </Link>
        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Sections">
          {SECTIONS.map(({ href, label, icon: Icon, match }) => {
            const on = match(path);
            return (
              <Link
                key={href}
                href={href}
                aria-current={on ? "page" : undefined}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${on ? "bg-zk-tint text-zk-accent" : "text-zk-text2 hover:text-zk-text"}`}
              >
                <Icon className="size-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <AgentsMenu />
          <button type="button" className="flex items-center gap-2 rounded-full border border-zk-border py-1 pr-3 pl-1 text-sm font-semibold">
            <Avatar name={ME.name} size={32} />
            <span className="hidden sm:inline">{ME.name}</span>
            <ChevronDown className="hidden size-4 text-zk-muted sm:block" />
          </button>
          <span className="flex items-center gap-1.5 rounded-full border border-zk-warn-bd bg-zk-warn-bg px-3 py-1.5 text-sm font-bold text-zk-warn-fg">
            <Trophy className="size-4" /> {ME.points} <span className="hidden sm:inline">pts</span>
          </span>
          <button type="button" aria-label={`Notifications, ${ME.unread} unread`} className="relative p-1.5">
            <Bell className="size-5" />
            <span className="absolute -top-1.5 -right-2 rounded-full bg-zk-blue px-1.5 text-[11px] font-bold leading-[18px] text-white">{ME.unread}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
