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

export async function createPlan(prevState, formData) {
  const supabase = getSupabaseServer();
  
  const name = formData.get("name");
  const level = formData.get("level");
  const description = formData.get("description") || null;

  if (!name || !level) {
    return { success: false, error: "Name and Level are required." };
  }

  const { data, error } = await supabase
    .from("workout_templates")
    .insert({ name, level, description })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/plans");
  return { success: true, templateId: data.id };
}

export async function addExercise({ templateId, dayOfWeek, exerciseName, sets, reps, duration, notes }) {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("workout_plan_items").insert({
    template_id: templateId,
    day_of_week: dayOfWeek,
    exercise_name: exerciseName,
    sets,
    reps,
    duration: duration || null,
    notes: notes || null,
  });
  if (error) return { success: false, error: error.message };
  revalidatePath(`/plans/${templateId}`);
  return { success: true };
}

export async function deleteExercise(exerciseId) {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("workout_plan_items").delete().eq("id", exerciseId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function assignWorkoutPlan(memberId, templateId) {
  const supabase = getSupabaseServer();
  
  // Upsert (agar pehle se assign hai to replace karo)
  const { error } = await supabase
    .from("member_plan_assignments")
    .upsert(
      { member_id: memberId, template_id: templateId },
      { onConflict: "member_id" }
    );

  if (error) return { success: false, error: error.message };

  revalidatePath(`/members/${memberId}`);
  return { success: true };
}