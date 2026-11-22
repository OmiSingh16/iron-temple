import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getGymToday } from "@/lib/utils/date";

export async function GET() {
  const supabase = getSupabaseServer();
  const today = getGymToday();
  const startOfMonth = today.substring(0, 7) + "-01";

  // Collections
  const { data: todayPayments } = await supabase
    .from("payments")
    .select("amount")
    .eq("payment_date", today);
  const todayTotal = todayPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  const { data: monthPayments } = await supabase
    .from("payments")
    .select("amount")
    .gte("payment_date", startOfMonth);
  const monthTotal = monthPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  // Recent Payments
  const { data: recentPayments } = await supabase
    .from("payments")
    .select(`id, amount, payment_method, payment_date, members (full_name, member_code)`)
    .order("created_at", { ascending: false })
    .limit(20);

  // Pending Dues (Har member ka total due)
  const { data: members } = await supabase.from("members").select("id, full_name, member_code");
  let pendingDues = [];
  let totalPending = 0;

  if (members) {
    for (const member of members) {
      const { data: m } = await supabase
        .from("memberships")
        .select("id, amount")
        .eq("member_id", member.id)
        .eq("status", "active")
        .gte("expiry_date", today);

      if (!m || m.length === 0) continue;

      const totalAmt = m.reduce((sum, x) => sum + Number(x.amount), 0);
      const ids = m.map((x) => x.id);

      const { data: p } = await supabase
        .from("payments")
        .select("amount")
        .in("membership_id", ids);
      const paid = p?.reduce((sum, x) => sum + Number(x.amount), 0) || 0;

      const due = totalAmt - paid;
      if (due > 0) {
        pendingDues.push({
          member_id: member.id,
          member_name: member.full_name,
          member_code: member.member_code,
          total_amount: totalAmt,
          paid: paid,
          balance: due,
        });
        totalPending += due;
      }
    }
  }

  return NextResponse.json({
    todayTotal,
    monthTotal,
    recentPayments: recentPayments || [],
    pendingDues,
    totalPending,
  });
}