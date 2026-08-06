import { motion } from 'framer-motion';
import { Bot, Sparkles, Zap, Code2, Workflow, ArrowRight, Check, Layers, Cpu, Rocket, Monitor, Clock, DollarSign, Lightbulb } from 'lucide-react';
import { useSeo, setJsonLd } from '@/lib/seo';
import { Section, SectionHeading, GlowOrb, CtaButton, Breadcrumbs } from '@/components/ui';

const CAPABILITIES = [
  { icon: Sparkles, title: 'Prompt Systems', desc: 'Structured prompt frameworks that produce consistent, on-brand visual output across every campaign and channel.' },
  { icon: Workflow, title: 'Creative Workflows', desc: 'AI-augmented design pipelines that scale creative production without losing quality or brand consistency.' },
  { icon: Zap, title: 'Rapid Ideation', desc: 'Generate dozens of concept directions in minutes, then refine the best ones into production-ready work.' },
  { icon: Code2, title: 'API Integration', desc: 'Connect generative AI tools to your design systems and production tools for seamless automation.' },
];

const WORKFLOW_STEPS = [
  { step: '01', icon: Lightbulb, title: 'Discovery & Strategy', desc: 'Understand your brand voice, visual language, and creative goals to design the right AI workflow.' },
  { step: '02', icon: Cpu, title: 'Prompt Architecture', desc: 'Build structured prompt templates with guardrails that ensure consistent, on-brand output.' },
  { step: '03', icon: Layers, title: 'Pipeline Design', desc: 'Connect AI generation tools to your design tools and production systems for end-to-end automation.' },
  { step: '04', icon: Rocket, title: 'Scale & Iterate', desc: 'Deploy, measure, and refine the workflow to continuously improve output quality and speed.' },
];

const USE_CASES = [
  'Brand identity exploration at scale', 'Social media creative generation', 'Product visual variations',
  'Marketing asset localization', 'Design system component generation', 'AI art direction for campaigns',
  'Rapid prototyping and concept testing', 'Content personalization at scale',
];

const CONSULTING = [
  { icon: Clock, title: '1-Hour Strategy Call', desc: 'A focused session to assess your creative workflow and identify AI opportunities.', price: 'From $150' },
  { icon: Layers, title: 'Workflow Audit & Setup', desc: 'Full audit of your design pipeline plus a custom AI workflow built for your team.', price: 'From $800' },
  { icon: Rocket, title: 'Ongoing AI Partnership', desc: 'Monthly retainer for continuous AI workflow optimization and creative support.', price: 'From $1,500/mo' },
];

export function AiPromptPage() {
  useSeo({
    title: 'AI Prompt Engineering Services — Creative Workflows & Consulting',
    description: 'Professional AI prompt engineering services for branding, design systems, and creative automation. Prompt architecture, workflow design, and consulting for teams scaling creative output.',
    keywords: 'AI prompt engineer, AI prompt engineering services, creative AI workflows, AI design automation, prompt architecture',
    canonicalPath: '/ai-prompt-engineering',
  });

  setJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'AI Prompt Engineering',
    provider: { '@type': 'Person', name: 'Lafazy' },
    areaServed: 'Worldwide',
    description: 'AI prompt engineering services for branding, design systems, and creative workflows at scale.',
  });

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-16">
        <GlowOrb className="w-[500px] h-[500px] bg-accent-500 top-0 left-1/4" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'AI Prompt Engineering' }]} />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Bot className="w-4 h-4 text-accent-400" />
              <span className="text-sm text-gray-300">AI Prompt Engineering</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white text-balance leading-tight">
              <span className="gradient-text">AI-powered</span> creative at scale
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl">
              I help brands and teams integrate AI into their creative workflows — building prompt systems,
              automation pipelines, and AI-augmented design processes that scale output without losing the human touch.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <CtaButton to="/contact">Book a Consultation <ArrowRight className="w-4 h-4" /></CtaButton>
              <CtaButton to="/portfolio" variant="outline">See Examples</CtaButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities */}
      <Section className="!pt-8">
        <div className="container-max section-padding">
          <SectionHeading eyebrow="Capabilities" title="What I can do with AI" center />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CAPABILITIES.map((c, i) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-card p-8 group hover:border-white/20 transition-all">
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mb-5 shadow-glow">
                  <c.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{c.title}</h3>
                <p className="text-gray-400 leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Workflow */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <SectionHeading eyebrow="The Workflow" title="How I build AI creative systems" center />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-card p-6 relative overflow-hidden">
                <span className="text-5xl font-bold text-white/5 absolute top-3 right-3 font-display">{s.step}</span>
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4 relative">
                  <s.icon className="w-5 h-5 text-accent-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5 relative">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed relative">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Use Cases */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <div className="glass-card p-8 sm:p-12">
            <h3 className="text-xl font-semibold text-white mb-6">Use cases</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {USE_CASES.map((u) => (
                <div key={u} className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-accent-400 shrink-0" /> {u}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Consulting Offer */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <SectionHeading eyebrow="Consulting" title="Ways to work with me" center />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONSULTING.map((c, i) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-card p-8">
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mb-5 shadow-glow">
                  <c.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{c.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-4">{c.desc}</p>
                <div className="text-2xl font-bold gradient-text">{c.price}</div>
                <CtaButton to="/contact" variant="ghost" className="mt-6 w-full">Get Started</CtaButton>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="container-max section-padding">
          <div className="glass-strong rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <GlowOrb className="w-[400px] h-[400px] bg-accent-500 top-0 left-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white text-balance">Scale your creative with AI</h2>
              <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">Let's build an AI-powered creative workflow tailored to your brand. Book a consultation today.</p>
              <div className="mt-8">
                <CtaButton to="/contact">Book a Consultation <ArrowRight className="w-4 h-4" /></CtaButton>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
