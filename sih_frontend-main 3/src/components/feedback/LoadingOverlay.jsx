export default function LoadingOverlay({ message = 'Loading telemetry data...' }) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-600 animate-pulse">{message}</p>
    </div>
  );
}
