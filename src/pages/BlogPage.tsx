import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSeo } from '@/lib/seo';
import { Section, GlowOrb, Breadcrumbs } from '@/components/ui';
import type { BlogPost, BlogCategory } from '@/lib/types';

export function BlogPage() {
  useSeo({ title: 'Blog — Articles on Design & AI', description: 'Articles on graphic design, branding, AI prompt engineering, and creative workflows by Lafazy.', canonicalPath: '/blog' });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    (async () => {
      const [{ data: p }, { data: c }] = await Promise.all([
        supabase.from('blog_posts').select('*, category:blog_categories(*)').eq('status', 'published').order('created_at', { ascending: false }),
        supabase.from('blog_categories').select('*').order('name'),
      ]);
      if (p) setPosts(p);
      if (c) setCategories(c);
    })();
  }, []);

  const filtered = posts.filter((p) => {
    const matchCat = active === 'all' || p.category_id === active;
    const matchQuery = !query || p.title.toLowerCase().includes(query.toLowerCase()) || (p.excerpt ?? '').toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  const featured = posts.find((p) => p.featured) ?? filtered[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-8">
        <GlowOrb className="w-[400px] h-[400px] bg-accent-500 top-0 left-10" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">Blog</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-balance">Thoughts on design & AI</h1>
            <p className="mt-6 text-lg text-gray-400">Articles, insights, and tutorials on graphic design, branding, and AI prompt engineering.</p>
          </motion.div>
        </div>
      </section>

      <Section className="!pt-8">
        <div className="container-max section-padding">
          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="input-field pl-11"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <button onClick={() => setActive('all')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${active === 'all' ? 'gradient-brand text-white' : 'glass text-gray-300'}`}>All</button>
              {categories.map((c) => (
                <button key={c.id} onClick={() => setActive(c.id)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${active === c.id ? 'gradient-brand text-white' : 'glass text-gray-300'}`}>{c.name}</button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">No articles found.</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && !query && active === 'all' && (
                <Link to={`/blog/${featured.slug}`} className="group block mb-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 glass-card p-6 sm:p-8">
                    <div className="aspect-[16/10] rounded-xl overflow-hidden glass">
                      {featured.cover_image_url ? (
                        <img src={featured.cover_image_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full gradient-brand opacity-30" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="badge w-fit mb-4">Featured</span>
                      <h2 className="text-2xl sm:text-3xl font-semibold text-white group-hover:text-brand-300 transition-colors">{featured.title}</h2>
                      {featured.excerpt && <p className="mt-3 text-gray-400 leading-relaxed line-clamp-3">{featured.excerpt}</p>}
                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                        <span>{new Date(featured.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featured.reading_time} min read</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(query || active !== 'all' ? filtered : rest).map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                    <Link to={`/blog/${p.slug}`} className="group block h-full">
                      <div className="aspect-[16/10] rounded-2xl overflow-hidden glass">
                        {p.cover_image_url ? (
                          <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full gradient-brand opacity-30" />
                        )}
                      </div>
                      <div className="mt-4">
                        <div className="text-xs text-brand-400 mb-1">{p.category?.name ?? 'Article'}</div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-2">{p.title}</h3>
                        {p.excerpt && <p className="text-sm text-gray-400 mt-1.5 line-clamp-2">{p.excerpt}</p>}
                        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                          <span>{new Date(p.created_at).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.reading_time} min</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </Section>
    </>
  );
}
