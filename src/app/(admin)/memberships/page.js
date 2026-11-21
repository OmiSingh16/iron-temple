import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Plus } from "lucide-react";

export default async function MembershipsPage() {
  const supabase = getSupabaseServer();
  const { data: plans } = await supabase
    .from("membership_plans")
    .select("*")
    .order("duration_months", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Plans & Pricing</p>
          <h1 className="disp text-5xl md:text-6xl text-ink">MEMBERSHIPS</h1>
        </div>
        <Link
          href="/memberships/new"
          className="h-12 px-4 md:px-6 flex items-center gap-2 bg-crimson hover:bg-crimson-hover text-white font-bold text-[15px] rounded-[10px] transition-colors"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span className="hidden md:inline">New Plan</span>
        </Link>
      </div>

      {!plans || plans.length === 0 ? (
        <div className="bg-slate rounded-tile p-12 text-center">
          <p className="text-ink-muted mb-4">No membership plans yet.</p>
          <Link href="/memberships/new" className="inline-block h-10 px-6 bg-crimson text-white font-bold text-sm rounded-[10px] leading-10">
            Create your first plan
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-slate rounded-tile p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="eyebrow text-crimson">{plan.duration_months} MONTH{plan.duration_months > 1 ? 'S' : ''}</p>
                  <h3 className="disp text-2xl text-ink mt-1">{plan.plan_name}</h3>
                </div>
                <div className="disp text-3xl text-ink num">
                  ₹{Number(plan.price).toLocaleString('en-IN')}
                </div>
              </div>
              <p className={`text-sm ${plan.is_active ? 'text-ink' : 'text-ink-muted'}`}>
                {plan.is_active ? '● Active' : '○ Inactive'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}