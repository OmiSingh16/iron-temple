import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  if (q.length < 2) return NextResponse.json([]);

  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from("members")
    .select("id, full_name, member_code, phone")
    .or(`full_name.ilike.%${q}%,phone.ilike.%${q}%,member_code.ilike.%${q}%`)
    .eq("is_active", true)
    .limit(10);

  return NextResponse.json(data || []);
}