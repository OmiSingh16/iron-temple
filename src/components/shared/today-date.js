"use client";

export default function TodayDate() {
  const dateStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return <p className="eyebrow mb-1">{dateStr}</p>;
}