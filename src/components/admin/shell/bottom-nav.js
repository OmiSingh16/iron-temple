"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, QrCode, IndianRupee, Menu } from "lucide-react";
import { useState } from "react";
import MoreSheet from "./more-sheet";

const navItems = [
  { name: "Today", href: "/dashboard", icon: LayoutDashboard },
  { name: "Members", href: "/members", icon: Users },
  { name: "QR", href: "/attendance", icon: QrCode },
  { name: "Payments", href: "/payments", icon: IndianRupee },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate border-t border-line flex items-center justify-around px-2 z-40 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
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
        
        {/* More Button */}
        <button
          onClick={() => setIsMoreOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
        >
          <Menu size={24} strokeWidth={1.75} className="text-ink-muted" />
          <span className="text-[10px] font-medium text-ink-muted">More</span>
        </button>
      </nav>

      {/* More Sheet */}
      <MoreSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </>
  );
}