export default function PaymentsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-24 bg-slate rounded mb-2" />
          <div className="h-12 w-64 bg-slate rounded" />
        </div>
        <div className="h-12 w-32 bg-slate rounded-[10px]" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-slate rounded-tile p-5 h-32">
          <div className="h-4 w-24 bg-line rounded mb-3" />
          <div className="h-10 w-32 bg-line rounded" />
        </div>
        <div className="bg-slate rounded-tile p-5 h-32">
          <div className="h-4 w-24 bg-line rounded mb-3" />
          <div className="h-10 w-32 bg-line rounded" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="h-12 w-64 bg-slate rounded-[10px]" />

      {/* List Skeleton */}
      <div className="bg-slate rounded-tile overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 border-b border-line last:border-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-line shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-line rounded" />
              <div className="h-3 w-32 bg-line rounded" />
            </div>
            <div className="h-6 w-16 bg-line rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}