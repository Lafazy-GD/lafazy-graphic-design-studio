import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Palette, Bot, Download, Wrench, ArrowRight, Clock, Package, TrendingUp, Target, Search, Lightbulb, PenTool, BarChart3, GitCompare, FileCheck, Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSeo, setJsonLd } from '@/lib/seo';
import { Section, GlowOrb, CtaButton, Breadcrumbs, PageLoader, EmptyState } from '@/components/ui';
import { trackPortfolioView } from '@/lib/analytics';
import type { PortfolioProject, PortfolioMedia } from '@/lib/types';

const CASE_STUDY_SECTIONS = [
  { key: 'problem', label: 'Problem', icon: Target },
  { key: 'research', label: 'Research', icon: Search },
  { key: 'strategy', label: 'Strategy', icon: Lightbulb },
  { key: 'design_process', label: 'Design Process', icon: PenTool },
  { key: 'results', label: 'Results', icon: BarChart3 },
  { key: 'before_after', label: 'Before / After', icon: GitCompare },
  { key: 'deliverables', label: 'Deliverables', icon: Package },
  { key: 'client_outcome', label: 'Client Outcome', icon: Trophy },
] as const;

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [media, setMedia] = useState<PortfolioMedia[]>([]);
  const [related, setRelated] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useSeo({
    title: project?.title ?? 'Project',
    description: project?.excerpt ?? undefined,
    image: project?.cover_image_url ?? undefined,
  });

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('portfolio_projects')
        .select('*, category:project_categories(*)')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (!data) { setLoading(false); return; }
      setProject(data);

      const [{ data: mediaData }, { data: relData }] = await Promise.all([
        supabase.from('portfolio_media').select('*').eq('project_id', data.id).order('sort_order'),
        supabase.from('portfolio_projects').select('*, category:project_categories(*)').eq('status', 'published').neq('id', data.id).limit(3),
      ]);
      if (mediaData) setMedia(mediaData);
      if (relData) setRelated(relData);
      setLoading(false);
      trackPortfolioView(slug);

      setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: data.title,
        description: data.excerpt ?? undefined,
        creator: { '@type': 'Person', name: 'Lafazy' },
        url: `https://lafazystudio.com/portfolio/${data.slug}`,
        image: data.cover_image_url ?? undefined,
      });
    })();
  }, [slug]);

  if (loading) return <PageLoader />;

  if (!project) {
    return (
      <div className="pt-32 pb-20 container-max section-padding">
        <EmptyState
          icon={Palette}
          title="Project not found"
          message="The project you're looking for doesn't exist or has been removed."
          action={<Link to="/portfolio" className="btn-ghost">Back to Portfolio</Link>}
        />
      </div>
    );
  }

  const hasCaseStudy = CASE_STUDY_SECTIONS.some((s) => (project as unknown as Record<string, unknown>)[s.key]);

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12">
        <GlowOrb className="w-[400px] h-[400px] bg-brand-500 top-0 right-10" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Portfolio', to: '/portfolio' }, { label: project.title }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-sm text-brand-400 mb-3">{project.category?.name ?? 'Design'}</div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white text-balance">{project.title}</h1>
            {project.excerpt && <p className="mt-4 text-lg text-gray-400 max-w-2xl">{project.excerpt}</p>}
            {project.timeline && (
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4 text-brand-400" /> Timeline: {project.timeline}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Hero image */}
      {project.cover_image_url && (
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[16/9] rounded-3xl overflow-hidden glass"
          >
            <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover" />
          </motion.div>
        </div>
      )}

      {/* Content */}
      <Section className="!pt-12">
        <div className="container-max section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {project.description && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-line">{project.description}</p>
                </div>
              )}

              {/* Legacy fields for backward compat */}
              {project.challenge && !project.problem && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">The Challenge</h2>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-line">{project.challenge}</p>
                </div>
              )}
              {project.process && !project.design_process && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">The Process</h2>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-line">{project.process}</p>
                </div>
              )}
              {project.solution && !project.results && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">The Solution</h2>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-line">{project.solution}</p>
                </div>
              )}

              {/* Full case study sections */}
              {hasCaseStudy && (
                <div className="space-y-8">
                  {CASE_STUDY_SECTIONS.map((s) => {
                    const content = (project as unknown as Record<string, unknown>)[s.key] as string | null;
                    if (!content) return null;
                    return (
                      <motion.div
                        key={s.key}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                            <s.icon className="w-4 h-4 text-brand-400" />
                          </div>
                          <h2 className="text-xl font-semibold text-white">{s.label}</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed whitespace-pre-line ml-10">{content}</p>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {project.ai_prompt_workflow && (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-5 h-5 text-accent-400" />
                    <h2 className="text-xl font-semibold text-white">AI Prompt Workflow</h2>
                  </div>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-line font-mono text-sm">{project.ai_prompt_workflow}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {project.tools.length > 0 && (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Wrench className="w-4 h-4 text-brand-400" />
                    <h3 className="font-semibold text-white">Tools Used</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((t) => (
                      <span key={t} className="badge">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {project.timeline && (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-brand-400" />
                    <h3 className="font-semibold text-white">Timeline</h3>
                  </div>
                  <p className="text-sm text-gray-400">{project.timeline}</p>
                </div>
              )}
              {project.deliverables && (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-brand-400" />
                    <h3 className="font-semibold text-white">Deliverables</h3>
                  </div>
                  <p className="text-sm text-gray-400 whitespace-pre-line">{project.deliverables}</p>
                </div>
              )}
              {project.case_study_pdf_url && (
                <a href={project.case_study_pdf_url} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                  <Download className="w-4 h-4" /> Download Case Study
                </a>
              )}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-white mb-2">Like this project?</h3>
                <p className="text-sm text-gray-400 mb-4">Let's create something similar for your brand.</p>
                <CtaButton to="/contact" className="w-full">Start a Project</CtaButton>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Gallery */}
      {media.length > 0 && (
        <Section className="!pt-0">
          <div className="container-max section-padding">
            <h2 className="text-2xl font-semibold text-white mb-6">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {media.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl overflow-hidden glass ${i === 0 ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'}`}
                >
                  {m.type === 'video' ? (
                    <video src={m.url} controls className="w-full h-full object-cover" />
                  ) : (
                    <img src={m.url} alt={`${project.title} ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <Section className="!pt-0">
          <div className="container-max section-padding">
            <h2 className="text-2xl font-semibold text-white mb-6">Related Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.id} to={`/portfolio/${p.slug}`} className="group block">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden glass">
                    {p.cover_image_url ? (
                      <img src={p.cover_image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full gradient-brand opacity-30 flex items-center justify-center">
                        <Palette className="w-10 h-10 text-white/50" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 text-white font-medium group-hover:text-brand-300 transition-colors">{p.title}</h3>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <CtaButton to="/contact" variant="outline">
                Work With Me <ArrowRight className="w-4 h-4" />
              </CtaButton>
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
