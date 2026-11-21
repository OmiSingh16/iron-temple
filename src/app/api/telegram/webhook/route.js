import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function sendMessage(chatId, text, replyMarkup = null) {
  const body = { chat_id: chatId, text, parse_mode: "HTML" };
  if (replyMarkup) body.reply_markup = replyMarkup;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function POST(req) {
  try {
    const secret = req.headers.get("x-telegram-bot-api-secret-token");
    if (process.env.TELEGRAM_WEBHOOK_SECRET && secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const update = await req.json();
    const message = update.message;

    if (!message) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text || "";
    const contact = message.contact;
    const supabase = getSupabaseServer();

    // 1. /start command
    if (text.startsWith("/start")) {
      // Check karo ki member registered hai ya nahi
      const { data: existing } = await supabase
        .from("telegram_accounts")
        .select("member_id")
        .eq("telegram_user_id", String(chatId))
        .maybeSingle();

      // Agar member already registered hai
      if (existing) {
        const startParam = text.split(" ")[1];

        // Agar QR se aaya hai (startParam hai), to Mini App button bhejo
        if (startParam) {
          await sendMessage(
            chatId,
            "🏋️ <b>Ready to check in?</b>\n\nTap the button below to open the Mini App.",
            {
              inline_keyboard: [[
                {
                  text: "🚪 Open Gym",
                  url: `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}/gym?startapp=${startParam}`,
                },
              ]],
            }
          );
        } else {
          // Normal /start (bina QR ke)
          await sendMessage(
            chatId,
            `Welcome back! You are already registered.\n\nOpen Mini App: ${process.env.NEXT_PUBLIC_APP_URL}/mini-app`
          );
        }
        return NextResponse.json({ ok: true });
      }

      // Agar member registered NAHI hai, to contact share button bhejo
      await sendMessage(
        chatId,
        "Welcome to <b>Iron Temple</b>! 🏋️\n\nTo register, please share your phone number using the button below.",
        {
          keyboard: [[{ text: "📱 Share My Number", request_contact: true }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        }
      );
      return NextResponse.json({ ok: true });
    }

    // 2. Contact share handling
    if (contact) {
      if (contact.user_id !== message.from.id) {
        await sendMessage(chatId, "⚠️ Please share your OWN phone number.");
        return NextResponse.json({ ok: true });
      }

      let phone = contact.phone_number.replace(/[^0-9]/g, "");
      if (phone.startsWith("91") && phone.length > 10) phone = phone.slice(2);
      if (phone.length !== 10) {
        await sendMessage(chatId, "⚠️ Invalid phone number format. Please try again.");
        return NextResponse.json({ ok: true });
      }

      const { data: existingTelegram } = await supabase
        .from("telegram_accounts")
        .select("member_id")
        .eq("telegram_user_id", String(chatId))
        .maybeSingle();

      if (existingTelegram) {
        await sendMessage(chatId, "⚠️ This Telegram account is already linked.");
        return NextResponse.json({ ok: true });
      }

      const { data: member } = await supabase
        .from("members")
        .select("id, full_name, member_code")
        .eq("phone", phone)
        .eq("is_active", true)
        .maybeSingle();

      if (!member) {
        await sendMessage(chatId, "❌ Your phone number is not registered with our gym.\n\nPlease contact the gym owner.");
        return NextResponse.json({ ok: true });
      }

      const { error } = await supabase.from("telegram_accounts").insert({
        member_id: member.id,
        telegram_user_id: String(chatId),
        telegram_username: message.from.username || null,
        phone_verified_at: new Date().toISOString(),
      });

      if (error) {
        await sendMessage(chatId, "⚠️ Something went wrong. Please try again later.");
        return NextResponse.json({ ok: true });
      }

      await sendMessage(
        chatId,
        `✅ Welcome <b>${member.full_name}</b>! You are now registered.\n\nMember Code: <code>${member.member_code}</code>\n\nYou can now check in by scanning the gym QR code.`,
        { remove_keyboard: true }
      );
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}