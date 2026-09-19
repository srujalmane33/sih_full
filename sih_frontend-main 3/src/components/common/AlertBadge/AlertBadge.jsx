import { getRiskConfig } from '@/config/riskLevels.config';
import { twMerge } from 'tailwind-merge';

export default function AlertBadge({ level, className, showDot = true }) {
  const config = getRiskConfig(level);
  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full border',
        config.badgeBg,
        config.badgeBorder,
        config.badgeText,
        className
      )}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {(level === 'HIGH' || level === 'CRITICAL') && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: config.color }} />
          )}
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: config.color }} />
        </span>
      )}
      {config.label}
    </span>
  );
}
