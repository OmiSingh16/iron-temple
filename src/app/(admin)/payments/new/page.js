"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { recordPayment } from "@/lib/services/payments";

export default function NewPaymentPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  // Form state
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [balanceDue, setBalanceDue] = useState(0);
  
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  // Search members
  const handleSearch = async (query) => {
    setSearch(query);
    if (query.length < 2) {
      setMembers([]);
      return;
    }
    const res = await fetch(`/api/search-members?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      setMembers(data);
    }
  };

  // Select member -> fetch memberships
  const handleSelectMember = async (member) => {
    setSelectedMember(member);
    setMembers([]);
    setSearch(member.full_name);
    
    const res = await fetch(`/api/member-memberships?memberId=${member.id}`);
    if (res.ok) {
      const data = await res.json();
      setMemberships(data);
      if (data.length > 0) {
        setSelectedMembership(data[0]);
        setBalanceDue(data[0].balance);
      }
    }
  };

  // Select membership -> update balance
  const handleSelectMembership = (membershipId) => {
    const m = memberships.find((x) => x.id === membershipId);
    setSelectedMembership(m);
    setBalanceDue(m ? m.balance : 0);
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!selectedMembership) {
      setError("Select a member and membership first.");
      return;
    }

    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("membership_id", selectedMembership.id);
      formData.append("member_id", selectedMember.id);
      formData.append("amount", amt);
      formData.append("payment_method", method);
      formData.append("payment_date", paymentDate);
      formData.append("notes", notes);

      const result = await recordPayment(formData);
      if (result.success) {
        router.push(`/receipt/${result.paymentId}`);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/payments" className="p-2 -ml-2 hover:bg-slate rounded-[10px] transition-colors">
          <ArrowLeft size={24} className="text-ink" />
        </Link>
        <div>
          <p className="eyebrow mb-1">New Payment</p>
          <h1 className="disp text-4xl md:text-5xl text-ink">RECORD PAYMENT</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate rounded-tile p-6 space-y-5">
        {/* Member Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-ink-muted mb-2">Member *</label>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, phone or code..."
            className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson"
          />
          {members.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-slate border border-line-strong rounded-[10px] shadow-lg overflow-hidden max-h-60 overflow-y-auto">
              {members.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectMember(m)}
                  className="w-full text-left px-4 py-3 hover:bg-line transition-colors border-b border-line last:border-0"
                >
                  <p className="font-semibold text-ink">{m.full_name}</p>
                  <p className="text-xs text-ink-muted num">{m.member_code} · {m.phone}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Membership Selection */}
        {selectedMember && (
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-2">Membership *</label>
            {memberships.length === 0 ? (
              <p className="text-sm text-crimson">This member has no active membership.</p>
            ) : (
              <select
                value={selectedMembership?.id || ""}
                onChange={(e) => handleSelectMembership(e.target.value)}
                className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink focus:outline-none focus:border-crimson"
              >
                {memberships.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.plan_name} — Balance: ₹{m.balance.toLocaleString("en-IN")}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Balance & Amount */}
        {selectedMembership && (
          <>
            <div className="bg-black rounded-[10px] p-4">
              <p className="text-xs text-ink-muted mb-1">Balance Due</p>
              <p className="disp text-3xl text-crimson num">
                ₹{balanceDue.toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">Amount (₹) *</label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1000"
                required
                className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson num"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">Method *</label>
              <div className="grid grid-cols-2 gap-3">
                {["cash", "upi"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`h-12 font-bold text-sm rounded-[10px] transition-colors ${
                      method === m
                        ? "bg-crimson text-white border-2 border-crimson"
                        : "bg-black text-ink border border-line-strong hover:bg-line"
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink focus:outline-none focus:border-crimson"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Any relevant info..."
                className="w-full p-4 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson resize-none"
              />
            </div>
          </>
        )}

        {error && (
          <div className="text-sm text-crimson">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <Link href="/payments" className="flex-1 h-12 flex items-center justify-center border border-line-strong rounded-[10px] text-ink font-semibold hover:bg-line transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending || !selectedMembership}
            className="flex-1 h-12 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-white font-bold rounded-[10px] transition-colors"
          >
            {isPending ? "Saving..." : "Record Payment"}
          </button>
        </div>
      </form>
    </div>
  );
}