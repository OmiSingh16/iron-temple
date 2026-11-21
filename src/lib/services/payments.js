"use server";

import { getSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function recordPayment(formData) {
  const supabase = getSupabaseServer();
  
  const memberId = formData.get("member_id");
  const membershipId = formData.get("membership_id");
  const amount = parseFloat(formData.get("amount"));
  const method = formData.get("payment_method");
  const date = formData.get("payment_date");
  const notes = formData.get("notes");

  const { data, error } = await supabase
    .from("payments")
    .insert({
      member_id: memberId,
      membership_id: membershipId,
      amount,
      payment_method: method,
      payment_date: date,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/payments");
  revalidatePath(`/members/${memberId}`);
  return { success: true, paymentId: data.id };
}