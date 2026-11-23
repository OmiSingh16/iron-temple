export default function PlanDetailSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate rounded-[10px]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 bg-slate rounded" />
          <div className="h-8 w-48 bg-slate rounded" />
        </div>
        <div className="h-10 w-32 bg-slate rounded-[10px]" />
      </div>

      {/* Description Skeleton */}
      <div className="h-4 w-3/4 bg-slate rounded" />

      {/* Days Tabs Skeleton (3x2 grid) */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-slate rounded-[10px]" />
        ))}
      </div>

      {/* Exercises List Skeleton */}
      <div className="bg-slate rounded-tile p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-24 bg-line rounded" />
          <div className="h-9 w-32 bg-line rounded-[10px]" />
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-black/40 rounded-[10px]">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-line rounded" />
                <div className="h-3 w-24 bg-line rounded" />
              </div>
              <div className="w-4 h-4 bg-line rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}