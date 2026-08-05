import { motion } from 'framer-motion';
import { Palette, Layout, PenTool, Bot, Layers, Sparkles, ArrowRight, Check, Rocket, Building2, Star, Crown } from 'lucide-react';
import { useSeo } from '@/lib/seo';
import { Section, SectionHeading, CtaButton, GlowOrb, Breadcrumbs } from '@/components/ui';

const SERVICES = [
  {
    icon: Palette, title: 'Brand Identity Design',
    desc: 'Complete brand identity systems including logo design, color palettes, typography, and brand guidelines.',
    items: ['Logo design', 'Brand guidelines', 'Color systems', 'Typography'],
  },
  {
    icon: Layout, title: 'Digital Design Systems',
    desc: 'Scalable UI design systems for web and mobile apps, built for consistency and speed.',
    items: ['UI/UX design', 'Design systems', 'Component libraries', 'Prototyping'],
  },
  {
    icon: PenTool, title: 'Social Media Design',
    desc: 'Engaging social media creative that builds communities and drives engagement.',
    items: ['Post templates', 'Story designs', 'Ad creatives', 'Content systems'],
  },
  {
    icon: Bot, title: 'AI Prompt Engineering',
    desc: 'AI-powered creative workflows and prompt systems that scale your visual output.',
    items: ['Prompt systems', 'Workflow automation', 'AI art direction', 'Creative scaling'],
  },
  {
    icon: Layers, title: 'Visual Identity',
    desc: 'Comprehensive visual identity packages that make your brand instantly recognizable.',
    items: ['Brand collateral', 'Marketing materials', 'Packaging', 'Signage'],
  },
  {
    icon: Sparkles, title: 'Creative Direction',
    desc: 'End-to-end creative direction for campaigns, launches, and brand refreshes.',
    items: ['Art direction', 'Campaign design', 'Creative strategy', 'Brand consulting'],
  },
];

const TIERS = [
  {
    icon: Rocket, name: 'Starter', tagline: 'For early-stage brands needing a professional foundation',
    price: '$500 — $1,500', timeline: '1 — 2 weeks',
    features: ['Logo design (2 concepts)', 'Color palette', 'Typography selection', 'Business card design', 'Social media profile kit', '2 rounds of revisions'],
    highlight: false,
  },
  {
    icon: Star, name: 'Professional', tagline: 'For growing brands that need a complete identity system',
    price: '$1,500 — $5,000', timeline: '2 — 4 weeks',
    features: ['Everything in Starter', 'Full brand guidelines (15+ pages)', 'Logo system (primary, secondary, icon)', 'Social media template set (8)', 'Brand collateral (letterhead, envelope)', 'Presentation template', '3 rounds of revisions'],
    highlight: true,
  },
  {
    icon: Building2, name: 'Studio', tagline: 'For established brands seeking a premium creative partnership',
    price: '$5,000 — $15,000', timeline: '4 — 8 weeks',
    features: ['Everything in Professional', 'Complete brand strategy', 'Full brand guidelines (30+ pages)', 'Packaging design system', 'Signage and environmental design', 'Website design system', 'AI prompt workflow setup', 'Unlimited revisions (within scope)'],
    highlight: false,
  },
  {
    icon: Crown, name: 'Enterprise', tagline: 'For global brands needing ongoing creative support',
    price: 'Custom pricing', timeline: 'Ongoing retainer',
    features: ['Everything in Studio', 'Dedicated creative direction', 'Monthly design support', 'AI workflow integration for your team', 'Team training and onboarding', 'Priority turnaround (48h)', 'Quarterly brand audit', 'Dedicated Slack channel'],
    highlight: false,
  },
];

const PROCESS = [
  { step: '01', title: 'Discovery Call', desc: 'We discuss your brand, goals, timeline, and budget to define the scope.' },
  { step: '02', title: 'Proposal & Contract', desc: 'You receive a detailed proposal with deliverables, timeline, and pricing.' },
  { step: '03', title: 'Creative Work', desc: 'I design, iterate, and refine based on your feedback at each stage.' },
  { step: '04', title: 'Delivery & Handoff', desc: 'You receive all final files, guidelines, and documentation via a shared drive.' },
];

export function ServicesPage() {
  useSeo({
    title: 'Services — Branding, Design & AI Prompt Engineering | International Creative Studio',
    description: 'Brand identity, logo design, digital design systems, social media creative, and AI prompt engineering services. Four pricing tiers from Starter to Enterprise. Available for remote work worldwide.',
    keywords: 'branding designer, visual identity designer, AI prompt engineer, creative studio, international freelance designer, remote creative professional',
    canonicalPath: '/services',
  });

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12">
        <GlowOrb className="w-[400px] h-[400px] bg-accent-500 top-0 left-10" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Services' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">Services & Pricing</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-balance">
              Creative services for <span className="gradient-text">ambitious brands</span>
            </h1>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              From brand identity to AI-powered design systems, I offer a full range of creative
              services tailored to help your brand stand out and scale globally. Transparent pricing,
              clear deliverables, and production-ready work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services grid */}
      <Section className="!pt-4">
        <div className="container-max section-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-8 group hover:border-white/20 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mb-5 shadow-glow">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-5">{s.desc}</p>
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-brand-400" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Pricing Tiers */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <SectionHeading
            eyebrow="Pricing"
            title="Transparent pricing for every stage"
            subtitle="Choose the tier that fits your brand. All projects include a discovery call, clear deliverables, and production-ready files."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`glass-card p-6 relative ${t.highlight ? 'border-brand-500/40 ring-1 ring-brand-500/20' : ''}`}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-brand text-white text-xs font-medium">
                    Most Popular
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${t.highlight ? 'gradient-brand' : 'bg-brand-500/10'}`}>
                  <t.icon className={`w-5 h-5 ${t.highlight ? 'text-white' : 'text-brand-400'}`} />
                </div>
                <h3 className="text-lg font-semibold text-white">{t.name}</h3>
                <p className="text-xs text-gray-400 mt-1 mb-3 leading-relaxed">{t.tagline}</p>
                <div className="text-2xl font-bold gradient-text mb-1">{t.price}</div>
                <div className="text-xs text-gray-500 mb-4">{t.timeline}</div>
                <ul className="space-y-2 mb-6">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <CtaButton to="/contact" variant={t.highlight ? 'primary' : 'ghost'} className="w-full">
                  Get Started
                </CtaButton>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            All prices are in USD. Payment via bank transfer, Stripe, or Wise. 50% deposit to start, 50% on delivery.
          </p>
        </div>
      </Section>

      {/* Process */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <SectionHeading eyebrow="How It Works" title="A simple, proven process" center />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 relative overflow-hidden"
              >
                <span className="text-5xl font-bold text-white/5 absolute top-3 right-3 font-display">{p.step}</span>
                <h3 className="text-base font-semibold text-white mb-1.5 relative">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed relative">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="container-max section-padding">
          <div className="glass-strong rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <GlowOrb className="w-[400px] h-[400px] bg-brand-500 top-0 left-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white text-balance">Ready to elevate your brand?</h2>
              <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">Let's discuss your project and find the right tier for your goals.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <CtaButton to="/hire-me">Hire Me <ArrowRight className="w-4 h-4" /></CtaButton>
                <CtaButton to="/contact" variant="ghost">Get a Quote</CtaButton>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
