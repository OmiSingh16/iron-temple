export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-24 bg-slate rounded mb-2" />
          <div className="h-12 w-48 bg-slate rounded" />
        </div>
        <div className="h-12 w-32 bg-slate rounded-[10px]" />
      </div>

      {/* Templates Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate rounded-tile p-5 h-48">
            <div className="w-10 h-10 rounded-full bg-line mb-3" />
            <div className="h-6 w-32 bg-line rounded mb-2" />
            <div className="h-3 w-full bg-line rounded mb-1" />
            <div className="h-3 w-2/3 bg-line rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}