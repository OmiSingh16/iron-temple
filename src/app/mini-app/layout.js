"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function MiniAppLayout({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor("#121212");
      tg.setBackgroundColor("#121212");
    }
  }, []);

  return (
    <>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      <div className="bg-black text-ink min-h-screen">
        <div className="max-w-[420px] mx-auto p-4">
          {children}
        </div>
      </div>
    </>
  );
}