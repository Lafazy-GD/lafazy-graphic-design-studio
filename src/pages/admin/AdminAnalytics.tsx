import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Download, Mail, Briefcase, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Analytics {
  totalDownloads: number;
  contactMessages: number;
  visitorMessages: number;
  jobs: number;
  jobsByStatus: Record<string, number>;
  topResources: { title: string; count: number }[];
  messagesByService: Record<string, number>;
}

export function AdminAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    (async () => {
      const [dl, cm, vm, jobs] = await Promise.all([
        supabase.from('downloadable_resources').select('*'),
        supabase.from('contact_messages').select('service'),
        supabase.from('visitor_messages').select('*', { count: 'exact', head: true }),
        supabase.from('job_applications').select('status'),
      ]);

      const totalDownloads = (dl.data ?? []).reduce((s, r) => s + (r.download_count ?? 0), 0);
      const topResources = (dl.data ?? []).map((r) => ({ title: r.title, count: r.download_count ?? 0 })).sort((a, b) => b.count - a.count).slice(0, 5);
      const messagesByService: Record<string, number> = {};
      (cm.data ?? []).forEach((m) => { if (m.service) messagesByService[m.service] = (messagesByService[m.service] ?? 0) + 1; });
      const jobsByStatus: Record<string, number> = {};
      (jobs.data ?? []).forEach((j) => { jobsByStatus[j.status] = (jobsByStatus[j.status] ?? 0) + 1; });

      setData({
        totalDownloads,
        contactMessages: cm.data?.length ?? 0,
        visitorMessages: vm.count ?? 0,
        jobs: jobs.data?.length ?? 0,
        jobsByStatus,
        topResources,
        messagesByService,
      });
    })();
  }, []);

  if (!data) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  const cards = [
    { label: 'Total Downloads', value: data.totalDownloads, icon: Download, color: 'from-brand-500 to-brand-600' },
    { label: 'Contact Messages', value: data.contactMessages, icon: Mail, color: 'from-accent-500 to-accent-600' },
    { label: 'Visitor Messages', value: data.visitorMessages, icon: Eye, color: 'from-green-500 to-green-600' },
    { label: 'Job Applications', value: data.jobs, icon: Briefcase, color: 'from-warning-500 to-warning-600' },
  ];

  const maxJob = Math.max(...Object.values(data.jobsByStatus), 1);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 mt-1">Track engagement across your studio platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4`}><c.icon className="w-5 h-5 text-white" /></div>
            <div className="text-3xl font-bold text-white">{c.value}</div>
            <div className="text-sm text-gray-400 mt-1">{c.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job applications by status */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Briefcase className="w-4 h-4 text-brand-400" /> Applications by Status</h3>
          <div className="space-y-3">
            {Object.entries(data.jobsByStatus).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-300 capitalize">{status}</span><span className="text-gray-400">{count}</span></div>
                <div className="h-2 rounded-full bg-ink-700 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(count / maxJob) * 100}%` }} transition={{ duration: 0.6 }} className="h-full gradient-brand rounded-full" />
                </div>
              </div>
            ))}
            {Object.keys(data.jobsByStatus).length === 0 && <p className="text-sm text-gray-500">No data yet.</p>}
          </div>
        </div>

        {/* Top downloads */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-brand-400" /> Top Downloads</h3>
          <div className="space-y-3">
            {data.topResources.map((r, i) => (
              <div key={r.title} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm w-5">{i + 1}</span>
                  <span className="text-gray-300 text-sm">{r.title}</span>
                </div>
                <span className="text-white font-medium text-sm">{r.count}</span>
              </div>
            ))}
            {data.topResources.length === 0 && <p className="text-sm text-gray-500">No downloads yet.</p>}
          </div>
        </div>

        {/* Messages by service */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-brand-400" /> Inquiries by Service</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(data.messagesByService).map(([service, count]) => (
              <div key={service} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{count}</div>
                <div className="text-xs text-gray-400 mt-1">{service}</div>
              </div>
            ))}
            {Object.keys(data.messagesByService).length === 0 && <p className="text-sm text-gray-500 col-span-full">No inquiries yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
