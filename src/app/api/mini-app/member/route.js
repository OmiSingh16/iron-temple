import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get("telegram_id");
  if (!telegramId) return NextResponse.json(null);

  const supabase = getSupabaseServer();

  // Find member
  const { data: tg } = await supabase
    .from("telegram_accounts")
    .select("member_id")
    .eq("telegram_user_id", telegramId)
    .maybeSingle();

  if (!tg) return NextResponse.json(null);

  const { data: member } = await supabase
    .from("members")
    .select("id, full_name, member_code, is_active")
    .eq("id", tg.member_id)
    .single();

  if (!member) return NextResponse.json(null);

  // Active membership
  const { data: memberships } = await supabase
    .from("memberships")
    .select("*, membership_plans(plan_name)")
    .eq("member_id", member.id)
    .eq("status", "active")
    .gte("expiry_date", new Date().toISOString().split("T")[0])
    .order("created_at", { ascending: false })
    .limit(1);

  const activeMembership = memberships?.[0];

  let daysLeft = 0;
  if (activeMembership) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(activeMembership.expiry_date);
    expiry.setHours(0, 0, 0, 0);
    daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  }

  return NextResponse.json({
    ...member,
    membership: activeMembership
      ? {
          plan_name: activeMembership.membership_plans.plan_name,
          expiry_date: activeMembership.expiry_date,
          days_left: daysLeft,
        }
      : null,
  });
}