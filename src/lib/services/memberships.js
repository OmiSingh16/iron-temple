"use server";

import { getSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getGymToday } from "@/lib/utils/date";

export async function assignMembership(memberId, planId, startDateStr) {
  const supabase = getSupabaseServer();

  const { data: plan, error: planError } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("id", planId)
    .single();

  if (planError || !plan) return { success: false, error: "Plan not found." };

  const startDate = new Date(startDateStr);
  const expiryDate = new Date(startDate);
  expiryDate.setMonth(expiryDate.getMonth() + plan.duration_months);

  const { error } = await supabase.from("memberships").insert({
    member_id: memberId,
    plan_id: planId,
    start_date: startDateStr,
    expiry_date: expiryDate.toISOString().split("T")[0],
    amount: plan.price,
    status: "active",
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/members/${memberId}`);
  revalidatePath("/members");
  return { success: true };
}

export async function renewMembership(memberId, planId, currentExpiryDate) {
  const supabase = getSupabaseServer();
  
  const { data: plan, error: planError } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("id", planId)
    .single();

  if (planError || !plan) return { success: false, error: "Plan not found." };

  const today =  getGymToday();
  let startDateStr = today;

  // Agar current expiry future me hai, to uske agle din se shuru karo
  if (currentExpiryDate && currentExpiryDate >= today) {
    const nextDay = new Date(currentExpiryDate);
    nextDay.setDate(nextDay.getDate() + 1);
    startDateStr = nextDay.toISOString().split("T")[0];
  }

  const startDate = new Date(startDateStr);
  const expiryDate = new Date(startDate);
  expiryDate.setMonth(expiryDate.getMonth() + plan.duration_months);

  const { error } = await supabase.from("memberships").insert({
    member_id: memberId,
    plan_id: planId,
    start_date: startDateStr,
    expiry_date: expiryDate.toISOString().split("T")[0],
    amount: plan.price,
    status: "active",
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/members/${memberId}`);
  revalidatePath("/members");
  return { success: true };
}