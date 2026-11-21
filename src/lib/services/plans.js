"use server";

import { getSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addPlan(prevState, formData) {
  const planName = formData.get("plan_name");
  const durationMonths = parseInt(formData.get("duration_months"));
  const price = parseFloat(formData.get("price"));

  if (!planName || !durationMonths || isNaN(price)) {
    return { success: false, error: "Please fill all required fields." };
  }

  const supabase = getSupabaseServer();
  const { error } = await supabase.from("membership_plans").insert({
    plan_name: planName,
    duration_months: durationMonths,
    price: price,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/memberships");
  return { success: true };
}