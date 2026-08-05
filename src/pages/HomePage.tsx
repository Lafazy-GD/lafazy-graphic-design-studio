import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Globe, Palette, Bot, Layout, PenTool, ArrowRight,
  Star, Quote, CheckCircle2, Briefcase, Rocket, Clock, Zap,
  MapPin, Calendar, FileText, ShieldCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSeo, setJsonLd } from '@/lib/seo';
import { Section, SectionHeading, CtaButton, GlowOrb, ArrowLink } from '@/components/ui';
import type { PortfolioProject, Testimonial } from '@/lib/types';

const SERVICES = [
  { icon: Palette, title: 'Brand Identity', desc: 'Logos, visual systems, and brand guidelines that make companies unforgettable.' },
  { icon: Layout, title: 'Digital Design', desc: 'Web and app UI design systems crafted for conversion and user delight.' },
  { icon: PenTool, title: 'Social Media Design', desc: 'Scroll-stopping creative that builds communities and drives measurable engagement.' },
  { icon: Bot, title: 'AI Prompt Engineering', desc: 'AI-powered creative workflows that scale output without losing craft or soul.' },
];

const PROCESS = [
  { step: '01', title: 'Discover', desc: 'Deep-dive into your brand, audience, and goals to define the creative direction.' },
  { step: '02', title: 'Design', desc: 'Crafting concepts, iterating with precision, and refining every pixel to perfection.' },
  { step: '03', title: 'Deliver', desc: 'Polished, production-ready assets with guidelines and ongoing creative support.' },
];

const STATS = [
  { value: '5+', label: 'Years Experience' },
  { value: '120+', label: 'Projects Delivered' },
  { value: '40+', label: 'Happy Clients' },
  { value: '15+', label: 'Countries Served' },
];

const QUICK_SUMMARY = [
  { icon: Briefcase, label: 'Experience', value: '5+ years' },
  { icon: Palette, label: 'Specialties', value: 'Branding, Visual Identity, AI Prompt Engineering' },
  { icon: Zap, label: 'Tools', value: 'Figma, Illustrator, Photoshop, After Effects, Midjourney' },
  { icon: CheckCircle2, label: 'Availability', value: 'Available now' },
  { icon: Clock, label: 'Timezone', value: 'GMT+1 (flexible overlap)' },
  { icon: FileText, label: 'Contract Type', value: 'Freelance, Contract, Full-time Remote' },
];

export function HomePage() {
  useSeo({
    title: 'Lafazy — Remote Graphic Designer & AI Prompt Engineer | Available Worldwide',
    description: 'Senior graphic designer and AI prompt engineer with 5+ years of experience in branding, visual identity, and AI-powered creative. Available for remote roles worldwide. Hire me for your next design project.',
    keywords: 'remote graphic designer, branding designer, visual identity designer, AI prompt engineer, creative studio, international freelance designer, remote creative professional',
    canonicalPath: '/',
  });

  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: projs }, { data: tests }] = await Promise.all([
        supabase.from('portfolio_projects').select('*, category:project_categories(*)').eq('status', 'published').eq('featured', true).order('sort_order').limit(6),
        supabase.from('testimonials').select('*').order('created_at', { ascending: false }).limit(3),
      ]);
      if (projs) setProjects(projs);
      if (tests) setTestimonials(tests);
    })();

    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Lafazy',
      jobTitle: 'Graphic Designer & AI Prompt Engineer',
      url: 'https://lafazystudio.com',
      knowsAbout: ['Graphic Design', 'Branding', 'AI Prompt Engineering', 'Visual Identity', 'Logo Design', 'Design Systems'],
      worksFor: {
        '@type': 'Organization',
        name: 'Lafazy Graphic Design Studio',
      },
      areaServed: 'Worldwide',
      sameAs: [
        'https://www.facebook.com/profile.php?id=61590833153269',
        'https://www.tiktok.com/@lafazy.one.boy',
        'https://wa.me/2347073692261',
      ],
    });
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 sm:pt-32 pb-24">
        <GlowOrb className="w-[500px] h-[500px] bg-brand-500 top-0 left-1/4" />
        <GlowOrb className="w-[400px] h-[400px] bg-accent-500 top-20 right-10" />
        <div className="absolute inset-0 bg-grid-faint [background-size:40px_40px] opacity-50" />

        <div className="container-max section-padding relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm text-gray-300">Currently Available for Remote Work Worldwide</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-balance">
              <span className="gradient-text">Graphic Designer</span>
              <br />
              <span className="text-white">& AI Prompt Engineer</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed">
              I'm <span className="text-white font-medium">Lafazy</span> — a branding specialist and visual identity
              expert with 5+ years of experience delivering premium creative work for clients across 15+ countries.
              I help brands stand out, scale their design output with AI, and ship work that drives real business results.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <CtaButton to="/hire-me">
                <Briefcase className="w-4 h-4" /> Hire Me
              </CtaButton>
              <CtaButton to="/portfolio" variant="outline">
                View Portfolio <ArrowRight className="w-4 h-4" />
              </CtaButton>
              <CtaButton to="/resume" variant="ghost">
                Download Resume
              </CtaButton>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-gray-400">
              {['Branding Specialist', 'Visual Identity Expert', 'AI Prompt Engineer', 'Remote-First'].map((t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Recruiter Quick Summary Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-16 glass-strong rounded-3xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Recruiter Quick Summary</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {QUICK_SUMMARY.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-brand-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</div>
                    <div className="text-sm text-white font-medium mt-0.5">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className="glass-card p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text">{s.value}</div>
                <div className="mt-2 text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Client logos placeholder */}
      <Section className="!py-12">
        <div className="container-max section-padding">
          <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-8">
            Trusted by brands & teams worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40">
            {['NEXUS', 'Lumina', 'Vertex', 'Quantum', 'Apex', 'Horizon'].map((name) => (
              <span key={name} className="font-display text-xl font-semibold text-white">{name}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section id="services">
        <div className="container-max section-padding">
          <SectionHeading
            eyebrow="What I Do"
            title="Creative services that elevate brands"
            subtitle="From brand identity to AI-powered design systems, I deliver work that's strategic, beautiful, and built to scale."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 group hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mb-5 shadow-glow group-hover:scale-110 transition-transform">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed">{s.desc}</p>
                <Link to="/services" className="mt-5 inline-block">
                  <ArrowLink to="/services">Learn more</ArrowLink>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Featured Work */}
      <Section id="featured">
        <div className="container-max section-padding">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">Featured Work</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white">Selected case studies</h2>
            </div>
            <ArrowLink to="/portfolio">View all</ArrowLink>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link to={`/portfolio/${p.slug}`} className="group block">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass">
                      {p.cover_image_url ? (
                        <img src={p.cover_image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full gradient-brand opacity-30 flex items-center justify-center">
                          <Palette className="w-12 h-12 text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-80" />
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-xs text-brand-400 mb-1">
                        {p.category?.name ?? 'Design'}
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-brand-300 transition-colors">
                        {p.title}
                      </h3>
                      {p.excerpt && <p className="text-sm text-gray-400 mt-1 line-clamp-2">{p.excerpt}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="aspect-[4/3] rounded-2xl glass-card flex items-center justify-center">
                  <Palette className="w-12 h-12 text-white/20" />
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Process */}
      <Section id="process" className="relative">
        <GlowOrb className="w-[400px] h-[400px] bg-brand-500 top-1/2 -left-20 opacity-20" />
        <div className="container-max section-padding relative">
          <SectionHeading
            eyebrow="How I Work"
            title="A process built for results"
            subtitle="A clear, collaborative workflow that turns your vision into polished, production-ready creative."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 relative overflow-hidden"
              >
                <span className="text-6xl font-bold text-white/5 absolute top-4 right-4 font-display">{p.step}</span>
                <h3 className="text-xl font-semibold text-white mb-2 relative">{p.title}</h3>
                <p className="text-gray-400 leading-relaxed relative">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <Section id="testimonials">
          <div className="container-max section-padding">
            <SectionHeading
              eyebrow="Testimonials"
              title="What clients say"
              subtitle="Real feedback from brands and teams I've partnered with."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Quote className="w-8 h-8 text-brand-400/50" />
                    {t.verified && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    {t.avatar_url && <img src={t.avatar_url} alt={t.author_name} loading="lazy" className="w-10 h-10 rounded-full object-cover" />}
                    <div>
                      <div className="text-sm font-medium text-white">{t.author_name}</div>
                      <div className="text-xs text-gray-400">{t.author_role}{t.company ? ` · ${t.company}` : ''}</div>
                      {t.project && <div className="text-xs text-brand-400 mt-0.5">{t.project}</div>}
                    </div>
                  </div>
                  <div className="flex gap-1 mt-4">
                    {Array.from({ length: t.rating }).map((_, n) => (
                      <Star key={n} className="w-4 h-4 fill-warning-400 text-warning-400" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Remote Work CTA */}
      <Section className="!py-16">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative glass-strong rounded-3xl p-10 sm:p-16 overflow-hidden"
          >
            <GlowOrb className="w-[400px] h-[400px] bg-brand-500 top-0 right-0" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                  <Globe className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300">Remote · Worldwide</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-white text-balance">
                  Let's build something remarkable together
                </h2>
                <p className="mt-4 text-gray-400 text-lg">
                  Available for freelance, contract, and full-time remote roles in graphic design,
                  branding, and AI prompt engineering. Let's talk about how I can help your team.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end">
                <CtaButton to="/hire-me" className="w-full sm:w-auto">
                  <Briefcase className="w-4 h-4" /> Hire Me
                </CtaButton>
                <CtaButton to="/contact" variant="ghost" className="w-full sm:w-auto">
                  Start a Project
                </CtaButton>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Hiring CTA */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <div className="glass-card p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shadow-glow shrink-0">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Looking to hire a designer?</h3>
                <p className="text-gray-400 text-sm mt-1">Download my resume or schedule a call today.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CtaButton to="/resume" variant="outline">Resume</CtaButton>
              <CtaButton to="/contact">Get in Touch</CtaButton>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
