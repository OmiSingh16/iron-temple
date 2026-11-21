export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-slate rounded" />
        <div className="h-12 w-64 bg-slate rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate rounded-tile h-[400px]" />
        <div className="space-y-4">
          <div className="bg-slate rounded-tile h-48" />
          <div className="bg-slate rounded-tile h-64" />
        </div>
      </div>
    </div>
  );
}