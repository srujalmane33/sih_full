import { twMerge } from 'tailwind-merge';

export default function CardContent({ className, children }) {
  return <div className={twMerge('px-5 pb-5', className)}>{children}</div>;
}
