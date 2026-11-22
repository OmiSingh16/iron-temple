"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getGymToday } from "@/lib/utils/date";
import { Users, IndianRupee } from "lucide-react";
import DashboardSkeleton from "@/components/shared/dashboard-skeleton";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-1">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
        </p>
        <h1 className="disp text-5xl md:text-6xl text-ink">TODAY</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Hero Tile */}
        <div className="col-span-2 row-span-2 bg-slate rounded-tile p-5 flex flex-col justify-between min-h-[200px]">
          <div>
            <p className="eyebrow text-crimson">Expiring in 7 days</p>
            <div className="disp text-7xl text-crimson mt-2">{data?.expiringCount || 0}</div>
          </div>
          <Link href="/members" className="text-sm font-semibold text-ink border border-line-strong rounded-[10px] py-2 mt-4 hover:bg-line transition-colors text-center">
            View all
          </Link>
        </div>

        {/* Stat Tiles */}
        <div className="bg-slate rounded-tile p-4 flex flex-col justify-between">
          <p className="eyebrow">Members</p>
          <div className="disp text-4xl text-ink mt-2">{data?.totalMembers || 0}</div>
        </div>
        <div className="bg-slate rounded-tile p-4 flex flex-col justify-between">
          <p className="eyebrow">Active</p>
          <div className="disp text-4xl text-ink mt-2">{data?.activeMemberships || 0}</div>
        </div>
        <div className="bg-slate rounded-tile p-4 flex flex-col justify-between">
          <p className="eyebrow">Collected</p>
          <div className="disp text-4xl text-ink mt-2 num">₹{data?.todayCollection?.toLocaleString("en-IN") || 0}</div>
        </div>
        <div className="bg-slate rounded-tile p-4 flex flex-col justify-between">
          <p className="eyebrow">Pending</p>
          <div className="disp text-4xl text-ink mt-2 num">₹{data?.totalPending?.toLocaleString("en-IN") || 0}</div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-slate rounded-tile p-5">
        <h2 className="disp text-2xl text-ink mb-4">RECENT PAYMENTS</h2>
        {!data?.recentPayments || data.recentPayments.length === 0 ? (
          <p className="text-sm text-ink-muted">No payments recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {data.recentPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-line last:border-0">
                <div>
                  <p className="font-semibold text-ink">{p.members.full_name}</p>
                  <p className="text-xs text-ink-muted num">{p.members.member_code} · {p.payment_method.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="disp text-lg text-ink num">₹{Number(p.amount).toLocaleString("en-IN")}</p>
                  <p className="text-xs text-ink-muted">{new Date(p.payment_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}