import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getGymToday } from "@/lib/utils/date";

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
    .gte("expiry_date", getGymToday())
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

  // Workout plan assignment
const { data: assignment } = await supabase
  .from("member_plan_assignments")
  .select("template_id, workout_templates(id, name, level)")
  .eq("member_id", member.id)
  .maybeSingle();

let todaysWorkout = null;
if (assignment) {
  const todayStr = getGymToday();
const todayDate = new Date(todayStr);
const today = todayDate.toLocaleDateString("en-US", { weekday: "long" }); ;
  const { data: exercises } = await supabase
    .from("workout_plan_items")
    .select("*")
    .eq("template_id", assignment.template_id)
    .eq("day_of_week", today)
    .order("created_at");

  if (exercises && exercises.length > 0) {
    todaysWorkout = {
      plan_name: assignment.workout_templates.name,
      day: today,
      exercises,
    };
  }
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
      workoutPlan: assignment ? assignment.workout_templates : null,
      todaysWorkout,
  });
}