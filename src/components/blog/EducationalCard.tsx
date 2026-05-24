import Link from 'next/link';
import { Card } from '@/components/ui';

interface EducationalCardProps {
  slug: string;
  title: string;
  excerpt: string;
}

export function EducationalCard({ slug, title, excerpt }: EducationalCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{excerpt}</p>
      </Card>
    </Link>
  );
}
