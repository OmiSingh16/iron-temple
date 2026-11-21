export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate rounded" />
          <div className="h-12 w-64 bg-slate rounded" />
        </div>
        <div className="h-12 w-32 bg-slate rounded-[10px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="h-32 bg-slate rounded-tile" />
        <div className="h-32 bg-slate rounded-tile" />
        <div className="h-32 bg-slate rounded-tile" />
        <div className="h-32 bg-slate rounded-tile" />
      </div>
    </div>
  );
}