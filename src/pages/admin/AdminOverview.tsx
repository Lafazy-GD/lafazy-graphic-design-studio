import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderKanban, FileText, Briefcase, Mail, Eye, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Counts {
  projects: number;
  posts: number;
  jobs: number;
  contactMessages: number;
  visitorMessages: number;
  downloads: number;
  totalDownloads: number;
}

export function AdminOverview() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [recentMessages, setRecentMessages] = useState<{ id: string; name: string; message: string; created_at: string }[]>([]);

  useEffect(() => {
    (async () => {
      const [p, b, j, cm, vm, dl] = await Promise.all([
        supabase.from('portfolio_projects').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('visitor_messages').select('*', { count: 'exact', head: true }),
        supabase.from('downloadable_resources').select('*'),
      ]);

      const totalDownloads = (dl.data ?? []).reduce((sum, r) => sum + (r.download_count ?? 0), 0);
      setCounts({
        projects: p.count ?? 0,
        posts: b.count ?? 0,
        jobs: j.count ?? 0,
        contactMessages: cm.count ?? 0,
        visitorMessages: vm.count ?? 0,
        downloads: dl.data?.length ?? 0,
        totalDownloads,
      });

      const { data: msgs } = await supabase.from('contact_messages').select('id, name, message, created_at').order('created_at', { ascending: false }).limit(5);
      if (msgs) setRecentMessages(msgs);
    })();
  }, []);

  const cards = [
    { label: 'Portfolio Projects', value: counts?.projects ?? '—', icon: FolderKanban, to: '/admin/portfolio', color: 'from-brand-500 to-brand-600' },
    { label: 'Blog Posts', value: counts?.posts ?? '—', icon: FileText, to: '/admin/blog', color: 'from-accent-500 to-accent-600' },
    { label: 'Job Applications', value: counts?.jobs ?? '—', icon: Briefcase, to: '/admin/jobs', color: 'from-green-500 to-green-600' },
    { label: 'Contact Messages', value: counts?.contactMessages ?? '—', icon: Mail, to: '/admin/contact', color: 'from-warning-500 to-warning-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-gray-400 mt-1">Welcome back. Here's what's happening in your studio.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={c.to} className="glass-card p-6 block group hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                  <c.icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-3xl font-bold text-white">{c.value}</div>
              <div className="text-sm text-gray-400 mt-1">{c.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <MessageSquareIcon />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{counts?.visitorMessages ?? '—'}</div>
              <div className="text-sm text-gray-400">Visitor Messages</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <DownloadIcon />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{counts?.downloads ?? '—'}</div>
              <div className="text-sm text-gray-400">Download Resources</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{counts?.totalDownloads ?? '—'}</div>
              <div className="text-sm text-gray-400">Total Downloads</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent messages */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Contact Messages</h3>
        {recentMessages.length > 0 ? (
          <div className="space-y-3">
            {recentMessages.map((m) => (
              <div key={m.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-xs font-medium text-white shrink-0">
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-white">{m.name}</span>
                    <span className="text-xs text-gray-500 shrink-0">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-1 mt-0.5">{m.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No messages yet.</p>
        )}
      </div>
    </div>
  );
}

function MessageSquareIcon() {
  return <Mail className="w-5 h-5 text-brand-400" />;
}
function DownloadIcon() {
  return <Eye className="w-5 h-5 text-brand-400" />;
}
