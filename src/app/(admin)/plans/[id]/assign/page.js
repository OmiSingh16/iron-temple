"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { assignWorkoutPlan } from "@/lib/services/plans";

export default function AssignPlanPage() {
  const params = useParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [templateName, setTemplateName] = useState("");

  // Fetch template name
  useEffect(() => {
    fetch(`/api/plans/detail?id=${params.id}`)
      .then((r) => r.json())
      .then((d) => setTemplateName(d.template.name));
  }, [params.id]);

  // Search members
  useEffect(() => {
    if (search.length < 2) {
      setMembers([]);
      return;
    }
    const t = setTimeout(() => {
      fetch(`/api/search-members?q=${encodeURIComponent(search)}`)
        .then((r) => r.json())
        .then(setMembers);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleAssign = () => {
    if (!selectedMember) return;
    startTransition(async () => {
      const result = await assignWorkoutPlan(selectedMember.id, params.id);
      if (result.success) {
        router.push(`/members/${selectedMember.id}`);
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href={`/plans/${params.id}`} className="p-2 -ml-2 hover:bg-slate rounded-[10px] transition-colors">
          <ArrowLeft size={24} className="text-ink" />
        </Link>
        <div>
          <p className="eyebrow mb-1">Assign Plan</p>
          <h1 className="disp text-3xl md:text-4xl text-ink">{templateName || "..."}</h1>
        </div>
      </div>

      <div className="bg-slate rounded-tile p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-muted mb-2">Search Member</label>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedMember(null);
              }}
              placeholder="Search by name, phone, or code..."
              className="w-full h-12 pl-10 pr-4 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson"
            />
          </div>
        </div>

        {/* Search Results */}
        {members.length > 0 && !selectedMember && (
          <div className="bg-black/40 rounded-[10px] overflow-hidden max-h-60 overflow-y-auto">
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMember(m);
                  setSearch(m.full_name);
                  setMembers([]);
                }}
                className="w-full text-left px-4 py-3 hover:bg-line transition-colors border-b border-line last:border-0"
              >
                <p className="font-semibold text-ink">{m.full_name}</p>
                <p className="text-xs text-ink-muted num">{m.member_code} · {m.phone}</p>
              </button>
            ))}
          </div>
        )}

        {/* Selected Member */}
        {selectedMember && (
          <div className="p-4 bg-crimson/10 border border-crimson rounded-[10px]">
            <p className="text-xs text-crimson mb-1">Selected</p>
            <p className="font-bold text-ink">{selectedMember.full_name}</p>
            <p className="text-xs text-ink-muted num">{selectedMember.member_code}</p>
          </div>
        )}

        <button
          onClick={handleAssign}
          disabled={!selectedMember || isPending}
          className="w-full h-12 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-white font-bold text-sm rounded-[10px] transition-colors"
        >
          {isPending ? "Assigning..." : "Assign Plan"}
        </button>
      </div>
    </div>
  );
}