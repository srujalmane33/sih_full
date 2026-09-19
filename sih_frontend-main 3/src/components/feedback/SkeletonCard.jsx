export default function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 animate-pulse shadow-2xs">
      <div className="flex justify-between items-start mb-4">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="h-5 w-16 bg-slate-100 rounded-full" />
      </div>
      <div className="space-y-3">
        <div className="h-3 w-full bg-slate-100 rounded" />
        <div className="h-3 w-3/4 bg-slate-100 rounded" />
        <div className="h-8 w-24 bg-slate-200 rounded mt-4" />
      </div>
    </div>
  );
}
