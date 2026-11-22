export default function MembersSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-32 bg-slate rounded mb-2" />
          <div className="h-12 w-48 bg-slate rounded" />
        </div>
        <div className="h-12 w-32 bg-slate rounded-[10px]" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="h-12 w-full bg-slate rounded-[10px]" />

      {/* Members List Skeleton */}
      <div className="bg-slate rounded-tile overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b border-line last:border-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-line shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-line rounded" />
              <div className="h-3 w-32 bg-line rounded" />
            </div>
            <div className="h-4 w-16 bg-line rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}