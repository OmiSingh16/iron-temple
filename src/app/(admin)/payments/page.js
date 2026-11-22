"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, IndianRupee, AlertCircle } from "lucide-react";
import PaymentsSkeleton from "@/components/shared/payments-skeleton";

export default function PaymentsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recent"); // "recent" ya "due"

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/payments");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <PaymentsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Collections</p>
          <h1 className="disp text-5xl md:text-6xl text-ink">PAYMENTS</h1>
        </div>
        <Link
          href="/payments/new"
          className="h-12 px-4 md:px-6 flex items-center gap-2 bg-crimson hover:bg-crimson-hover text-white font-bold text-[15px] rounded-[10px] transition-colors"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span className="hidden md:inline">Record Payment</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-slate rounded-tile p-5">
          <p className="eyebrow mb-2">Today Collection</p>
          <div className="disp text-4xl md:text-5xl text-ink num">
            ₹{data?.todayTotal?.toLocaleString("en-IN") || 0}
          </div>
        </div>
        <div className="bg-slate rounded-tile p-5 border border-crimson/30">
          <p className="eyebrow mb-2 text-crimson">Total Pending Due</p>
          <div className="disp text-4xl md:text-5xl text-crimson num">
            ₹{data?.totalPending?.toLocaleString("en-IN") || 0}
          </div>
        </div>
      </div>

      
            {/* Tabs */}
      <div className="flex gap-2 p-1 bg-black border border-line rounded-[10px] w-fit">
        <button
          onClick={() => setActiveTab("recent")}
          className={`px-4 py-2 text-sm font-semibold rounded-[8px] transition-colors ${
            activeTab === "recent"
              ? "bg-slate text-ink border border-crimson"
              : "text-ink-muted hover:text-ink hover:bg-slate/50"
          }`}
        >
          Recent Payments
        </button>
        <button
          onClick={() => setActiveTab("due")}
          className={`px-4 py-2 text-sm font-semibold rounded-[8px] transition-colors ${
            activeTab === "due"
              ? "bg-slate text-ink border border-crimson"
              : "text-ink-muted hover:text-ink hover:bg-slate/50"
          }`}
        >
          Pending Dues ({data?.pendingDues?.length || 0})
        </button>
      </div>

      {/* Content based on Tab */}
      <div className="bg-slate rounded-tile overflow-hidden">
        {activeTab === "recent" ? (
          // Recent Payments List
          !data?.recentPayments || data.recentPayments.length === 0 ? (
            <div className="p-8 text-center text-ink-muted">No payments recorded yet.</div>
          ) : (
            data.recentPayments.map((payment, idx) => (
              <Link
                key={payment.id}
                href={`/receipt/${payment.id}`}
                className={`block p-4 hover:bg-line transition-colors ${
                  idx !== data.recentPayments.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-line flex items-center justify-center shrink-0">
                    <IndianRupee size={16} className="text-ink-muted" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">{payment.members.full_name}</p>
                    <p className="text-sm text-ink-muted num">
                      {payment.members.member_code} · {payment.payment_method.toUpperCase()} ·{" "}
                      {new Date(payment.payment_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <div className="disp text-xl text-ink num text-right shrink-0">
                    ₹{Number(payment.amount).toLocaleString("en-IN")}
                  </div>
                </div>
              </Link>
            ))
          )
        ) : (
          // Pending Dues List
          !data?.pendingDues || data.pendingDues.length === 0 ? (
            <div className="p-8 text-center text-ink-muted">No pending dues. All clear!</div>
          ) : (
            data.pendingDues.map((due, idx) => (
              <Link
                key={due.id}
                href={`/members/${due.member_id}`}
                className={`block p-4 hover:bg-line transition-colors ${
                  idx !== data.pendingDues.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-crimson/20 flex items-center justify-center shrink-0">
                    <AlertCircle size={16} className="text-crimson" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">{due.member_name}</p>
                    <p className="text-sm text-ink-muted num">
                      {due.member_code} · Total: ₹{due.total_amount.toLocaleString("en-IN")} · Paid: ₹{due.paid.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="disp text-xl text-crimson num text-right shrink-0">
                    ₹{due.balance.toLocaleString("en-IN")}
                  </div>
                </div>
              </Link>
            ))
          )
        )}
      </div>
    </div>
  );
}