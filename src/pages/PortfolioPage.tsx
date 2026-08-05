import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSeo } from '@/lib/seo';
import { Section, GlowOrb, Breadcrumbs } from '@/components/ui';
import type { PortfolioProject, ProjectCategory } from '@/lib/types';

export function PortfolioPage() {
  useSeo({
    title: 'Portfolio — Brand Identity, Logo Design & AI Creative | Lafazy Studio',
    description: 'Explore 6 detailed case studies in branding, logo design, visual identity, social media campaigns, and AI prompt engineering. Real projects with measurable outcomes for clients worldwide.',
    keywords: 'branding portfolio, logo design portfolio, visual identity case studies, AI prompt engineering, creative studio portfolio',
    canonicalPath: '/portfolio',
  });

  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [active, setActive] = useState<string>('all');

  useEffect(() => {
    (async () => {
      const [{ data: projs }, { data: cats }] = await Promise.all([
        supabase.from('portfolio_projects').select('*, category:project_categories(*)').eq('status', 'published').order('sort_order'),
        supabase.from('project_categories').select('*').order('name'),
      ]);
      if (projs) setProjects(projs);
      if (cats) setCategories(cats);
    })();
  }, []);

  const filtered = active === 'all' ? projects : projects.filter((p) => p.category_id === active);

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-8">
        <GlowOrb className="w-[400px] h-[400px] bg-brand-500 top-0 right-10" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Portfolio' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">Portfolio</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-balance">Selected creative work</h1>
            <p className="mt-6 text-lg text-gray-400">A curated selection of branding, visual identity, and digital design projects.</p>
          </motion.div>
        </div>
      </section>

      <Section className="!pt-8">
        <div className="container-max section-padding">
          {/* Filters */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
            <Filter className="w-4 h-4 text-gray-500 shrink-0" />
            <button
              onClick={() => setActive('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                active === 'all' ? 'gradient-brand text-white' : 'glass text-gray-300 hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  active === c.id ? 'gradient-brand text-white' : 'glass text-gray-300 hover:text-white'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link to={`/portfolio/${p.slug}`} className="group block">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass">
                      {p.cover_image_url ? (
                        <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full gradient-brand opacity-30 flex items-center justify-center">
                          <Palette className="w-12 h-12 text-white/50" />
                        </div>
                      )}
                      {p.featured && (
                        <span className="absolute top-3 left-3 badge bg-brand-500/20 border-brand-500/30 text-brand-200">Featured</span>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="text-xs text-brand-400 mb-1">{p.category?.name ?? 'Design'}</div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-brand-300 transition-colors">{p.title}</h3>
                      {p.excerpt && <p className="text-sm text-gray-400 mt-1 line-clamp-2">{p.excerpt}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Palette className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-gray-400">No projects published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
