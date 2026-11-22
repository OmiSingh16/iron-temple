"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, IdCard, QrCode, 
  IndianRupee, Dumbbell, ChartColumn, Settings, LogOut
} from "lucide-react";
import { useTransition } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Members", href: "/members", icon: Users },
  { name: "Memberships", href: "/memberships", icon: IdCard },
  { name: "QR", href: "/attendance", icon: QrCode },
  { name: "Payments", href: "/payments", icon: IndianRupee },
  { name: "Plans", href: "/plans", icon: Dumbbell },
  { name: "Reports", href: "/reports", icon: ChartColumn },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/login");
    });
  };

  return (
    <aside className="hidden md:flex flex-col w-[232px] bg-black border-r border-slate sticky top-0 h-screen">
      <div className="h-16 flex items-center px-6">
        <Link href="/dashboard" className="disp text-2xl text-ink">
          IRON <span className="text-crimson">TEMPLE</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-colors relative ${
                isActive
                  ? "bg-slate text-ink font-medium"
                  : "text-ink-muted hover:bg-slate hover:text-ink"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-crimson rounded-r-full" />
              )}
              <Icon size={20} strokeWidth={1.75} className={isActive ? "text-crimson" : ""} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button at Bottom */}
      <div className="px-4 py-4 border-t border-slate">
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[10px] text-ink-muted hover:bg-slate hover:text-ink transition-colors disabled:opacity-50"
        >
          <LogOut size={20} strokeWidth={1.75} />
          <span className="text-sm">{isPending ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}