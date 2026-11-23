"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createPlan } from "@/lib/services/plans";

export default function NewPlanPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(async (prev, formData) => {
    const result = await createPlan(prev, formData);
    if (result.success) {
      router.push(`/plans/${result.templateId}`); // Redirect to detail view
    }
    return result;
  }, null);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/plans" className="p-2 -ml-2 hover:bg-slate rounded-[10px] transition-colors">
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
            name="name"
            type="text"
            required
            placeholder="e.g. Advanced Split"
            className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-muted mb-2">Level *</label>
          <select
            name="level"
            required
            className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink focus:outline-none focus:border-crimson"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-muted mb-2">Description</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Brief description about this plan..."
            className="w-full p-4 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson resize-none"
          />
        </div>

        {state?.error && (
          <div className="text-sm text-crimson">{state.error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <Link href="/plans" className="flex-1 h-12 flex items-center justify-center border border-line-strong rounded-[10px] text-ink font-semibold hover:bg-line transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 h-12 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-white font-bold rounded-[10px] transition-colors"
          >
            {isPending ? "Creating..." : "Create Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}