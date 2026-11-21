"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markManualAttendance } from "@/lib/services/attendance";
import { Check } from "lucide-react";

export default function ManualAttendance({ members }) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = members.filter(
    (m) =>
      m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      m.member_code.toLowerCase().includes(search.toLowerCase())
  );

  const handleMark = (memberId) => {
    startTransition(async () => {
      const res = await markManualAttendance(memberId);
      if (!res.success) alert(res.error);
      else router.refresh();
    });
  };

  return (
    <div className="bg-slate rounded-tile p-5">
      <h2 className="disp text-xl text-ink mb-3">MANUAL ENTRY</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search member..."
        className="w-full h-10 px-3 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson text-sm mb-3"
      />
      <div className="max-h-40 overflow-y-auto space-y-1">
        {filtered.slice(0, 5).map((m) => (
          <div key={m.id} className="flex items-center justify-between py-2 px-2 hover:bg-line rounded-[8px] transition-colors">
            <div>
              <p className="text-sm font-semibold text-ink">{m.full_name}</p>
              <p className="text-xs text-ink-muted num">{m.member_code}</p>
            </div>
            <button
              onClick={() => handleMark(m.id)}
              disabled={isPending}
              className="h-8 w-8 flex items-center justify-center bg-crimson hover:bg-crimson-hover text-white rounded-full transition-colors disabled:opacity-50"
            >
              <Check size={14} strokeWidth={3} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-xs text-ink-muted text-center py-2">No member found</p>}
      </div>
    </div>
  );
}