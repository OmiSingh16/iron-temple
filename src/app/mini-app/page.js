"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MiniAppHome() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      setStatus("error");
      setMessage("Please open this from the gym's QR code.");
      return;
    }

    // URL se token padho
    const urlParams = new URLSearchParams(window.location.search);
    const qrToken = urlParams.get("tgWebAppStartParam") || urlParams.get("qr") || tg.initDataUnsafe?.start_param;

    const fetchData = async () => {
      try {
        // Agar token hai to check-in karo
        if (qrToken) {
          const res = await fetch("/api/attendance/check-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData: tg.initData, qrToken }),
          });
          const data = await res.json();
          setStatus(data.status);
          
          const messages = {
            success: "You're checked in! 💪",
            already_checked_in: "You've already checked in today. See you tomorrow! 💪",
            no_membership: "Your membership is expired. Please renew at the desk.",
            member_inactive: "Your account is inactive. Please contact the owner.",
            unlinked: "Your Telegram is not linked. Please /start the bot first.",
            invalid_qr: "Invalid QR code. Please scan the gym's QR.",
            invalid_telegram: "Telegram verification failed.",
            error: "Something went wrong. Please try again.",
          };
          setMessage(messages[data.status] || "Unknown status.");
        } else {
          setStatus("no_token");
          setMessage("Welcome! Please scan the gym QR to check in.");
        }

        // Member data fetch karo (initData se)
        const user = tg.initDataUnsafe?.user;
        if (user) {
          const memberRes = await fetch(`/api/mini-app/member?telegram_id=${user.id}`);
          if (memberRes.ok) {
            const member = await memberRes.json();
            setMemberData(member);
          }
        }

        // Attendance history fetch karo
        const attRes = await fetch(`/api/mini-app/attendance?telegram_id=${tg.initDataUnsafe?.user?.id}`);
        if (attRes.ok) {
          const attData = await attRes.json();
          setAttendance(attData);
        }

      } catch (err) {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    };

    fetchData();
  }, []);

  // Status icon render karo
  const renderIcon = () => {
    if (status === "success" || status === "already_checked_in") {
      return (
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      );
    }
    if (status === "loading" || status === "no_token") {
      return null; // Loading spinner alag se handle hoga
    }
    // Error ke liye red cross
    return (
      <div className="w-12 h-12 rounded-full bg-crimson flex items-center justify-center mx-auto mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="disp text-4xl text-ink">
          IRON <span className="text-crimson">TEMPLE</span>
        </h1>
      </div>

      {/* Check-in Status Card */}
      <div className="bg-slate rounded-tile p-6 mb-4 text-center">
        {renderIcon()}
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-4 border-crimson border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-ink-muted text-sm">Verifying...</p>
          </>
        )}
        {(status === "success" || status === "already_checked_in") && (
          <>
            <h2 className="disp text-3xl text-ink mb-2">
              {status === "success" ? "CHECKED IN" : "ALREADY IN"}
            </h2>
            <p className="text-ink-muted text-sm">{message}</p>
          </>
        )}
        {status !== "loading" && status !== "success" && status !== "already_checked_in" && (
          <>
            <h2 className="disp text-3xl text-ink mb-2">
              {status === "no_token" ? "WELCOME" : "ERROR"}
            </h2>
            <p className="text-ink-muted text-sm">{message}</p>
          </>
        )}
      </div>

      {/* Member Info (agar mila to) */}
      {memberData && (
        <div className="bg-slate rounded-tile p-5 mb-4">
          <p className="eyebrow text-ink-muted mb-1">Member</p>
          <p className="text-ink font-semibold">{memberData.full_name}</p>
          <p className="text-ink-muted text-xs num">{memberData.member_code}</p>
          
          {memberData.membership && (
            <div className="mt-3 pt-3 border-t border-line">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-ink-muted">Membership</p>
                  <p className="text-ink font-semibold">{memberData.membership.plan_name}</p>
                </div>
                <div className="text-right">
                  <p className="disp text-2xl text-crimson">{memberData.membership.days_left}</p>
                  <p className="text-xs text-ink-muted">days left</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Attendance History */}
      {attendance.length > 0 && (
        <div className="bg-slate rounded-tile p-5">
          <p className="eyebrow text-ink-muted mb-3">Recent Check-ins</p>
          <div className="space-y-2">
            {attendance.slice(0, 5).map((att) => (
              <div key={att.id} className="flex justify-between text-sm">
                <span className="text-ink">
                  {new Date(att.attendance_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span className="text-ink-muted num">
                  {new Date(att.check_in_time).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}