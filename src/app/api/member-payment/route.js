import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getGymToday } from "@/lib/utils/date";

export async function POST(req) {
  try {
    const { memberId, amount, method, notes } = await req.json();
    const supabase = getSupabaseServer();
    const today = getGymToday();

    if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

    // Saari active memberships nikaalo (purani pehle)
    const { data: memberships } = await supabase
      .from("memberships")
      .select("id, amount")
      .eq("member_id", memberId)
      .eq("status", "active")
      .gte("expiry_date", today)
      .order("created_at", { ascending: true }); // Purani pehle

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ error: "No active memberships" }, { status: 400 });
    }

    let remainingAmount = Number(amount);

    // Waterfall adjustment: Pehle purani membership ka due clear karo
    for (const m of memberships) {
      if (remainingAmount <= 0) break;

      const { data: payments } = await supabase
        .from("payments")
        .select("amount")
        .eq("membership_id", m.id);
      const paid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const due = Number(m.amount) - paid;

      if (due > 0) {
        const payForThis = Math.min(remainingAmount, due);
        await supabase.from("payments").insert({
          member_id: memberId,
          membership_id: m.id,
          amount: payForThis,
          payment_method: method,
          payment_date: today,
          notes: notes || null,
        });
        remainingAmount -= payForThis;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}