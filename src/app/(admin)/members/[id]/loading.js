export default function Loading() {
  return (
    <div className="space-y-6 max-w-3xl animate-pulse">
      {/* Back button skeleton */}
      <div className="h-8 w-24 bg-slate rounded-[10px]" />

      {/* Profile header skeleton */}
      <div className="bg-slate rounded-tile p-6 md:p-8">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-line shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 bg-line rounded" />
            <div className="h-4 w-32 bg-line rounded" />
          </div>
        </div>
      </div>

      {/* Info grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-slate rounded-tile p-5 h-24" />
        <div className="bg-slate rounded-tile p-5 h-24" />
        <div className="bg-slate rounded-tile p-5 h-24" />
        <div className="bg-slate rounded-tile p-5 h-24" />
      </div>
    </div>
  );
}