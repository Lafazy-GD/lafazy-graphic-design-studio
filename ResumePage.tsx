import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, File, ArrowRight, CheckCircle2, Star, Zap, Globe, Bot, Briefcase, Award, Monitor, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSeo, setJsonLd } from '@/lib/seo';
import { Section, GlowOrb, CtaButton, Breadcrumbs } from '@/components/ui';
import { trackDownload } from '@/lib/analytics';
import type { DownloadableResource } from '@/lib/types';

const TYPE_ICONS: Record<string, typeof FileText> = {
  cv: FileText, resume: FileText, cover_letter: File, portfolio: File, brand: File, brochure: File,
};

const TYPE_LABELS: Record<string, string> = {
  cv: 'CV', resume: 'Resume', cover_letter: 'Cover Letter', portfolio: 'Portfolio PDF', brand: 'Brand Presentation', brochure: 'Service Brochure',
};

const SKILLS_MATRIX = [
  { category: 'Design', skills: [
    { name: 'Brand Identity', level: 95 },
    { name: 'Logo Design', level: 92 },
    { name: 'Visual Identity Systems', level: 90 },
    { name: 'Social Media Design', level: 93 },
    { name: 'Design Systems', level: 85 },
    { name: 'Typography', level: 88 },
  ]},
  { category: 'AI & Automation', skills: [
    { name: 'AI Prompt Engineering', level: 90 },
    { name: 'Midjourney / DALL-E', level: 88 },
    { name: 'AI Workflow Design', level: 87 },
    { name: 'Creative Automation', level: 82 },
  ]},
  { category: 'Remote Collaboration', skills: [
    { name: 'Async Communication', level: 95 },
    { name: 'Cross-timezone Work', level: 92 },
    { name: 'Figma Collaboration', level: 90 },
    { name: 'Project Management', level: 85 },
  ]},
];

const SOFTWARE = [
  { name: 'Figma', level: 95 },
  { name: 'Adobe Illustrator', level: 93 },
  { name: 'Adobe Photoshop', level: 90 },
  { name: 'Adobe After Effects', level: 80 },
  { name: 'Adobe InDesign', level: 78 },
  { name: 'Midjourney', level: 88 },
  { name: 'ChatGPT / Claude', level: 90 },
  { name: 'Notion', level: 85 },
  { name: 'Slack / Teams', level: 92 },
  { name: 'Loom / Async', level: 90 },
];

const ACHIEVEMENTS = [
  { icon: Award, title: '120+ Projects Delivered', desc: 'Across branding, digital design, and social media for clients in 15+ countries.' },
  { icon: Globe, title: 'Global Client Base', desc: 'Worked with startups, agencies, and enterprises across North America, Europe, Africa, and Asia.' },
  { icon: Bot, title: 'AI-First Creative', desc: 'Pioneered AI-augmented design workflows that cut production time by 40% while improving quality.' },
  { icon: Briefcase, title: '5+ Years Remote', desc: 'Built a fully remote creative practice with a 98% client satisfaction rate.' },
];

const EXPERIENCE = [
  { role: 'Graphic Designer & AI Prompt Engineer', org: 'Lafazy Graphic Design Studio', period: '2020 — Present', desc: 'Founded and run a premium international creative studio. Delivered 120+ branding, visual identity, and digital design projects. Built AI-powered creative workflows for clients worldwide.' },
  { role: 'Freelance Graphic Designer', org: 'Independent', period: '2019 — 2020', desc: 'Worked with startups and small businesses on logo design, brand identity, and social media creative. Built a reputation for fast, high-quality delivery.' },
];

const AI_EXPERIENCE = [
  'Designed structured prompt frameworks for consistent brand visual output across campaigns',
  'Built AI-augmented design pipelines that reduced concept-to-delivery time by 40%',
  'Integrated generative AI tools (Midjourney, DALL-E, Stable Diffusion) into production workflows',
  'Created AI art direction systems for marketing teams to scale creative without losing brand consistency',
  'Trained teams on prompt engineering best practices for design use cases',
];

export function ResumePage() {
  useSeo({
    title: 'Resume & CV — Lafazy | Remote Graphic Designer & AI Prompt Engineer',
    description: 'Download resume, CV, cover letters, and portfolio PDF. 5+ years experience in branding, visual identity, and AI prompt engineering. ATS-friendly format. Available for remote work worldwide.',
    keywords: 'graphic designer resume, AI prompt engineer CV, remote designer resume, downloadable portfolio, cover letter template',
    canonicalPath: '/resume',
  });

  const [resources, setResources] = useState<DownloadableResource[]>([]);

  useEffect(() => {
    supabase.from('downloadable_resources').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setResources(data);
    });

    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Lafazy',
      jobTitle: 'Graphic Designer & AI Prompt Engineer',
      url: 'https://lafazystudio.com/resume',
      knowsAbout: ['Graphic Design', 'Branding', 'AI Prompt Engineering', 'Visual Identity', 'Logo Design'],
      worksFor: { '@type': 'Organization', name: 'Lafazy Graphic Design Studio' },
      areaServed: 'Worldwide',
    });
  }, []);

  const handleDownload = async (r: DownloadableResource) => {
    await supabase.from('downloadable_resources').update({ download_count: r.download_count + 1 }).eq('id', r.id);
    trackDownload(r.title);
    window.open(r.file_url, '_blank');
  };

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-8">
        <GlowOrb className="w-[400px] h-[400px] bg-brand-500 top-0 right-10" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Resume & CV' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">Resume & CV</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-balance">Lafazy — Graphic Designer & AI Prompt Engineer</h1>
            <p className="mt-6 text-lg text-gray-400">5+ years of experience in branding, visual identity, and AI-powered creative. Available for remote roles worldwide. Download my resume, CV, and portfolio below.</p>
          </motion.div>
        </div>
      </section>

      {/* Achievements */}
      <Section className="!pt-8">
        <div className="container-max section-padding">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div key={a.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="glass-card p-6">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                  <a.icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">{a.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Experience */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <h2 className="text-2xl font-semibold text-white mb-8">Professional Experience</h2>
          <div className="space-y-6">
            {EXPERIENCE.map((e, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-card p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <h3 className="text-lg font-semibold text-white">{e.role}</h3>
                  <span className="text-sm text-brand-400">{e.period}</span>
                </div>
                <div className="text-sm text-gray-400 mb-3">{e.org}</div>
                <p className="text-gray-400 leading-relaxed">{e.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Skills Matrix */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <h2 className="text-2xl font-semibold text-white mb-8">Skills Matrix</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SKILLS_MATRIX.map((cat, i) => (
              <motion.div key={cat.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-card p-6">
                <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-4">{cat.category}</h3>
                <div className="space-y-3">
                  {cat.skills.map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm text-white">{s.name}</span>
                        <span className="text-xs text-gray-500">{s.level}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-ink-700 overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-full gradient-brand rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Software Proficiency */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <h2 className="text-2xl font-semibold text-white mb-8">Software Proficiency</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SOFTWARE.map((s, i) => (
              <motion.div key={s.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="glass-card p-4 text-center">
                <div className="text-2xl font-bold gradient-text">{s.level}%</div>
                <div className="text-sm text-gray-400 mt-1">{s.name}</div>
                <div className="flex justify-center gap-0.5 mt-2">
                  {Array.from({ length: 5 }).map((_, n) => (
                    <div key={n} className={`w-1.5 h-1.5 rounded-full ${n < Math.round(s.level / 20) ? 'bg-brand-400' : 'bg-ink-600'}`} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* AI Prompt Engineering Experience */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <div className="glass-card p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-accent-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">AI Prompt Engineering Experience</h2>
            </div>
            <div className="space-y-3">
              {AI_EXPERIENCE.map((exp, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                  <p className="text-gray-300 leading-relaxed">{exp}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Download Center */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <h2 className="text-2xl font-semibold text-white mb-8">Download Center</h2>
          {resources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((r, i) => {
                const Icon = TYPE_ICONS[r.type] ?? File;
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="glass-card p-6 group hover:border-white/20 transition-all hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mb-4 shadow-glow">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{r.title}</h3>
                    {r.description && <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">{r.description}</p>}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{r.download_count} downloads</span>
                      <button onClick={() => handleDownload(r)} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors">
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(TYPE_LABELS).map(([type, label]) => (
                <div key={type} className="glass-card p-6 opacity-60">
                  <div className="w-12 h-12 rounded-xl bg-ink-700 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{label}</h3>
                  <p className="text-sm text-gray-500 mt-1.5">Coming soon</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="container-max section-padding">
          <div className="glass-card p-8 sm:p-12 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Want the full picture?</h3>
            <p className="text-gray-400 mb-6">Check out my portfolio or reach out directly.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <CtaButton to="/portfolio">View Portfolio <ArrowRight className="w-4 h-4" /></CtaButton>
              <CtaButton to="/contact" variant="ghost"><Mail className="w-4 h-4" /> Contact Me</CtaButton>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
