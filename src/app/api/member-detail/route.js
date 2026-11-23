import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getGymToday } from "@/lib/utils/date";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("id");
  if (!memberId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = getSupabaseServer();
  const today = getGymToday();

  // Member
  const { data: member, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", memberId)
    .single();

  if (error || !member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  // Saari active memberships (chahe ek ho ya do)
  const { data: memberships } = await supabase
    .from("memberships")
    .select("*, membership_plans(plan_name, duration_months)")
    .eq("member_id", member.id)
    .eq("status", "active")
    .gte("expiry_date", today)
    .order("created_at", { ascending: false });

  // Total Amount (saari memberships ka)
  const totalAmount = memberships?.reduce((sum, m) => sum + Number(m.amount), 0) || 0;

  // Saari payments ka total (in memberships ke liye)
  let totalPaid = 0;
  if (memberships) {
    const membershipIds = memberships.map((m) => m.id);
    const { data: payments } = await supabase
      .from("payments")
      .select("amount")
      .in("membership_id", membershipIds);
    totalPaid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  }

  const totalDue = totalAmount - totalPaid;

  // Telegram
  const { data: telegram } = await supabase
    .from("telegram_accounts")
    .select("telegram_username")
    .eq("member_id", member.id)
    .maybeSingle();

  // Plans
  const { data: plans } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("is_active", true)
    .order("duration_months", { ascending: true });

  // Template assign kya hai
const { data: assignment } = await supabase
  .from("member_plan_assignments")
  .select("template_id, workout_templates(name, level)")
  .eq("member_id", memberId)
  .maybeSingle();  

  return NextResponse.json({
    member,
    memberships: memberships || [], // Saari memberships
    totalAmount,
    totalPaid,
    totalDue,
    telegram,
    plans: plans || [],
    workoutPlan: assignment || null, 
  });
}