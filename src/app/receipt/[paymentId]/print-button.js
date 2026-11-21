"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 px-4 h-10 bg-crimson hover:bg-crimson-hover text-white font-bold text-sm rounded-[10px]"
    >
      <Printer size={16} />
      Print
    </button>
  );
}