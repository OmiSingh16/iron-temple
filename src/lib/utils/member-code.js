import { getSupabaseServer } from "@/lib/supabase/server";

export async function generateMemberCode() {
  const supabase = getSupabaseServer();
  
  // Sabse bada member code dhoondo (jo GYM- se shuru hota hai)
  const { data } = await supabase
    .from("members")
    .select("member_code")
    .like("member_code", "GYM-%")
    .order("member_code", { ascending: false })
    .limit(1);

  if (!data || data.length === 0) return "GYM-0001";

  const lastCode = data[0].member_code;
  const lastNum = parseInt(lastCode.split("-")[1], 10);
  const nextNum = lastNum + 1;
  
  return `GYM-${String(nextNum).padStart(4, "0")}`;
}