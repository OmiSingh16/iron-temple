"use server";

import { getSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { getGymToday } from "../utils/date";

export async function regenerateQR() {
  const supabase = getSupabaseServer();
  const newToken = crypto.randomBytes(16).toString("hex");
  const { error } = await supabase.from("gym_settings").update({ qr_token: newToken }).eq("id", "some-id");
  // Actually gym_settings me sirf ek row hai, so we need to update the first row
  // Let's just update all rows (since it's a single-tenant app)
  const { error: err2 } = await supabase.from("gym_settings").update({ qr_token: newToken }).neq("qr_token", "none");
  
  if (err2) return { success: false, error: err2.message };
  
  revalidatePath("/attendance");
  return { success: true };
}

export async function markManualAttendance(memberId) {
  const supabase = getSupabaseServer();
  const today =  getGymToday();
  
  // Check if member is active
  const { data: member } = await supabase.from("members").select("is_active").eq("id", memberId).single();
  if (!member || !member.is_active) return { success: false, error: "Member is inactive." };

  // Try to insert attendance (unique constraint will catch duplicates)
  const { error } = await supabase.from("attendance").insert({
    member_id: memberId,
    attendance_date: today,
  });

  if (error) {
    if (error.code === "23505") return { success: false, error: "Already checked in today." };
    return { success: false, error: error.message };
  }

  revalidatePath("/attendance");
  return { success: true };
}