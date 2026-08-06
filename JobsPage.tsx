import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Search, Briefcase, Globe } from 'lucide-react';
import { useSeo } from '@/lib/seo';
import { Section, GlowOrb, Breadcrumbs } from '@/components/ui';

const JOB_SITES = [
  { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', category: 'General', desc: 'The largest professional network with remote design roles.' },
  { name: 'Indeed', url: 'https://www.indeed.com', category: 'General', desc: 'Massive job board with global remote listings.' },
  { name: 'Remote.co', url: 'https://remote.co/remote-jobs', category: 'Remote', desc: 'Curated remote-only positions across industries.' },
  { name: 'We Work Remotely', url: 'https://weworkremotely.com', category: 'Remote', desc: 'The largest remote work community with design roles.' },
  { name: 'FlexJobs', url: 'https://www.flexjobs.com', category: 'Remote', desc: 'Hand-screened remote and flexible jobs.' },
  { name: 'RemoteOK', url: 'https://remoteok.com', category: 'Remote', desc: 'Remote jobs from companies worldwide.' },
  { name: 'Working Nomads', url: 'https://www.workingnomads.com', category: 'Remote', desc: 'Remote jobs for digital nomads.' },
  { name: 'Wellfound', url: 'https://wellfound.com', category: 'Startup', desc: 'Startup jobs, including remote design roles.' },
  { name: 'Arc', url: 'https://arc.dev', category: 'Startup', desc: 'Remote developer and creative roles.' },
  { name: 'Behance Jobs', url: 'https://www.behance.net/joblist', category: 'Design', desc: 'Design-focused job board from Adobe.' },
  { name: 'Dribbble Jobs', url: 'https://dribbble.com/jobs', category: 'Design', desc: 'Premium design job listings.' },
  { name: 'Upwork', url: 'https://www.upwork.com', category: 'Freelance', desc: 'Freelance marketplace with global clients.' },
  { name: 'Fiverr', url: 'https://www.fiverr.com', category: 'Freelance', desc: 'Freelance services marketplace.' },
  { name: 'Freelancer', url: 'https://www.freelancer.com', category: 'Freelance', desc: 'Global freelance projects marketplace.' },
  { name: 'Toptal', url: 'https://www.toptal.com', category: 'Freelance', desc: 'Exclusive network of top freelancers.' },
  { name: 'Contra', url: 'https://contra.com', category: 'Freelance', desc: 'Commission-free freelance platform.' },
];

const CATEGORIES = ['All', 'General', 'Remote', 'Startup', 'Design', 'Freelance'];

export function JobsPage() {
  useSeo({ title: 'Remote Jobs Hub', description: 'A curated hub of remote graphic design, branding, and AI prompt engineering job platforms.', canonicalPath: '/jobs' });

  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = JOB_SITES.filter((j) => {
    const matchCat = active === 'All' || j.category === active;
    const matchQuery = !query || j.name.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-8">
        <GlowOrb className="w-[400px] h-[400px] bg-accent-500 top-0 left-10" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Remote Jobs' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">Remote Jobs Hub</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-balance">Find your next remote creative role</h1>
            <p className="mt-6 text-lg text-gray-400">A curated collection of the best platforms for remote graphic design, branding, and AI prompt engineering jobs worldwide.</p>
          </motion.div>
        </div>
      </section>

      <Section className="!pt-8">
        <div className="container-max section-padding">
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search platforms..." className="input-field pl-11" />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setActive(c)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${active === c ? 'gradient-brand text-white' : 'glass text-gray-300'}`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((j, i) => (
              <motion.a
                key={j.name}
                href={j.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="glass-card p-6 group hover:border-white/20 transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-brand-400" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-brand-300 transition-colors">{j.name}</h3>
                <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">{j.desc}</p>
                <span className="badge mt-4"><Globe className="w-3 h-3" /> {j.category}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
