export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-slate rounded-[10px]" />
      <div className="h-12 w-full bg-slate rounded-[10px]" />
      <div className="h-64 w-full bg-slate rounded-tile" />
    </div>
  );
}