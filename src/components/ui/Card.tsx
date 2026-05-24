import { cn } from '@/lib/utils';

interface CardProps {
  title?: string;
  variant?: 'default' | 'highlight' | 'muted';
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, variant = 'default', children, className }: CardProps) {
  const variants = {
    default: 'bg-white border border-gray-200',
    highlight: 'bg-emerald-50 border border-emerald-200',
    muted: 'bg-gray-50 border border-gray-200',
  };

  return (
    <div className={cn('rounded-xl shadow-sm', variants[variant], className)}>
      {title && (
        <div className="border-b border-gray-200 px-5 py-3">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}
