import { getSupabaseServer } from "@/lib/supabase/server";
import QRDisplay from "@/components/admin/attendance/qr-display";
import ManualAttendance from "@/components/admin/attendance/manual-attendance";
import { Users, AlertTriangle } from "lucide-react";

export default async function AttendancePage() {
  const supabase = getSupabaseServer();

  // 1. Fetch QR Token
  const { data: settings } = await supabase.from("gym_settings").select("qr_token").single();
  const qrToken = settings?.qr_token || "setup-needed";

  // 2. Fetch Today's Attendance
  const today = new Date().toISOString().split("T")[0];
  const { data: todayAttendance } = await supabase
    .from("attendance")
    .select(`id, check_in_time, members (full_name, member_code)`)
    .eq("attendance_date", today)
    .order("check_in_time", { ascending: false });

  // 3. Fetch all active members for manual check-in
  const { data: allMembers } = await supabase
    .from("members")
    .select("id, full_name, member_code")
    .eq("is_active", true)
    .order("full_name");

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-1">Gate Access</p>
        <h1 className="disp text-5xl md:text-6xl text-ink">ATTENDANCE</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Tile */}
        <div className="space-y-4">
          <QRDisplay qrToken={qrToken} />
          
          <div className="bg-slate rounded-tile p-5 border border-line">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-crimson shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-ink-muted">
                This QR identifies the gym. Anyone with a photo of it can open check-in, so the system also checks the member's Telegram account and membership.
              </p>
            </div>
          </div>
        </div>

        {/* Manual & Today's List */}
        <div className="space-y-4">
          <ManualAttendance members={allMembers || []} />
          
          <div className="bg-slate rounded-tile p-5">
            <h2 className="disp text-2xl text-ink mb-4 flex items-center gap-2">
              <Users size={20} />
              TODAY'S CHECK-INS
            </h2>
            
            {!todayAttendance || todayAttendance.length === 0 ? (
              <p className="text-ink-muted text-sm">No one has checked in yet.</p>
            ) : (
              <div className="space-y-3">
                {todayAttendance.map((att) => (
                  <div key={att.id} className="flex items-center justify-between py-2 border-b border-line last:border-0">
                    <div>
                      <p className="font-semibold text-ink">{att.members.full_name}</p>
                      <p className="text-xs text-ink-muted num">{att.members.member_code}</p>
                    </div>
                    <p className="text-sm text-ink-muted num">
                      {new Date(att.check_in_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}