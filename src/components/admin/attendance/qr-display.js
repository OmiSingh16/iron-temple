"use client";

import { useEffect, useState, useTransition } from "react";
import QRCode from "qrcode";
import { Download, Printer, RefreshCw } from "lucide-react";
import { regenerateQR } from "@/lib/services/attendance";

export default function QRDisplay({ qrToken }) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Generate QR Code as Data URL
    // TODO: Change to t.me/YourBotName?startapp=qrToken later
    const checkInUrl = `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "irontemplegymbot"}?startapp=${qrToken}`;
    QRCode.toDataURL(checkInUrl, {
      width: 800,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [qrToken]);

  const handleRegenerate = () => {
    if (!confirm("Are you sure? The old printed QR will stop working immediately.")) return;
    startTransition(async () => {
      await regenerateQR();
    });
  };

  return (
    <div className="bg-slate rounded-tile p-6 flex flex-col items-center">
      <p className="eyebrow text-ink-muted mb-4">Permanent Gym QR</p>
      
      {/* White Tile for scanning */}
      <div className="bg-white p-4 rounded-[10px] mb-4">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="Gym QR" className="w-48 h-48 md:w-64 md:h-64" />
        ) : (
          <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-200 animate-pulse" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          onClick={() => {
            const a = document.createElement("a");
            a.href = qrDataUrl;
            a.download = "iron-temple-qr.png";
            a.click();
          }}
          className="h-10 flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-hover text-white font-bold text-sm rounded-[10px] transition-colors"
        >
          <Download size={16} />
          Save
        </button>
        <button
          onClick={() => window.print()}
          className="h-10 flex items-center justify-center gap-2 border border-line-strong hover:bg-line text-ink font-semibold text-sm rounded-[10px] transition-colors"
        >
          <Printer size={16} />
          Print
        </button>
      </div>
      
      <button
        onClick={handleRegenerate}
        disabled={isPending}
        className="mt-3 text-xs text-ink-muted hover:text-crimson flex items-center gap-1 transition-colors"
      >
        <RefreshCw size={12} className={isPending ? "animate-spin" : ""} />
        {isPending ? "Regenerating..." : "Regenerate QR"}
      </button>
    </div>
  );
}