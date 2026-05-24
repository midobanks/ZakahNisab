import { EducationalCard } from '@/components/blog';
import { Disclaimer } from '@/components/shared';
import { BLOG_POSTS } from '@/data/blog-posts';

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Learn About Zakah</h1>
        <p className="mt-2 text-sm text-gray-500">
          Educational articles to help you understand Nisab, Zakah calculation, and related Islamic finance topics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {BLOG_POSTS.map((post) => (
          <EducationalCard key={post.slug} slug={post.slug} title={post.title} excerpt={post.excerpt} />
        ))}
      </div>

      <div className="mt-10">
        <Disclaimer />
      </div>
    </div>
  );
}
