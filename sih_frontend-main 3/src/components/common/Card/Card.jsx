import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export default function Card({ className, children, hoverable = false, ...props }) {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl border border-slate-200/90 bg-white shadow-xs',
          hoverable && 'hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
