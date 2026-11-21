import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get("telegram_id");
  if (!telegramId) return NextResponse.json([]);

  const supabase = getSupabaseServer();

  const { data: tg } = await supabase
    .from("telegram_accounts")
    .select("member_id")
    .eq("telegram_user_id", telegramId)
    .maybeSingle();

  if (!tg) return NextResponse.json([]);

  const { data: attendance } = await supabase
    .from("attendance")
    .select("id, attendance_date, check_in_time")
    .eq("member_id", tg.member_id)
    .order("attendance_date", { ascending: false })
    .limit(10);

  return NextResponse.json(attendance || []);
}