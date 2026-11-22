export default function MemberProfileSkeleton() {
  return (
    <div className="space-y-6 max-w-3xl animate-pulse">
      {/* Back Button & Header Skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate rounded-[10px]" />
        <div className="h-4 w-24 bg-slate rounded" />
      </div>

      {/* Profile Header Skeleton */}
      <div className="bg-slate rounded-tile p-6 md:p-8">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-line shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 bg-line rounded" />
            <div className="h-4 w-32 bg-line rounded" />
          </div>
        </div>
      </div>

      {/* Membership Status Tile Skeleton */}
      <div className="bg-slate rounded-tile p-6 h-48 flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-line" />
          <div className="h-4 w-24 bg-line rounded" />
        </div>
        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <div className="h-12 w-16 bg-line rounded" />
            <div className="h-4 w-20 bg-line rounded" />
          </div>
          <div className="h-10 w-full bg-black/40 rounded-[10px]" />
        </div>
      </div>

      {/* Info Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate rounded-tile p-5 h-24 flex flex-col justify-between">
            <div className="h-4 w-16 bg-line rounded" />
            <div className="h-6 w-32 bg-line rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}