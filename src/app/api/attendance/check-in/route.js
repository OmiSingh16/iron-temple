import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getGymToday } from "@/lib/utils/date";

// Telegram initData verify karo (Official HMAC procedure)
function verifyTelegramInitData(initData, botToken) {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) {
      console.log("No hash found in initData");
      return false;
    }
    params.delete("hash");

    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");

    // Secret key = HMAC_SHA256("WebAppData", botToken)
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();

    const hmac = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    console.log("=== HMAC DEBUG ===");
    console.log("Hash from Telegram:", hash);
    console.log("Calculated HMAC :", hmac);
    console.log("Match:", hmac === hash);
    console.log("==================");

    return hmac === hash;
  } catch (err) {
    console.error("HMAC error:", err);
    return false;
  }
}

export async function POST(req) {
  try {
    const { initData, qrToken } = await req.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    console.log("=== CHECK-IN REQUEST ===");
    console.log("initData exists?", !!initData);
    console.log("initData length:", initData?.length);
    console.log("qrToken received?", qrToken);
    console.log("botToken exists?", !!botToken);

    if (!initData || !botToken) {
      return NextResponse.json(
        { status: "error", message: "Missing initData or bot token" },
        { status: 400 }
      );
    }

    // 1. Verify initData
    if (!verifyTelegramInitData(initData, botToken)) {
      console.log("HMAC FAILED - Returning 401");
      return NextResponse.json({ status: "invalid_telegram" }, { status: 401 });
    }

    // 2. Parse Telegram user ID
    const params = new URLSearchParams(initData);
    const userStr = params.get("user");
    if (!userStr) {
      return NextResponse.json({ status: "no_user" }, { status: 401 });
    }
    const user = JSON.parse(userStr);
    const telegramUserId = String(user.id);
    console.log("Telegram user ID:", telegramUserId);

    // 3. DB RPC call
    const supabase = getSupabaseServer();
    const { data, error } = await supabase.rpc("check_member_attendance_status", {
      p_telegram_user_id: telegramUserId,
      p_qr_token: qrToken,
    });

    if (error) {
      console.error("RPC error:", error);
      return NextResponse.json(
        { status: "db_error", message: error.message },
        { status: 500 }
      );
    }

    console.log("RPC result:", data);

    // 4. Agar ready hai, attendance insert karo
    if (data.status === "ready") {
      const today =  getGymToday();
      const { error: insertError } = await supabase.from("attendance").insert({
        member_id: data.member_id,
        attendance_date: today,
      });

      if (insertError) {
        if (insertError.code === "23505") {
          return NextResponse.json({ status: "already_checked_in" });
        }
        return NextResponse.json(
          { status: "db_error", message: insertError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ status: "success" });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Check-in error:", err);
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}