import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Share2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSeo } from '@/lib/seo';
import { Section, GlowOrb, CtaButton, Breadcrumbs, PageLoader } from '@/components/ui';
import type { BlogPost } from '@/lib/types';

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useSeo({ title: post?.title ?? 'Article', description: post?.excerpt ?? undefined, image: post?.cover_image_url ?? undefined, canonicalPath: slug ? `/blog/${slug}` : '/blog' });

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('blog_posts').select('*, category:blog_categories(*)').eq('slug', slug).eq('status', 'published').maybeSingle();
      setPost(data);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <PageLoader />;

  if (!post) {
    return (
      <div className="pt-32 pb-20 text-center container-max section-padding">
        <h1 className="text-2xl font-semibold text-white mb-4">Article not found</h1>
        <Link to="/blog" className="btn-ghost">Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-8">
        <GlowOrb className="w-[400px] h-[400px] bg-brand-500 top-0 right-10" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: post.title }]} />
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="text-sm text-brand-400 mb-3">{post.category?.name ?? 'Article'}</div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white text-balance leading-tight">{post.title}</h1>
            {post.excerpt && <p className="mt-4 text-lg text-gray-400">{post.excerpt}</p>}
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
              <span>By Lafazy</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.reading_time} min read</span>
            </div>
          </motion.div>
        </div>
      </section>

      {post.cover_image_url && (
        <div className="container-max section-padding">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="aspect-[16/9] rounded-3xl overflow-hidden glass">
            <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
          </motion.div>
        </div>
      )}

      <Section className="!pt-12">
        <div className="container-max section-padding">
          <div className="max-w-3xl">
            {post.content && (
              <article className="prose-content text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                {post.content}
              </article>
            )}
          </div>

          {/* Share */}
          <div className="max-w-3xl mt-12 pt-8 border-t border-white/10 flex items-center gap-4">
            <span className="text-sm text-gray-400 flex items-center gap-2"><Share2 className="w-4 h-4" /> Share</span>
            {['Twitter', 'LinkedIn', 'Facebook'].map((s) => (
              <button key={s} onClick={() => navigator.share?.({ title: post.title, url: window.location.href }).catch(() => {})} className="badge hover:bg-white/10 cursor-pointer">
                {s}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="container-max section-padding">
          <div className="glass-card p-8 sm:p-12 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Enjoyed this article?</h3>
            <p className="text-gray-400 mb-6">Let's connect and talk about your next creative project.</p>
            <CtaButton to="/contact">Get in Touch</CtaButton>
          </div>
        </div>
      </Section>
    </>
  );
}
