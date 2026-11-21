"use client";

import Link from "next/link";

export default function TopBar() {
  return (
    <header className="md:hidden h-14 bg-black flex items-center justify-between px-4 sticky top-0 z-40">
      <Link href="/dashboard" className="disp text-2xl text-ink">
        IRON <span className="text-crimson">TEMPLE</span>
      </Link>
    </header>
  );
}