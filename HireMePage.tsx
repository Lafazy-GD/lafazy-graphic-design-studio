import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Globe, Clock, MessageSquare, Check, ArrowRight, Calendar,
  Video, FileText, Zap, Users, Building2, Star, ChevronDown, ShieldCheck,
  Monitor, Mail, Slack, Figma,
} from 'lucide-react';
import { useSeo } from '@/lib/seo';
import { Section, SectionHeading, CtaButton, GlowOrb, Breadcrumbs } from '@/components/ui';

const AVAILABILITY = [
  { icon: Globe, label: 'Availability', value: 'Available now for remote work worldwide' },
  { icon: Clock, label: 'Timezone', value: 'GMT+1 (flexible overlap with US, EU, and APAC)' },
  { icon: Calendar, label: 'Start Date', value: 'Available to start within 1-2 weeks' },
  { icon: Briefcase, label: 'Contract Types', value: 'Freelance, Contract, Full-time Remote' },
];

const COMMUNICATION = [
  { icon: Slack, name: 'Slack', desc: 'Daily async updates and quick questions' },
  { icon: Video, name: 'Video Calls', desc: 'Weekly sync via Zoom, Google Meet, or Teams' },
  { icon: FileText, name: 'Notion', desc: 'Project documentation and design briefs' },
  { icon: Figma, name: 'Figma', desc: 'Real-time design collaboration and feedback' },
  { icon: Mail, name: 'Email', desc: 'Formal communication and project approvals' },
  { icon: MessageSquare, name: 'Loom', desc: 'Async video walkthroughs for feedback' },
];

const PROCESS = [
  { step: '01', title: 'Discovery & Alignment', desc: 'We start with a call to understand your goals, brand, and project scope. I share relevant case studies and we align on expectations.' },
  { step: '02', title: 'Proposal & Onboarding', desc: 'You receive a detailed proposal with deliverables, timeline, and pricing. Once approved, I set up shared workspaces in Figma and Slack.' },
  { step: '03', title: 'Design & Collaboration', desc: 'I work in Figma with real-time sharing. You get async updates via Slack and weekly sync calls. Feedback rounds are structured and clear.' },
  { step: '04', title: 'Delivery & Handoff', desc: 'Final files delivered via a shared Google Drive folder. Includes source files, exports, guidelines, and documentation for your team.' },
];

const CONTRACTS = [
  {
    icon: Zap, title: 'Freelance / Project-Based',
    desc: 'For one-off projects like brand identity, logo design, or social media campaigns.',
    details: ['Fixed scope and price', '50% deposit, 50% on delivery', '1-8 week timelines', 'Perfect for specific deliverables'],
  },
  {
    icon: Users, title: 'Contract / Part-Time',
    desc: 'For ongoing design support without the commitment of full-time hire.',
    details: ['Monthly retainer', '10-30 hours/week', 'Rolling monthly contract', 'Priority turnaround'],
  },
  {
    icon: Building2, title: 'Full-Time Remote',
    desc: 'For companies seeking a dedicated senior designer on their team.',
    details: ['Full-time commitment', 'Core overlap hours required', '3-month probation period', 'Direct team integration'],
  },
];

const FAQ = [
  {
    q: 'How do you handle remote collaboration across timezones?',
    a: 'I work GMT+1 with flexible overlap for US, EU, and APAC timezones. I use async-first communication (Slack, Loom, Notion) so you never have to wait for updates. We schedule weekly sync calls at a time that works for both of us. Most clients find the async workflow more efficient than in-office collaboration.',
  },
  {
    q: 'How are files delivered?',
    a: 'All final files are delivered via a shared Google Drive folder. You receive source files (Figma, AI, PSD), exported assets (PNG, SVG, PDF), brand guidelines (PDF), and documentation. Everything is organized and labeled for easy handoff to your team or other designers.',
  },
  {
    q: 'How many revision rounds are included?',
    a: 'Each project includes 2-3 rounds of revisions depending on the tier. Revisions are defined as changes to existing concepts, not new directions. Enterprise retainer clients get unlimited revisions within scope. I structure feedback rounds clearly so we stay efficient and on track.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'I accept bank transfers, Stripe (credit/debit cards), and Wise (for international clients). For project-based work, it\'s 50% deposit to start and 50% on delivery. For retainers, payment is due monthly in advance. Invoices are sent via email with clear line items.',
  },
  {
    q: 'Do you use AI in your design process?',
    a: 'Yes. I use AI tools (Midjourney, DALL-E, ChatGPT) to accelerate concept exploration and ideation. AI generates initial directions; I then refine and polish everything manually in Figma and Illustrator. The final work is always hand-crafted and brand-consistent. AI is a tool, not the deliverable.',
  },
  {
    q: 'Can you set up AI prompt workflows for our team?',
    a: 'Absolutely. I offer AI workflow consulting as a standalone service or as part of an Enterprise retainer. I\'ll audit your current process, build custom prompt templates, create documentation, and train your team. Two client teams now produce 4x more creative output using workflows I built.',
  },
  {
    q: 'What is your branding process?',
    a: 'My process has 4 stages: Discovery (research and competitive analysis), Strategy (positioning and creative direction), Design (concept exploration and refinement), and Delivery (guidelines and handoff). Each stage includes a review checkpoint. The full process takes 3-8 weeks depending on scope.',
  },
  {
    q: 'What are your typical turnaround times?',
    a: 'Logo design: 1-2 weeks. Full brand identity: 3-5 weeks. Social media campaign: 1-2 weeks. AI workflow setup: 2-4 weeks. Enterprise retainer clients get priority 48-hour turnaround for ad-hoc requests. Rush delivery is available for an additional fee.',
  },
];

function FaqItem({ item, index }: { item: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="glass-card overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm sm:text-base font-medium text-white pr-4">{item.q}</span>
        <ChevronDown className={`w-5 h-5 text-brand-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function HireMePage() {
  useSeo({
    title: 'Hire Me — Remote Graphic Designer & AI Prompt Engineer Available Worldwide',
    description: 'Available for freelance, contract, and full-time remote roles in graphic design, branding, and AI prompt engineering. GMT+1 timezone with flexible overlap. Book a consultation today.',
    keywords: 'remote graphic designer, branding designer, AI prompt engineer, hire creative professional, freelance designer, remote creative professional',
    canonicalPath: '/hire-me',
  });

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12">
        <GlowOrb className="w-[500px] h-[500px] bg-brand-500 top-0 left-1/4" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Hire Me' }]} />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm text-gray-300">Available for Remote Work Worldwide</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white text-balance leading-tight">
              Hire a <span className="gradient-text">senior creative</span> who delivers
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed">
              I'm Lafazy — a graphic designer and AI prompt engineer with 5+ years of experience
              helping brands across 15+ countries. Available for freelance, contract, and full-time
              remote roles. Let's talk about how I can help your team.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <CtaButton to="/checkout">
                <Calendar className="w-4 h-4" /> Start a Project
              </CtaButton>
              <CtaButton to="/contact" variant="outline">
                <FileText className="w-4 h-4" /> Book a Consultation
              </CtaButton>
              <CtaButton to="/resume" variant="outline">
                <FileText className="w-4 h-4" /> View Resume
              </CtaButton>
              <CtaButton to="/portfolio" variant="ghost">
                See Portfolio <ArrowRight className="w-4 h-4" />
              </CtaButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Availability Panel */}
      <Section className="!pt-4">
        <div className="container-max section-padding">
          <div className="glass-strong rounded-3xl p-6 sm:p-10">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Availability & Logistics</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {AVAILABILITY.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
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
          </div>
        </div>
      </Section>

      {/* Communication Tools */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <SectionHeading eyebrow="Communication" title="Tools I use to collaborate remotely" center />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {COMMUNICATION.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-3">
                  <c.icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Collaboration Process */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <SectionHeading eyebrow="Remote Collaboration" title="How we'll work together" center />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Contract Options */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <SectionHeading eyebrow="Contract Options" title="Ways to work with me" center />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONTRACTS.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-8"
              >
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mb-5 shadow-glow">
                  <c.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{c.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-5">{c.desc}</p>
                <ul className="space-y-2">
                  {c.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-brand-400" /> {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <SectionHeading
            eyebrow="FAQ"
            title="Recruiter & client FAQ"
            subtitle="Answers to the most common questions from recruiters, agencies, and clients."
          />
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ.map((item, i) => (
              <FaqItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <div className="glass-strong rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <GlowOrb className="w-[400px] h-[400px] bg-brand-500 top-0 left-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white text-balance">
                Let's discuss your next project
              </h2>
              <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
                Book a free 30-minute consultation. We'll discuss your needs, timeline, and how I can help.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <CtaButton to="/contact">
                  <Calendar className="w-4 h-4" /> Book a Consultation
                </CtaButton>
                <CtaButton to="/resume" variant="ghost">
                  <FileText className="w-4 h-4" /> Download Resume
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
