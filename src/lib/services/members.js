"use server";

import { getSupabaseServer } from "@/lib/supabase/server";
import { memberSchema } from "@/lib/validations/member";
import { generateMemberCode } from "@/lib/utils/member-code";
import { revalidatePath } from "next/cache";

export async function addMember(prevState, formData) {
  const rawData = {
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    age: formData.get("age") || "",
    notes: formData.get("notes") || "",
  };

  const validated = memberSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  const supabase = getSupabaseServer();
  
  // Duplicate phone check
  const { data: existing } = await supabase
    .from("members")
    .select("id, full_name")
    .eq("phone", validated.data.phone)
    .maybeSingle();

  if (existing) {
    return { success: false, error: `Phone number already registered to ${existing.full_name}.` };
  }

  const memberCode = await generateMemberCode();

  const { data, error } = await supabase
    .from("members")
    .insert({
      full_name: validated.data.full_name,
      phone: validated.data.phone,
      member_code: memberCode,
      age: validated.data.age ? Number(validated.data.age) : null,
      notes: validated.data.notes || null,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/members");
  return { success: true, data };
}

export async function getMembers(search = "") {
  const supabase = getSupabaseServer();
  let query = supabase.from("members").select("*").order("created_at", { ascending: false });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,member_code.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function toggleMemberStatus(memberId, newStatus) {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("members")
    .update({ is_active: newStatus })
    .eq("id", memberId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/members");
  revalidatePath(`/members/${memberId}`);
  return { success: true };
}