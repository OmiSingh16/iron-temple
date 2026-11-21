"use server";

import { getSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function assignMembership(memberId, planId, startDateStr) {
  const supabase = getSupabaseServer();

  // Fetch plan details
  const { data: plan, error: planError } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("id", planId)
    .single();

  if (planError || !plan) return { success: false, error: "Plan not found." };

  // Calculate expiry date
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