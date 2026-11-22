"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Calendar, User, CreditCard, MessageCircle } from "lucide-react";
import DeactivateButton from "./deactivate-button";
import AssignMembershipButton from "./assign-membership-button";
import RenewMembershipButton from "./renew-membership-button";
import CollectPaymentButton from "./collect-payment-button";
import MemberProfileSkeleton from "@/components/shared/member-profile-skeleton";

export default function MemberDetailPage() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
  try {
    const res = await fetch(`/api/member-detail?id=${params.id}`);
    if (res.ok) {
      const result = await res.json();
      setData(result);
    } else {
      setError("Member not found");
    }
  } catch (err) {
    setError("Network error");
  }
  setLoading(false);
};

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/member-detail?id=${params.id}`);
        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          setError("Member not found");
        }
      } catch (err) {
        setError("Network error");
      }
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  if (loading) return <MemberProfileSkeleton />;
  if (error || !data) return <div className="p-4 text-crimson">{error || "Member not found"}</div>;

  const { member, memberships, totalAmount, totalPaid, totalDue, telegram, plans } = data;
  
  // Latest membership (agar hai to)
  const activeMembership = memberships && memberships.length > 0 ? memberships[0] : null;

  // Joined Date
  const joinedDate = new Date(member.created_at).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });

  // Days Left (Latest membership ke hisaab se)
  let daysLeft = 0;
  if (activeMembership) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(activeMembership.expiry_date);
    expiry.setHours(0, 0, 0, 0);
    daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back Button */}
      <div className="flex items-center gap-3">
        <Link href="/members" className="p-2 -ml-2 hover:bg-slate rounded-[10px] transition-colors">
          <ArrowLeft size={24} className="text-ink" />
        </Link>
        <p className="eyebrow">Member Profile</p>
      </div>

      {/* Profile Header */}
      <div className="bg-slate rounded-tile p-6 md:p-8">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-line flex items-center justify-center disp text-3xl text-ink shrink-0">
            {member.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="disp text-3xl md:text-4xl text-ink mb-1 break-words">
              {member.full_name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="num text-ink-muted">{member.member_code}</span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${member.is_active ? 'bg-white' : 'bg-crimson'}`} />
                <span className="text-ink">{member.is_active ? 'Active' : 'Inactive'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Status Tile */}
      <div className="bg-slate rounded-tile p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-ink-muted">
            <CreditCard size={18} strokeWidth={1.75} />
            <p className="eyebrow">Membership</p>
          </div>
        </div>

        {activeMembership ? (
          <div>
            <div className="flex items-baseline gap-3 mb-3">
              <div className="disp text-5xl text-crimson">{daysLeft}</div>
              <div>
                <p className="text-ink-muted text-sm">days left</p>
                <p className="text-ink text-sm">{activeMembership.membership_plans.plan_name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t border-line mb-4">
              <div>
                <p className="text-ink-muted text-xs mb-1">Started</p>
                <p className="text-ink num">
                  {new Date(activeMembership.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-ink-muted text-xs mb-1">Expires</p>
                <p className="text-ink num">
                  {new Date(activeMembership.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            {/* Total Fees, Paid, Due */}
            <div className="bg-black/40 rounded-[10px] p-4 flex justify-between items-center mb-4">
               <div>
                  <p className="text-xs text-ink-muted">Total Fees</p>
                  <p className="text-sm text-ink num">₹{totalAmount.toLocaleString("en-IN")}</p>
               </div>
               <div>
                  <p className="text-xs text-ink-muted">Paid</p>
                  <p className="text-sm text-ink num">₹{totalPaid.toLocaleString("en-IN")}</p>
               </div>
               <div>
                  <p className="text-xs text-ink-muted">Due</p>
                  <p className={`text-lg font-bold num ${totalDue > 0 ? "text-crimson" : "text-white"}`}>
                    ₹{totalDue.toLocaleString("en-IN")}
                  </p>
               </div>
            </div>

            {/* Buttons: Collect Payment + Renew */}
            <div className="flex gap-3">
              <div className="flex-1">
                <CollectPaymentButton
                  memberId={member.id}
                  dueAmount={totalDue}
                  onSuccess={fetchData}
                />
              </div>
              <div className="flex-1">
                <RenewMembershipButton
                  memberId={member.id}
                  plans={plans}
                  currentExpiryDate={activeMembership.expiry_date}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-ink-muted text-sm mb-4">No active membership.</p>
            <AssignMembershipButton memberId={member.id} plans={plans} />
          </div>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-slate rounded-tile p-5">
          <div className="flex items-center gap-2 mb-2 text-ink-muted">
            <Phone size={16} strokeWidth={1.75} />
            <p className="eyebrow">Phone</p>
          </div>
          <p className="text-ink num">{member.phone}</p>
        </div>

        <div className="bg-slate rounded-tile p-5">
          <div className="flex items-center gap-2 mb-2 text-ink-muted">
            <User size={16} strokeWidth={1.75} />
            <p className="eyebrow">Age</p>
          </div>
          <p className="text-ink num">{member.age || "Not set"}</p>
        </div>

        <div className="bg-slate rounded-tile p-5">
          <div className="flex items-center gap-2 mb-2 text-ink-muted">
            <Calendar size={16} strokeWidth={1.75} />
            <p className="eyebrow">Joined</p>
          </div>
          <p className="text-ink num">{joinedDate}</p>
        </div>

        <div className="bg-slate rounded-tile p-5">
          <div className="flex items-center gap-2 mb-2 text-ink-muted">
            <MessageCircle size={16} strokeWidth={1.75} />
            <p className="eyebrow">Telegram</p>
          </div>
          {telegram ? (
             <p className="text-ink text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                Linked {telegram.telegram_username ? `(@${telegram.telegram_username})` : ""}
             </p>
          ) : (
             <p className="text-ink-muted text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-crimson"></span>
                Not linked yet
             </p>
          )}
        </div>
      </div>

      {/* Notes */}
      {member.notes && (
        <div className="bg-slate rounded-tile p-5">
          <p className="eyebrow mb-2">Notes</p>
          <p className="text-ink-muted text-sm whitespace-pre-wrap">{member.notes}</p>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-slate rounded-tile p-5 border border-line">
        <p className="eyebrow mb-3 text-crimson">Danger Zone</p>
        <p className="text-sm text-ink-muted mb-4">
          Deactivating a member will prevent them from checking in. Their history will be preserved.
        </p>
        <DeactivateButton memberId={member.id} isActive={member.is_active} />
      </div>
    </div>
  );
}