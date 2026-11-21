import { NextResponse } from "next/server";

export async function GET(req) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  // ⚠️ IMPORTANT: Replace this with your real Vercel URL once deployed!
  const PUBLIC_URL = process.env.NEXT_PUBLIC_APP_URL;
  const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || "iron-temple-secret-2026";

  const webhookUrl = `${PUBLIC_URL}/api/telegram/webhook`;

  // Telegram Webhook set karo
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${webhookUrl}&secret_token=${WEBHOOK_SECRET}`
  );
  const data = await res.json();
  return NextResponse.json(data);
}