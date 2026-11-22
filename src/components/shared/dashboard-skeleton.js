export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Masthead Skeleton */}
      <div>
        <div className="h-4 w-32 bg-slate rounded mb-2" />
        <div className="h-12 w-48 bg-slate rounded" />
      </div>

      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Hero Tile */}
        <div className="col-span-2 row-span-2 bg-slate rounded-tile p-5 min-h-[200px]">
          <div className="h-4 w-24 bg-line rounded mb-4" />
          <div className="h-16 w-16 bg-line rounded mb-4" />
          <div className="h-10 w-full bg-line rounded mt-auto" />
        </div>

        {/* 4 Stat Tiles */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate rounded-tile p-4 h-28 flex flex-col justify-between">
            <div className="h-4 w-16 bg-line rounded" />
            <div className="h-10 w-20 bg-line rounded" />
          </div>
        ))}
      </div>

      {/* Recent Payments Skeleton */}
      <div className="bg-slate rounded-tile p-5">
        <div className="h-6 w-40 bg-line rounded mb-4" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-line last:border-0">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-line rounded" />
                <div className="h-3 w-24 bg-line rounded" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-4 w-16 bg-line rounded ml-auto" />
                <div className="h-3 w-12 bg-line rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}