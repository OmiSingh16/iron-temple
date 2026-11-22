"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useTransition } from "react";

export default function TopBar() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/login");
    });
  };

  return (
    <header className="md:hidden h-14 bg-black flex items-center justify-between px-4 sticky top-0 z-40">
      <Link href="/dashboard" className="disp text-2xl text-ink">
        IRON <span className="text-crimson">TEMPLE</span>
      </Link>
      <button
        onClick={handleLogout}
        disabled={isPending}
        className="p-2 text-ink-muted hover:text-ink transition-colors disabled:opacity-50"
        aria-label="Logout"
      >
        <LogOut size={20} strokeWidth={1.75} />
      </button>
    </header>
  );
}