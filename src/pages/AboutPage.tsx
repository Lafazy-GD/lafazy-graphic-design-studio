import { motion } from 'framer-motion';
import { Sparkles, Globe, Bot, Palette, Award, Heart, ArrowRight } from 'lucide-react';
import { useSeo } from '@/lib/seo';
import { Section, SectionHeading, CtaButton, GlowOrb, Breadcrumbs } from '@/components/ui';

const SKILLS = [
  { name: 'Brand Identity', level: 95 },
  { name: 'Logo Design', level: 92 },
  { name: 'Visual Design', level: 90 },
  { name: 'AI Prompt Engineering', level: 88 },
  { name: 'Social Media Design', level: 93 },
  { name: 'Design Systems', level: 85 },
];

const VALUES = [
  { icon: Award, title: 'Craft First', desc: 'Every pixel matters. I obsess over the details that make work feel premium.' },
  { icon: Heart, title: 'Client Obsessed', desc: 'Your success is my success. I build partnerships, not just projects.' },
  { icon: Globe, title: 'Global Mindset', desc: 'I work across time zones and cultures, delivering for clients worldwide.' },
  { icon: Bot, title: 'AI Augmented', desc: 'I leverage AI to move faster and explore more, without losing the human touch.' },
];

export function AboutPage() {
  useSeo({
    title: 'About — Lafazy | Remote Graphic Designer & AI Prompt Engineer',
    description: 'Meet Lafazy, a senior graphic designer and AI prompt engineer with 5+ years of experience building premium creative work for brands across 15+ countries. Available for remote work worldwide.',
    keywords: 'remote graphic designer, AI prompt engineer, international freelance designer, creative professional, branding expert',
    canonicalPath: '/about',
  });

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-16">
        <GlowOrb className="w-[400px] h-[400px] bg-brand-500 top-0 right-10" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">About Me</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-balance">
              Designer, brand builder, and AI creative — <span className="gradient-text">available worldwide</span>
            </h1>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              I'm Lafazy, a graphic designer and AI prompt engineer with a passion for crafting
              brands that resonate. Over the past 5+ years I've helped startups, agencies, and
              global teams turn ideas into visual identities that command attention and build trust.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bio */}
      <Section className="!pt-8">
        <div className="container-max section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6 text-gray-400 leading-relaxed text-lg">
              <p>
                My work sits at the intersection of design craft and emerging technology. I believe
                great branding isn't just about looking good — it's about communicating clearly,
                building trust, and creating experiences people remember.
              </p>
              <p>
                As an AI prompt engineer, I help teams integrate generative tools into their creative
                workflows — speeding up exploration, generating variations, and unlocking new visual
                possibilities while keeping the human creative voice at the center.
              </p>
              <p>
                I'm open to remote graphic design, branding, visual design, and AI prompt engineering
                roles worldwide. Whether you need a logo, a full brand system, or a creative partner
                to scale your output, I'd love to help.
              </p>
              <div className="pt-4">
                <CtaButton to="/contact">
                  Work With Me <ArrowRight className="w-4 h-4" />
                </CtaButton>
              </div>
            </div>
            <div className="glass-card p-8 h-fit">
              <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center shadow-glow mb-5">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Lafazy</h3>
              <p className="text-sm text-gray-400 mt-1">Graphic Designer & AI Prompt Engineer</p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-300"><Globe className="w-4 h-4 text-brand-400" /> Remote · Worldwide</div>
                <div className="flex items-center gap-2 text-gray-300"><Palette className="w-4 h-4 text-brand-400" /> 5+ years experience</div>
                <div className="flex items-center gap-2 text-gray-300"><Award className="w-4 h-4 text-brand-400" /> 120+ projects delivered</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills">
        <div className="container-max section-padding">
          <SectionHeading eyebrow="Expertise" title="Skills & capabilities" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto">
            {SKILLS.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-white">{s.name}</span>
                  <span className="text-sm text-gray-400">{s.level}%</span>
                </div>
                <div className="h-2 rounded-full bg-ink-700 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.8 }}
                    className="h-full gradient-brand rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <SectionHeading eyebrow="What Drives Me" title="My values" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">{v.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
