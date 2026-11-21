"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { addMember } from "@/lib/services/members";

export default function NewMemberPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(async (prev, formData) => {
    const result = await addMember(prev, formData);
    if (result.success) {
      router.push("/members");
      router.refresh();
    }
    return result;
  }, null);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/members" className="p-2 -ml-2 hover:bg-slate rounded-[10px] transition-colors">
          <ArrowLeft size={24} className="text-ink" />
        </Link>
        <div>
          <p className="eyebrow mb-1">New Member</p>
          <h1 className="disp text-4xl md:text-5xl text-ink">ADD MEMBER</h1>
        </div>
      </div>

      <form action={formAction} className="bg-slate rounded-tile p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink-muted mb-2">Full Name *</label>
          <input
            name="full_name"
            type="text"
            required
            placeholder="e.g. Rahul Sharma"
            className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson"
          />
          {state?.errors?.full_name && <p className="text-crimson text-xs mt-1">{state.errors.full_name[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-muted mb-2">Phone Number *</label>
          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            required
            placeholder="10-digit mobile number"
            className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson num"
          />
          {state?.errors?.phone && <p className="text-crimson text-xs mt-1">{state.errors.phone[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-muted mb-2">Age (optional)</label>
          <input
            name="age"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 28"
            className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-muted mb-2">Notes (optional)</label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Any relevant info about this member..."
            className="w-full p-4 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson resize-none"
          />
        </div>

        {state?.error && (
          <div className="flex items-start gap-2 text-sm text-ink bg-black p-3 rounded-[10px] border border-crimson">
            <span className="text-crimson">⚠</span>
            <p>{state.error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Link href="/members" className="flex-1 h-12 flex items-center justify-center border border-line-strong rounded-[10px] text-ink font-semibold hover:bg-line transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 h-12 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-white font-bold rounded-[10px] transition-colors"
          >
            {isPending ? "Saving..." : "Save Member"}
          </button>
        </div>
      </form>
    </div>
  );
}