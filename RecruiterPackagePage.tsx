import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download, FileText, File, ArrowRight, CheckCircle2, Globe,
  Clock, Mail, MessageSquare, Briefcase, Calendar, MapPin,
  FileCheck, Users, Video, Send,
} from 'lucide-react';
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

const HIGHLIGHTS = [
  { icon: Briefcase, label: '5+ Years Experience', desc: 'Branding, visual identity, and digital design' },
  { icon: Globe, label: 'Remote Worldwide', desc: 'Worked with clients across 15+ countries' },
  { icon: Clock, label: 'Timezone: GMT+1 (WAT)', desc: 'Overlap-friendly with US, EU, and Africa' },
  { icon: Users, label: '120+ Projects Delivered', desc: 'Startups, agencies, and enterprises' },
];

const PROCESS_STEPS = [
  { icon: MessageSquare, title: '1. Initial Call', desc: '30-min video call to discuss the role, team, and expectations. I adapt to your preferred platform: Zoom, Google Meet, or Teams.' },
  { icon: FileCheck, title: '2. Portfolio Review', desc: 'I share targeted case studies relevant to your industry. You receive a curated portfolio PDF and resume within 24 hours.' },
  { icon: Video, title: '3. Technical Assessment', desc: 'Live design challenge or take-home assignment. I deliver within your timeline and present my process clearly.' },
  { icon: Calendar, title: '4. Onboarding', desc: 'Once hired, I integrate into your workflow within one week. Figma, Slack, Notion, Linear — whatever your team uses.' },
];

const CONTACT_METHODS = [
  { icon: Mail, label: 'Email', value: 'hello@lafazystudio.com', href: 'mailto:hello@lafazystudio.com' },
  { icon: MessageSquare, label: 'WhatsApp', value: '+234 707 369 2261', href: 'https://wa.me/2347073692261' },
  { icon: Globe, label: 'Website', value: 'lafazystudio.com', href: 'https://lafazystudio.com' },
];

export function RecruiterPackagePage() {
  useSeo({
    title: 'Recruiter Package — Resume, Portfolio & Cover Letter | Lafazy Studio',
    description: 'Everything recruiters need: downloadable resume, portfolio PDF, cover letter, services overview, availability, timezone, and remote collaboration process. Hire a remote graphic designer and AI prompt engineer.',
    keywords: 'recruiter package, hire graphic designer, remote designer resume, portfolio download, cover letter, hiring creative professional, remote design jobs',
    canonicalPath: '/recruiter-package',
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
      url: 'https://lafazystudio.com/recruiter-package',
      knowsAbout: ['Graphic Design', 'Branding', 'AI Prompt Engineering', 'Visual Identity', 'Logo Design'],
      worksFor: { '@type': 'Organization', name: 'Lafazy Graphic Design Studio' },
      areaServed: 'Worldwide',
      availableLanguage: ['English'],
    });
  }, []);

  const handleDownload = async (r: DownloadableResource) => {
    await supabase.from('downloadable_resources').update({ download_count: r.download_count + 1 }).eq('id', r.id);
    trackDownload(r.title);
    window.open(r.file_url, '_blank');
  };

  const recruiterResources = resources.filter((r) =>
    ['resume', 'cv', 'cover_letter', 'portfolio', 'brochure', 'brand'].includes(r.type)
  );

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12">
        <GlowOrb className="w-[500px] h-[500px] bg-brand-500 top-0 left-10" />
        <GlowOrb className="w-[300px] h-[300px] bg-accent-500 top-20 right-10" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Recruiter Package' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">For Recruiters & Hiring Managers</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-balance">
              The complete <span className="gradient-text">recruiter package</span>
            </h1>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              Everything you need to evaluate me as a candidate — resume, portfolio, cover letter,
              services overview, and my remote collaboration process. Download what you need, or reach out directly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <Section className="!pt-4">
        <div className="container-max section-padding">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HIGHLIGHTS.map((h, i) => (
              <motion.div key={h.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="glass-card p-6">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                  <h.icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{h.label}</h3>
                <p className="text-sm text-gray-400">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Download Center */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2">Download Center</h2>
          <p className="text-gray-400 mb-8">All documents are ATS-friendly and available for immediate download.</p>
          {recruiterResources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recruiterResources.map((r, i) => {
                const Icon = TYPE_ICONS[r.type] ?? File;
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="glass-card p-6 group hover:border-white/20 transition-all hover:-translate-y-1">
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
                  <p className="text-sm text-gray-500 mt-1.5">Available upon request</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Availability & Timezone */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <div className="glass-card p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-brand-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Availability</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    <p className="text-gray-300">Available for full-time remote roles</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    <p className="text-gray-300">Available for contract & freelance projects</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    <p className="text-gray-300">Open to hybrid arrangements (Nigeria / West Africa)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    <p className="text-gray-300">Can start within 1-2 weeks of offer</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Timezone & Location</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-brand-400 shrink-0" />
                    <p className="text-gray-300">Based in Nigeria — GMT+1 (West Africa Time)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-brand-400 shrink-0" />
                    <p className="text-gray-300">4-5 hour overlap with US Eastern Time</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-brand-400 shrink-0" />
                    <p className="text-gray-300">Same working hours as UK & Central Europe</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    <p className="text-gray-300">Comfortable with async-first workflows</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Remote Collaboration Process */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2">Remote Collaboration Process</h2>
          <p className="text-gray-400 mb-8">How I work with distributed teams from first call to onboarding.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROCESS_STEPS.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shrink-0">
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{s.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contact Methods */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-8">Get in Touch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CONTACT_METHODS.map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="glass-card p-6 block hover:border-brand-500/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4 group-hover:gradient-brand transition-all">
                    <c.icon className="w-5 h-5 text-brand-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{c.label}</h3>
                  <p className="text-sm text-gray-400 mt-1">{c.value}</p>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="!pt-0">
        <div className="container-max section-padding">
          <div className="glass-card p-8 sm:p-12 text-center">
            <h3 className="text-2xl font-semibold text-white mb-2">Ready to hire?</h3>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              Let's discuss how I can bring value to your team. Book a call or send me a message — I respond within 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <CtaButton to="/contact">
                <Send className="w-4 h-4" /> Book a Call
              </CtaButton>
              <CtaButton to="/recruiters" variant="outline">
                <MessageSquare className="w-4 h-4" /> Leave a Message
              </CtaButton>
              <CtaButton to="/resume" variant="ghost">
                View Full Resume <ArrowRight className="w-4 h-4" />
              </CtaButton>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
