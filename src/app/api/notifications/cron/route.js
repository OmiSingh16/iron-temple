import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getGymToday } from "@/lib/utils/date";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function sendTelegramMessage(chatId, text) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  const data = await res.json();
  return { ok: data.ok, messageId: data.result?.message_id, error: data.description };
}

export async function GET(req) {
  // 1. Verify CRON_SECRET
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  const today = getGymToday();
  
  // India time se 7 din baad ki date
  const todayDate = new Date(today);
  todayDate.setDate(todayDate.getDate() + 7);
  const yyyy = todayDate.getFullYear();
  const mm = String(todayDate.getMonth() + 1).padStart(2, "0");
  const dd = String(todayDate.getDate()).padStart(2, "0");
  const sevenDaysStr = `${yyyy}-${mm}-${dd}`;

  console.log("TODAY:", today, "| SEVEN DAYS:", sevenDaysStr);

  const results = { sent: 0, failed: 0, skipped: 0 };

  // 2. Fetch memberships expiring in 7 days (with members and telegram)
  const { data: expiringIn7, error: err7 } = await supabase
    .from("memberships")
    .select(`
      id, expiry_date, member_id,
      members!inner (
        full_name, phone,
        telegram_accounts (telegram_user_id)
      )
    `)
    .eq("status", "active")
    .eq("expiry_date", sevenDaysStr);

  console.log("QUERY ERROR:", err7);
  console.log("EXPIRING IN 7 COUNT:", expiringIn7?.length || 0);

  // 3. Fetch memberships expiring today
  const { data: expiringToday, error: errToday } = await supabase
    .from("memberships")
    .select(`
      id, expiry_date, member_id,
      members!inner (
        full_name, phone,
        telegram_accounts (telegram_user_id)
      )
    `)
    .eq("status", "active")
    .eq("expiry_date", today);

  console.log("EXPIRING TODAY COUNT:", expiringToday?.length || 0);

  // 4. Combine both lists
  const allNotifications = [
    ...(expiringIn7 || []).map((m) => ({ ...m, type: "7_days_before", label: "7 din baad" })),
    ...(expiringToday || []).map((m) => ({ ...m, type: "expiry_day", label: "aaj" })),
  ];

  console.log("TOTAL TO PROCESS:", allNotifications.length);

  for (const membership of allNotifications) {
    // Telegram ID members ke andar se nikaalo
    const telegramId = membership.members?.telegram_accounts?.telegram_user_id;
    const memberName = membership.members?.full_name || "Member";

    console.log("MEMBER:", memberName);
console.log("TELEGRAM DATA:", JSON.stringify(membership.members?.telegram_accounts));
console.log("TELEGRAM ID:", telegramId);
    const scheduledFor = membership.type === "7_days_before" ? sevenDaysStr : today;

    // Skip if no Telegram linked
    if (!telegramId) {
      await supabase.from("notification_logs").insert({
        member_id: membership.member_id,
        membership_id: membership.id,
        notification_type: membership.type,
        scheduled_for: scheduledFor,
        status: "unavailable",
        error_message: "No Telegram account linked",
      });
      results.skipped++;
      continue;
    }

    // Check if already sent (idempotency)
    const { data: existing } = await supabase
      .from("notification_logs")
      .select("id")
      .eq("membership_id", membership.id)
      .eq("notification_type", membership.type)
      .eq("scheduled_for", scheduledFor)
      .maybeSingle();

    if (existing) {
      results.skipped++;
      continue;
    }

    // Send Telegram message
    const expiryFormatted = new Date(membership.expiry_date).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });

    let message;
    if (membership.type === "7_days_before") {
      message = `🏋️ <b>Iron Temple</b>\n\nHi <b>${memberName}</b>, aapki membership <b>${expiryFormatted}</b> ko expire ho rahi hai (7 din baad).\n\nRenew karne ke liye gym counter pe aayein.`;
    } else {
      message = `⚠️ <b>Iron Temple</b>\n\nHi <b>${memberName}</b>, aapki membership <b>aaj</b> expire ho rahi hai.\n\nRenew karne ke liye turant gym counter pe aayein.`;
    }

    const sendResult = await sendTelegramMessage(telegramId, message);

    // Log the result
    await supabase.from("notification_logs").insert({
      member_id: membership.member_id,
      membership_id: membership.id,
      notification_type: membership.type,
      scheduled_for: scheduledFor,
      status: sendResult.ok ? "sent" : "failed",
      error_message: sendResult.ok ? null : sendResult.error,
    });

    if (sendResult.ok) results.sent++;
    else results.failed++;
  }

  return NextResponse.json({
    success: true,
    processed: allNotifications.length,
    ...results,
  });
}