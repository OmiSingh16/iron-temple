import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const templateId = searchParams.get("id");
  if (!templateId) return NextResponse.json(null, { status: 400 });

  const supabase = getSupabaseServer();

  const { data: template } = await supabase
    .from("workout_templates")
    .select("*")
    .eq("id", templateId)
    .single();

  if (!template) return NextResponse.json(null, { status: 404 });

  const { data: exercises } = await supabase
    .from("workout_plan_items")
    .select("*")
    .eq("template_id", templateId)
    .order("created_at", { ascending: true });

  return NextResponse.json({
    template,
    exercises: exercises || [],
  });
}