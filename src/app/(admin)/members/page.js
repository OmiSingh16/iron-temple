import Link from "next/link";
import { getMembers } from "@/lib/services/members";
import { Plus, Search } from "lucide-react";

export default async function MembersPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.q || "";
  const members = await getMembers(search);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Member Directory</p>
          <h1 className="disp text-5xl md:text-6xl text-ink">MEMBERS</h1>
        </div>
        <Link
          href="/members/new"
          className="h-12 px-4 md:px-6 flex items-center gap-2 bg-crimson hover:bg-crimson-hover text-white font-bold text-[15px] rounded-[10px] transition-colors"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span className="hidden md:inline">Add member</span>
        </Link>
      </div>

      {/* Search Bar */}
      <form className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-ink-faint" strokeWidth={1.75} />
        </div>
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Search by name, phone or member code..."
          className="w-full h-12 pl-10 pr-4 bg-slate border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson transition-colors"
        />
      </form>

      {/* Members List */}
      {members.length === 0 ? (
        <div className="bg-slate rounded-tile p-12 text-center">
          <p className="text-ink-muted mb-4">
            {search ? `No members found for "${search}"` : "No members yet."}
          </p>
          {!search && (
            <Link href="/members/new" className="inline-block h-10 px-6 bg-crimson text-white font-bold text-sm rounded-[10px] leading-10">
              Add your first member
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-slate rounded-tile overflow-hidden">
          {members.map((member, idx) => (
            <Link
              key={member.id}
              href={`/members/${member.id}`}
              className={`block p-4 hover:bg-line transition-colors ${
                idx !== members.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-line flex items-center justify-center disp text-lg text-ink">
                  {member.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink truncate">{member.full_name}</p>
                  <p className="text-sm text-ink-muted num">{member.member_code} · {member.phone}</p>
                </div>
                {!member.is_active && (
                  <span className="text-xs text-ink-muted">Inactive</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}