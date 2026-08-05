import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, FileText, Briefcase, Mail, MessageSquare,
  Settings, LogOut, Sparkles, Menu, X, Download, BarChart3, HardDrive, Globe,
  CreditCard, Receipt,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/portfolio', label: 'Portfolio', icon: FolderKanban },
  { to: '/admin/blog', label: 'Blog', icon: FileText },
  { to: '/admin/jobs', label: 'Job Tracker', icon: Briefcase },
  { to: '/admin/contact', label: 'Contact Messages', icon: Mail },
  { to: '/admin/visitors', label: 'Visitor Messages', icon: MessageSquare },
  { to: '/admin/downloads', label: 'Downloads', icon: Download },
  { to: '/admin/storage', label: 'File Storage', icon: HardDrive },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/seo', label: 'SEO Manager', icon: Globe },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/invoices', label: 'Invoices', icon: FileText },
  { to: '/admin/confirmations', label: 'Confirmations', icon: Receipt },
];

export function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  }
  if (!session) return <Navigate to="/login" replace />;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-ink-950">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 glass-strong border-r border-white/10 z-40 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <NavLink to="/admin" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-semibold text-white">Lafazy Admin</span>
          </NavLink>

          <nav className="space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button onClick={handleSignOut} className="mt-8 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-danger-400 hover:bg-danger-500/10 transition-all">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden glass-strong border-b border-white/10 px-5 h-16 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setOpen(true)} className="text-white"><Menu className="w-6 h-6" /></button>
          <span className="font-display font-semibold text-white">Admin</span>
          <button onClick={handleSignOut} className="text-gray-400"><LogOut className="w-5 h-5" /></button>
        </header>

        <main className="p-5 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
