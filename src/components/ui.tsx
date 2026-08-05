import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function Section({
  children,
  className = '',
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`${center ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'} mb-14`}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white text-balance"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-lg text-gray-400 text-balance"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

export function CtaButton({
  to,
  children,
  variant = 'primary',
  className = '',
}: {
  to: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'outline';
  className?: string;
}) {
  const cls = `${variant === 'primary' ? 'btn-primary' : variant === 'ghost' ? 'btn-ghost' : 'btn-outline'} ${className}`;
  if (to.startsWith('http')) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}

export function GlowOrb({ className = '' }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full blur-3xl opacity-30 ${className}`}
      aria-hidden
    />
  );
}

export function ArrowLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
    >
      {children}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-8">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-gray-600">/</span>}
          {item.to ? (
            <Link to={item.to} className="hover:text-white transition-colors">{item.label}</Link>
          ) : (
            <span className="text-gray-400" aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageLoader() {
  return (
    <div className="pt-32 pb-20 text-center" role="status" aria-label="Loading">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-400 rounded-full mx-auto"
      />
      <p className="mt-4 text-sm text-gray-500">Loading...</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, message, action }: { icon: typeof ArrowRight; title: string; message: string; action?: ReactNode }) {
  return (
    <div className="glass-card p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-500/5 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-brand-400/40" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-sm mx-auto mb-6">{message}</p>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="glass-card p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-danger-500/10 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-danger-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
      <p className="text-gray-400 max-w-sm mx-auto mb-6">{message}</p>
      {onRetry && <button onClick={onRetry} className="btn-ghost">Try again</button>}
    </div>
  );
}
