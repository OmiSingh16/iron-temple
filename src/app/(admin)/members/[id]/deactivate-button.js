"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleMemberStatus } from "@/lib/services/members";

export default function DeactivateButton({ memberId, isActive }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleMemberStatus(memberId, !isActive);
      if (result.success) {
        setShowConfirm(false);
        router.refresh();
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="h-10 px-4 bg-transparent text-ink font-semibold text-sm rounded-[10px] border border-line-strong hover:bg-line transition-colors"
      >
        {isActive ? "Deactivate Member" : "Reactivate Member"}
      </button>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65">
          <div className="w-full max-w-[440px] bg-slate rounded-tile p-6">
            <h2 className="disp text-2xl text-ink mb-2 uppercase">
              {isActive ? "Deactivate" : "Reactivate"} this member?
            </h2>
            <p className="text-sm text-ink-muted mb-6">
              {isActive
                ? "They will not be able to check in. Their data will be preserved."
                : "They will be able to check in again if membership is active."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 h-11 border border-line-strong rounded-[10px] text-ink font-semibold text-sm hover:bg-line"
              >
                Cancel
              </button>
              <button
                onClick={handleToggle}
                disabled={isPending}
                className="flex-1 h-11 bg-crimson hover:bg-crimson-hover text-white font-bold text-sm rounded-[10px] disabled:opacity-50"
              >
                {isPending ? "Saving..." : isActive ? "Deactivate" : "Reactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}