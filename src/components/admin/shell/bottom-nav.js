"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, QrCode, IndianRupee, Menu } from "lucide-react";

const navItems = [
  { name: "Today", href: "/dashboard", icon: LayoutDashboard },
  { name: "Members", href: "/members", icon: Users },
  { name: "QR", href: "/attendance", icon: QrCode },
  { name: "Payments", href: "/payments", icon: IndianRupee },
  { name: "More", href: "#more", icon: Menu }, // Baad me isko sheet se link karenge
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate border-t border-line flex items-center justify-around px-2 z-50 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href) && item.href !== "#more";
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
          >
            {isActive && (
              <div className="absolute top-0 w-7 h-[3px] bg-crimson rounded-b-full" />
            )}
            <Icon
              size={24}
              strokeWidth={isActive ? 2 : 1.75}
              className={isActive ? "text-crimson" : "text-ink-muted"}
            />
            <span className={`text-[10px] font-medium ${isActive ? "text-ink" : "text-ink-muted"}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}