import { twMerge } from 'tailwind-merge';

export default function CardHeader({ className, title, subtitle, action, children }) {
  return (
    <div className={twMerge('flex items-start justify-between px-5 pt-5 pb-3', className)}>
      <div>
        {title && <h3 className="text-sm font-semibold text-slate-900">{title}</h3>}
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}
