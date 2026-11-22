import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getGymToday } from "@/lib/utils/date";

export async function GET() {
  const supabase = getSupabaseServer();
  const today = getGymToday();
  const startOfMonth = today.substring(0, 7) + "-01";

  // Total Members
  const { count: totalMembers } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true });

  // Active Memberships
  const { count: activeMemberships } = await supabase
    .from("memberships")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .gte("expiry_date", today);

  // Today Collection
  const { data: todayPayments } = await supabase
    .from("payments")
    .select("amount")
    .eq("payment_date", today);
  const todayCollection = todayPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  // Pending Balance (Saari active memberships ka total due)
  const { data: activeM } = await supabase
    .from("memberships")
    .select("id, amount")
    .eq("status", "active")
    .gte("expiry_date", today);
    
  let totalPending = 0;
  if (activeM) {
    for (const m of activeM) {
      const { data: payments } = await supabase
        .from("payments")
        .select("amount")
        .eq("membership_id", m.id);
      const paid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const due = Number(m.amount) - paid;
      if (due > 0) totalPending += due;
    }
  }

  // Expiring in 7 days
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split("T")[0];
  
  const { data: expiring } = await supabase
    .from("memberships")
    .select("id")
    .eq("status", "active")
    .gte("expiry_date", today)
    .lte("expiry_date", nextWeekStr);

  // Recent Payments
  const { data: recentPayments } = await supabase
    .from("payments")
    .select("id, amount, payment_method, payment_date, members(full_name, member_code)")
    .order("created_at", { ascending: false })
    .limit(5);

  return NextResponse.json({
    totalMembers: totalMembers || 0,
    activeMemberships: activeMemberships || 0,
    todayCollection,
    totalPending,
    expiringCount: expiring?.length || 0,
    recentPayments: recentPayments || [],
  });
}