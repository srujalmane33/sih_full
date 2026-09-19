import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Tooltip({ content, children, className, position = 'top' }) {
  const [show, setShow] = useState(false);
  const posClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && content && (
        <div className={twMerge('absolute z-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-md whitespace-nowrap', posClasses[position], className)}>
          {content}
        </div>
      )}
    </div>
  );
}
