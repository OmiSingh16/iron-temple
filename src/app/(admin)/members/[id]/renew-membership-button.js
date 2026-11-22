"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { renewMembership } from "@/lib/services/memberships";

export default function RenewMembershipButton({ memberId, plans, currentExpiryDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(plans[0]?.id || "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRenew = () => {
    if (!selectedPlan) return;
    startTransition(async () => {
      const result = await renewMembership(memberId, selectedPlan, currentExpiryDate);
      if (result.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="h-10 px-4 bg-crimson hover:bg-crimson-hover text-white font-bold text-sm rounded-[10px] transition-colors"
      >
        Renew Membership
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65">
          <div className="w-full max-w-[440px] bg-slate rounded-tile p-6">
            <h2 className="disp text-2xl text-ink mb-4 uppercase">Renew Membership</h2>
            <p className="text-xs text-ink-muted mb-4">Naya plan {new Date(currentExpiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ke agle din se shuru hoga.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-muted mb-2">Select Plan</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink focus:outline-none focus:border-crimson"
                >
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.plan_name} — {plan.duration_months} month{plan.duration_months > 1 ? 's' : ''} (₹{plan.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="flex-1 h-11 border border-line-strong rounded-[10px] text-ink font-semibold text-sm hover:bg-line"
              >
                Cancel
              </button>
              <button
                onClick={handleRenew}
                disabled={isPending || !selectedPlan}
                className="flex-1 h-11 bg-crimson hover:bg-crimson-hover text-white font-bold text-sm rounded-[10px] disabled:opacity-50"
              >
                {isPending ? "Renewing..." : "Renew"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}