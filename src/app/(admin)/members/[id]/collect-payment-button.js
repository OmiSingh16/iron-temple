"use client";

import { useState, useTransition } from "react";
import { IndianRupee } from "lucide-react";

export default function CollectPaymentButton({ memberId, dueAmount, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(dueAmount);
  const [method, setMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    startTransition(async () => {
      const res = await fetch("/api/member-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId,
          amount: Number(amount),
          method,
          notes,
        }),
      });

      if (res.ok) {
        setIsOpen(false);
        if (onSuccess) onSuccess(); // 👈 Parent ko batao ki data refresh kare
      } else {
        alert("Payment failed. Try again.");
      }
    });
  };

  if (dueAmount <= 0) {
    return (
      <div className="h-10 px-4 bg-green-500/10 text-green-500 font-bold text-sm rounded-[10px] flex items-center justify-center mb-4">
        All Dues Cleared
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full h-10 px-4 bg-crimson hover:bg-crimson-hover text-white font-bold text-sm rounded-[10px] transition-colors mb-4 flex items-center justify-center gap-2"
      >
        <IndianRupee size={16} />
        Collect ₹{dueAmount.toLocaleString("en-IN")} Due
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65">
          <div className="w-full max-w-[400px] bg-slate rounded-tile p-6">
            <h2 className="disp text-2xl text-ink mb-4 uppercase">Collect Payment</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-muted mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  max={dueAmount}
                  className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink text-lg num focus:outline-none focus:border-crimson"
                  required
                />
                <p className="text-xs text-ink-muted mt-1">Max due: ₹{dueAmount.toLocaleString("en-IN")}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-muted mb-1">Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {["cash", "upi"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`h-10 font-bold text-sm rounded-[10px] transition-colors ${
                        method === m
                          ? "bg-crimson text-white border-2 border-crimson"
                          : "bg-black text-ink border border-line-strong"
                      }`}
                    >
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-muted mb-1">Notes (optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Paid in cash"
                  className="w-full h-10 px-4 bg-black border border-line-strong rounded-[10px] text-ink text-sm focus:outline-none focus:border-crimson"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 h-10 border border-line-strong rounded-[10px] text-ink font-semibold text-sm hover:bg-line"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 h-10 bg-crimson hover:bg-crimson-hover text-white font-bold text-sm rounded-[10px] disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}