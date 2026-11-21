export default function Loading() {
  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <div className="h-8 w-24 bg-slate rounded mb-4" />
        <div className="bg-slate rounded-tile h-[500px] animate-pulse" />
      </div>
    </div>
  );
}