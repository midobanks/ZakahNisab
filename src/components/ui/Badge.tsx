import { cn } from '@/lib/utils';

interface BadgeProps {
  variant: 'success' | 'warning' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
};

const icons = {
  success: '✓',
  warning: '!',
  info: 'i',
  neutral: '·',
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      <span className="font-bold" aria-hidden="true">{icons[variant]}</span>
      {children}
    </span>
  );
}
