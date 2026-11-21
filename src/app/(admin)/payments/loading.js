export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate rounded" />
          <div className="h-12 w-64 bg-slate rounded" />
        </div>
        <div className="h-12 w-32 bg-slate rounded-[10px]" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="h-32 bg-slate rounded-tile" />
        <div className="h-32 bg-slate rounded-tile" />
      </div>
      <div className="h-8 w-48 bg-slate rounded mt-6" />
      <div className="bg-slate rounded-tile h-64" />
    </div>
  );
}