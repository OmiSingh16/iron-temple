import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrintButton from "./print-button";

export default async function ReceiptPage({ params }) {
  const resolvedParams = await params;
  const supabase = getSupabaseServer();

  const { data: payment } = await supabase
    .from("payments")
    .select(`
      *,
      members (full_name, member_code, phone),
      memberships (amount, start_date, expiry_date, membership_plans(plan_name))
    `)
    .eq("id", resolvedParams.paymentId)
    .single();

  if (!payment) notFound();

  const balanceAfter = Number(payment.memberships.amount) - Number(payment.amount);

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-md mx-auto">
        {/* Controls (hidden when printing) */}
        <div className="flex items-center justify-between mb-4 print:hidden">
          <Link href="/payments" className="flex items-center gap-2 text-ink-muted hover:text-ink transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm">Back</span>
          </Link>
          <PrintButton />
        </div>

        {/* Receipt (white bg for print) */}
        <div className="bg-white text-black p-8 rounded-tile print:rounded-none">
          <div className="text-center mb-6 border-b-2 border-black pb-4">
            <h1 className="text-3xl font-black tracking-tight">IRON TEMPLE</h1>
            <p className="text-xs text-gray-600 mt-1">Payment Receipt</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Receipt No.</span>
              <span className="font-mono font-bold">{payment.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-semibold num">
                {new Date(payment.payment_date).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-300 space-y-2 text-sm">
            <div>
              <p className="text-xs text-gray-600">Member</p>
              <p className="font-bold">{payment.members.full_name}</p>
              <p className="text-xs text-gray-600 num">{payment.members.member_code} · {payment.members.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Plan</p>
              <p className="font-semibold">{payment.memberships.membership_plans.plan_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Validity</p>
              <p className="text-xs num">
                {new Date(payment.memberships.start_date).toLocaleDateString("en-IN")} —{" "}
                {new Date(payment.memberships.expiry_date).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-300 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Plan Amount</span>
              <span className="num">₹{Number(payment.memberships.amount).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Amount Paid</span>
              <span className="num">₹{Number(payment.amount).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Method</span>
              <span className="uppercase font-semibold">{payment.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Balance After</span>
              <span className="num">₹{Math.max(0, balanceAfter).toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-300 text-xs text-gray-600 text-center">
            Manually recorded by owner. Not an online verification.
          </div>
        </div>
      </div>
    </div>
  );
}