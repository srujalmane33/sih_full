import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

const IconButton = forwardRef(({ className, children, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };
  return (
    <button
      ref={ref}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40',
          sizeClasses[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
});

IconButton.displayName = 'IconButton';
export default IconButton;
