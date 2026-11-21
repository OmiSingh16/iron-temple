import TodayDate from "@/components/shared/today-date";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Masthead */}
      <div>
        <TodayDate />
        <h1 className="disp text-5xl md:text-6xl text-ink">TODAY</h1>
      </div>

      {/* Bento Grid Placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        
        {/* Hero Tile (Expiring) */}
        <div className="col-span-2 row-span-2 bg-slate rounded-tile p-5 flex flex-col justify-between min-h-[200px]">
          <div>
            <p className="eyebrow text-crimson">Expiring in 7 days</p>
            <div className="disp text-7xl text-crimson mt-2">0</div>
          </div>
          <button className="text-sm font-semibold text-ink border border-line-strong rounded-[10px] py-2 mt-4 hover:bg-line transition-colors">
            View all
          </button>
        </div>

        {/* Stat Tiles Placeholder */}
        <div className="bg-slate rounded-tile p-4 flex flex-col justify-between">
          <p className="eyebrow">Members</p>
          <div className="disp text-4xl text-ink mt-2">0</div>
        </div>

        <div className="bg-slate rounded-tile p-4 flex flex-col justify-between">
          <p className="eyebrow">Active</p>
          <div className="disp text-4xl text-ink mt-2">0</div>
        </div>
        
        <div className="bg-slate rounded-tile p-4 flex flex-col justify-between">
          <p className="eyebrow">Collected</p>
          <div className="disp text-4xl text-ink mt-2 num">₹0</div>
        </div>

        <div className="bg-slate rounded-tile p-4 flex flex-col justify-between">
          <p className="eyebrow">Pending</p>
          <div className="disp text-4xl text-ink mt-2 num">₹0</div>
        </div>
      </div>

      {/* List Placeholder */}
      <div className="bg-slate rounded-tile p-5 min-h-[150px]">
        <h2 className="disp text-2xl text-ink mb-4">RECENT PAYMENTS</h2>
        <p className="text-sm text-ink-muted">No payments recorded yet.</p>
      </div>
    </div>
  );
}