import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getGymToday } from "@/lib/utils/date";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");
  if (!memberId) return NextResponse.json([]);

  const supabase = getSupabaseServer();
  const today =  getGymToday();

  // Fetch active memberships
  const { data: memberships } = await supabase
    .from("memberships")
    .select("id, amount, start_date, expiry_date, membership_plans(plan_name, duration_months)")
    .eq("member_id", memberId)
    .eq("status", "active")
    .gte("expiry_date", today) // Sirf active wale
    .order("created_at", { ascending: false });

  if (!memberships) return NextResponse.json([]);

  // Har membership ka paid amount nikaalo
  const result = await Promise.all(
    memberships.map(async (m) => {
      const { data: payments } = await supabase
        .from("payments")
        .select("amount")
        .eq("membership_id", m.id);
      const paid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      return {
        id: m.id,
        plan_name: m.membership_plans.plan_name,
        amount: Number(m.amount),
        paid,
        balance: Number(m.amount) - paid,
        start_date: m.start_date,
        expiry_date: m.expiry_date,
        duration_months: m.membership_plans.duration_months,
      };
    })
  );

  return NextResponse.json(result);
}