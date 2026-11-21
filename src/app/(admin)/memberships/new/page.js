"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { addPlan } from "@/lib/services/plans";

export default function NewPlanPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(async (prev, formData) => {
    const result = await addPlan(prev, formData);
    if (result.success) {
      router.push("/memberships");
      router.refresh();
    }
    return result;
  }, null);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/memberships" className="p-2 -ml-2 hover:bg-slate rounded-[10px] transition-colors">
          <ArrowLeft size={24} className="text-ink" />
        </Link>
        <div>
          <p className="eyebrow mb-1">New Plan</p>
          <h1 className="disp text-4xl md:text-5xl text-ink">CREATE PLAN</h1>
        </div>
      </div>

      <form action={formAction} className="bg-slate rounded-tile p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink-muted mb-2">Plan Name *</label>
          <input
            name="plan_name"
            type="text"
            required
            placeholder="e.g. Monthly, Quarterly, Half-Yearly"
            className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-2">Duration (months) *</label>
            <input
              name="duration_months"
              type="number"
              min="1"
              max="12"
              required
              placeholder="e.g. 3"
              className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-2">Price (₹) *</label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="e.g. 2500"
              className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson num"
            />
          </div>
        </div>

        {state?.error && (
          <div className="text-sm text-crimson">{state.error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <Link href="/memberships" className="flex-1 h-12 flex items-center justify-center border border-line-strong rounded-[10px] text-ink font-semibold hover:bg-line transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 h-12 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-white font-bold rounded-[10px] transition-colors"
          >
            {isPending ? "Saving..." : "Create Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}