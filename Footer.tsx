import { Link } from 'react-router-dom';
import { Sparkles, Facebook, Mail, ArrowUpRight } from 'lucide-react';

const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61590833153269', icon: Facebook },
  { label: 'TikTok', href: 'https://www.tiktok.com/@lafazy.one.boy', icon: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.66a8.16 8.16 0 0 0 4.77 1.52V6.69h-1.04z"/></svg>
  )},
  { label: 'WhatsApp', href: 'https://wa.me/2347073692261', icon: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M17.6 6.3A7.85 7.85 0 0 0 12 4a7.95 7.95 0 0 0-6.85 11.9L4 20l4.2-1.1A7.95 7.95 0 0 0 12 20a8 8 0 0 0 5.6-13.7zM12 18.3a6.3 6.3 0 0 1-3.2-.9l-.23-.13-2.5.66.67-2.42-.15-.25a6.3 6.3 0 1 1 5.4 3.04zm3.5-4.7c-.2-.1-1.15-.57-1.32-.63s-.3-.1-.43.1-.5.63-.62.76-.23.15-.43.05a8 8 0 0 1-2.36-1.45 8.7 8.7 0 0 1-1.63-2.03c-.17-.3 0-.45.13-.6s.3-.35.43-.52a2 2 0 0 0 .3-.5.37.37 0 0 0 0-.35c0-.1-.43-1.03-.58-1.4s-.3-.32-.43-.33h-.37a.7.7 0 0 0-.5.23 2 2 0 0 0-.63 1.5 3.5 3.5 0 0 0 .73 1.85 8 8 0 0 0 3.06 2.7c.43.18.76.3 1.02.38a2.5 2.5 0 0 0 1.13.07c.35-.05 1.15-.47 1.3-.92s.2-.84.13-.92-.2-.13-.4-.23z"/></svg>
  )},
];

const FOOTER_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Blog', to: '/blog' },
  { label: 'Remote Jobs', to: '/jobs' },
  { label: 'Recruiters', to: '/recruiters' },
  { label: 'Resume', to: '/resume' },
  { label: 'Recruiters', to: '/recruiters' },
  { label: 'Recruiter Package', to: '/recruiter-package' },
  { label: 'Hire Me', to: '/hire-me' },
  { label: 'Checkout', to: '/checkout' },
  { label: 'Payment', to: '/payment' },
  { label: 'AI Prompt Engineering', to: '/ai-prompt-engineering' },
  { label: 'Contact', to: '/contact' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 mt-20">
      <div className="container-max section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-lg font-semibold text-white">
                Lafazy Graphic Design Studio
              </span>
            </Link>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Premium international creative studio for branding, logo design, visual identity,
              and AI-powered creative solutions. Available for remote work worldwide.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-xl glass hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
              <a
                href="mailto:lafazy@lafazystudio.com"
                aria-label="Email"
                className="w-10 h-10 rounded-xl glass hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.slice(0, 5).map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-400 hover:text-white transition-colors link-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">More</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.slice(5).map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-400 hover:text-white transition-colors link-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Lafazy Graphic Design Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/payment-policy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Payment Policy</Link>
            <Link to="/refund-policy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Refund Policy</Link>
            <Link to="/terms" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Terms</Link>
            <Link to="/login" className="text-xs text-gray-600 hover:text-gray-400 transition-colors inline-flex items-center gap-1">
              Admin <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
