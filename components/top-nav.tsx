"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Leaderboard", href: "/" },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function UtcClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="num text-xs text-muted-foreground tabular-nums">
      {time ?? "--:--:--"} <span className="text-muted-foreground/50">UTC</span>
    </span>
  );
}

function BrandMark() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.55_0.2_310)] text-primary-foreground shadow-[0_0_20px_-4px_oklch(0.635_0.185_280/0.7)]">
        <Activity className="size-4" aria-hidden strokeWidth={2.5} />
      </span>
      <span className="font-display text-[0.95rem] font-semibold tracking-tight text-foreground">
        Signal<span className="text-primary">Rank</span>
      </span>
    </span>
  );
}

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="glass-bar sticky top-0 z-40">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <Link href="/" aria-label="SignalRank home">
          <BrandMark />
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <span className="hidden items-center gap-2 rounded-full border border-[var(--gain)]/25 bg-[var(--gain-muted)] px-2.5 py-1 sm:flex">
            <span
              className="live-dot size-1.5 rounded-full bg-[var(--gain)]"
              aria-hidden
            />
            <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--gain)]">
              Live
            </span>
          </span>
          <UtcClock />
        </div>
      </div>
    </header>
  );
}
