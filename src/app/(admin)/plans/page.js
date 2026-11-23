import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Plus, Dumbbell } from "lucide-react";

export default async function PlansPage() {
  const supabase = getSupabaseServer();

  // Fetch all templates with exercise count
  const { data: templates } = await supabase
    .from("workout_templates")
    .select(`
      *,
      workout_plan_items (id)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Workout Plans</p>
          <h1 className="disp text-5xl md:text-6xl text-ink">PLANS</h1>
        </div>
        <Link
          href="/plans/new"
          className="h-12 px-4 md:px-6 flex items-center gap-2 bg-crimson hover:bg-crimson-hover text-white font-bold text-[15px] rounded-[10px] transition-colors"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span className="hidden md:inline">New Plan</span>
        </Link>
      </div>

      {/* Templates Grid */}
      {!templates || templates.length === 0 ? (
        <div className="bg-slate rounded-tile p-12 text-center">
          <Dumbbell size={40} className="text-ink-faint mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-ink-muted mb-4">No workout plans yet.</p>
          <Link href="/plans/new" className="inline-block h-10 px-6 bg-crimson text-white font-bold text-sm rounded-[10px] leading-10">
            Create your first plan
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/plans/${template.id}`}
              className="bg-slate rounded-tile p-5 hover:bg-line/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-crimson/10 flex items-center justify-center">
                  <Dumbbell size={20} className="text-crimson" strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted bg-black/40 px-2 py-1 rounded-md">
                  {template.level}
                </span>
              </div>
              <h3 className="disp text-2xl text-ink mb-1 group-hover:text-crimson transition-colors">
                {template.name}
              </h3>
              <p className="text-xs text-ink-muted mb-4 line-clamp-2">
                {template.description || "No description"}
              </p>
              <div className="flex items-center justify-between text-xs text-ink-muted pt-3 border-t border-line">
                <span className="num">{template.workout_plan_items?.length || 0} exercises</span>
                <span className="text-ink group-hover:text-crimson transition-colors">View Plan →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}