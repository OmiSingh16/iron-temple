"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  IdCard, Dumbbell, ChartColumn, Settings, LogOut, X 
} from "lucide-react";
import { useTransition } from "react";

export default function MoreSheet({ isOpen, onClose }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/login");
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/65 z-50 md:hidden"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate rounded-t-[16px] z-50 md:hidden pb-safe animate-in slide-in-from-bottom duration-200">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 bg-line-strong rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-2">
          <h2 className="disp text-xl text-ink">MORE</h2>
          <button onClick={onClose} className="p-1 text-ink-muted hover:text-ink">
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="px-3 pb-6 space-y-1">
          <Link 
            href="/memberships" 
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-[10px] text-ink hover:bg-line transition-colors"
          >
            <IdCard size={20} strokeWidth={1.75} className="text-ink-muted" />
            <span className="text-sm font-medium">Memberships</span>
          </Link>

          <Link 
            href="/plans" 
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-[10px] text-ink hover:bg-line transition-colors"
          >
            <Dumbbell size={20} strokeWidth={1.75} className="text-ink-muted" />
            <span className="text-sm font-medium">Diet & Workout Plans</span>
          </Link>

          <Link 
            href="/reports" 
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-[10px] text-ink hover:bg-line transition-colors"
          >
            <ChartColumn size={20} strokeWidth={1.75} className="text-ink-muted" />
            <span className="text-sm font-medium">Reports</span>
          </Link>

          <Link 
            href="/settings" 
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-[10px] text-ink hover:bg-line transition-colors"
          >
            <Settings size={20} strokeWidth={1.75} className="text-ink-muted" />
            <span className="text-sm font-medium">Settings</span>
          </Link>

          <button
            onClick={handleLogout}
            disabled={isPending}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-[10px] text-crimson hover:bg-line transition-colors disabled:opacity-50"
          >
            <LogOut size={20} strokeWidth={1.75} />
            <span className="text-sm font-medium">{isPending ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </div>
    </>
  );
}