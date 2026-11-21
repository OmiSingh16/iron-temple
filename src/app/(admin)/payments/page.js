import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Plus, IndianRupee } from "lucide-react";
import { connection } from "next/server";

export default async function PaymentsPage() {

  await connection(); 
  const supabase = getSupabaseServer();
  
  // Aaj ki date nikalte hain (gym timezone ke hisaab se)
  const today = new Date().toISOString().split("T")[0];
  const startOfMonth = today.substring(0, 7) + "-01";

  // 1. Aaj ka collection
  const { data: todayPayments } = await supabase
    .from("payments")
    .select("amount")
    .eq("payment_date", today);

  // 2. Is mahine ka collection
  const { data: monthPayments } = await supabase
    .from("payments")
    .select("amount")
    .gte("payment_date", startOfMonth);

  // 3. Recent Payments (last 20)
  const { data: recentPayments } = await supabase
    .from("payments")
    .select(`
      id, amount, payment_method, payment_date,
      members (full_name, member_code)
    `)
    .order("created_at", { ascending: false })
    .limit(20);

  const todayTotal = todayPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const monthTotal = monthPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Collections</p>
          <h1 className="disp text-5xl md:text-6xl text-ink">PAYMENTS</h1>
        </div>
        <Link
          href="/payments/new"
          className="h-12 px-4 md:px-6 flex items-center gap-2 bg-crimson hover:bg-crimson-hover text-white font-bold text-[15px] rounded-[10px] transition-colors"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span className="hidden md:inline">Record Payment</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-slate rounded-tile p-5">
          <p className="eyebrow mb-2">Today</p>
          <div className="disp text-4xl md:text-5xl text-ink num">
            ₹{todayTotal.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="bg-slate rounded-tile p-5">
          <p className="eyebrow mb-2">This Month</p>
          <div className="disp text-4xl md:text-5xl text-ink num">
            ₹{monthTotal.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Recent Payments List */}
      <div>
        <h2 className="disp text-2xl text-ink mb-3">RECENT PAYMENTS</h2>
        
        {!recentPayments || recentPayments.length === 0 ? (
          <div className="bg-slate rounded-tile p-12 text-center">
            <p className="text-ink-muted mb-4">No payments recorded yet.</p>
            <Link href="/payments/new" className="inline-block h-10 px-6 bg-crimson text-white font-bold text-sm rounded-[10px] leading-10">
              Record first payment
            </Link>
          </div>
        ) : (
          <div className="bg-slate rounded-tile overflow-hidden">
            {recentPayments.map((payment, idx) => (
              <Link
                key={payment.id}
                href={`/receipt/${payment.id}`}
                className={`block p-4 hover:bg-line transition-colors ${
                  idx !== recentPayments.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-line flex items-center justify-center shrink-0">
                    <IndianRupee size={16} className="text-ink-muted" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">
                      {payment.members.full_name}
                    </p>
                    <p className="text-sm text-ink-muted num">
                      {payment.members.member_code} · {payment.payment_method.toUpperCase()} ·{" "}
                      {new Date(payment.payment_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <div className="disp text-xl text-ink num text-right shrink-0">
                    ₹{Number(payment.amount).toLocaleString("en-IN")}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}