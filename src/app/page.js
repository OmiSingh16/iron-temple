"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Browser me cookie check karo
    const hasSession = document.cookie.includes("iron_admin=");
    if (hasSession) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  // Loading state (jab tak redirect nahi hota)
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-crimson border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
