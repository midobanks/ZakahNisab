import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Disclaimer } from '@/components/shared';
import { Button } from '@/components/ui';
import { BLOG_POSTS } from '@/data/blog-posts';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6">
        <Link href="/blog" className="text-sm text-emerald-700 hover:text-emerald-800 transition-colors">
          &larr; Back to articles
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-6">{post.title}</h1>

      <div className="prose prose-sm prose-gray max-w-none leading-relaxed space-y-4 text-gray-700">
        {post.content.split('\n\n').map((paragraph, i) => {
          if (paragraph.startsWith('**') && paragraph.includes(':**')) {
            const [title, ...rest] = paragraph.split('\n');
            const body = rest.join('\n');
            return (
              <div key={i}>
                <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
                  {title.replace(/\*\*/g, '')}
                </h2>
                <p className="text-sm leading-relaxed">{body}</p>
              </div>
            );
          }
          return (
            <p key={i} className="text-sm leading-relaxed">
              {paragraph.split('\n').map((line, j) => (
                <span key={j}>
                  {line.startsWith('- ') ? (
                    <>
                      {j > 0 && <br />}
                      <span className="block ml-4">&bull; {line.slice(2)}</span>
                    </>
                  ) : (
                    <>
                      {j > 0 && <br />}
                      {line}
                    </>
                  )}
                </span>
              ))}
            </p>
          );
        })}
      </div>

      <div className="mt-10 space-y-6">
        <Disclaimer />
        <div className="text-center">
          <Link href="/calculator">
            <Button>Calculate Your Zakah Now</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
