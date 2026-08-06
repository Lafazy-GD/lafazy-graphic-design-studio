import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Mail, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSeo } from '@/lib/seo';
import { Section, GlowOrb, Breadcrumbs } from '@/components/ui';
import { FileUpload } from '@/components/FileUpload';
import { trackContactSubmit } from '@/lib/analytics';

const SERVICES = ['Brand Identity', 'Logo Design', 'Digital Design', 'Social Media Design', 'AI Prompt Engineering', 'Creative Direction'];
const BUDGETS = ['< $500', '$500 - $1,000', '$1,000 - $5,000', '$5,000 - $10,000', '$10,000+'];
const TIMELINES = ['ASAP', '1-2 weeks', '1 month', '2-3 months', 'Flexible'];

export function ContactPage() {
  useSeo({ title: 'Contact — Start a Project', description: 'Get in touch to discuss your branding, design, or AI prompt engineering project.', canonicalPath: '/contact' });

  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', budget: '', timeline: '', message: '', attachment_url: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Input validation
    if (form.name.trim().length < 2) { setError('Please enter your name.'); setSubmitting(false); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Please enter a valid email address.'); setSubmitting(false); return; }
    if (form.message.trim().length < 10) { setError('Please enter a message of at least 10 characters.'); setSubmitting(false); return; }

    const { error: err } = await supabase.from('contact_messages').insert({
      name: form.name, email: form.email, company: form.company || null,
      service: form.service || null, budget: form.budget || null, timeline: form.timeline || null,
      message: form.message, attachment_url: form.attachment_url || null,
    });
    setSubmitting(false);
    if (err) { setError('Something went wrong. Please try again.'); return; }

    // Fire email notification (best-effort, non-blocking)
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ name: form.name, email: form.email, company: form.company, service: form.service, budget: form.budget, timeline: form.timeline, message: form.message }),
      });
    } catch { /* email is best-effort */ }

    setSent(true);
    setForm({ name: '', email: '', company: '', service: '', budget: '', timeline: '', message: '', attachment_url: '' });
    trackContactSubmit(form.service || undefined);
  };

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-8">
        <GlowOrb className="w-[400px] h-[400px] bg-brand-500 top-0 right-10" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">Contact</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-balance">Let's start a project</h1>
            <p className="mt-6 text-lg text-gray-400">Tell me about your project and I'll get back to you within 24 hours.</p>
          </motion.div>
        </div>
      </section>

      <Section className="!pt-8">
        <div className="container-max section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              {sent ? (
                <div className="glass-card p-10 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white">Message sent!</h3>
                  <p className="text-gray-400 mt-2">Thanks for reaching out. I'll get back to you soon.</p>
                  <button onClick={() => setSent(false)} className="btn-ghost mt-6">Send another</button>
                </div>
              ) : (
                <form onSubmit={submit} className="glass-card p-6 sm:p-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Name *</label>
                      <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Email *</label>
                      <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" placeholder="you@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Company</label>
                    <input value={form.company} onChange={(e) => update('company', e.target.value)} className="input-field" placeholder="Company name" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Service</label>
                      <select value={form.service} onChange={(e) => update('service', e.target.value)} className="input-field">
                        <option value="">Select...</option>
                        {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Budget</label>
                      <select value={form.budget} onChange={(e) => update('budget', e.target.value)} className="input-field">
                        <option value="">Select...</option>
                        {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Timeline</label>
                      <select value={form.timeline} onChange={(e) => update('timeline', e.target.value)} className="input-field">
                        <option value="">Select...</option>
                        {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Message *</label>
                    <textarea required value={form.message} onChange={(e) => update('message', e.target.value)} rows={5} className="input-field resize-none" placeholder="Tell me about your project..." />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Attachment (optional)</label>
                    <FileUpload
                      folder="attachments/contact"
                      label="Upload attachment"
                      accept=".jpg,.jpeg,.png,.webp,.svg,.pdf,.zip,.docx"
                      currentUrl={form.attachment_url || null}
                      onUploaded={(url) => update('attachment_url', url)}
                    />
                  </div>
                  {error && <p className="text-sm text-danger-400">{error}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                    {submitting ? 'Sending...' : <>Send Message <Send className="w-4 h-4" /></>}
                  </button>
                  <p className="text-xs text-gray-500">Protected against spam. Your information is never shared.</p>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-brand-400" /></div>
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <a href="mailto:lafazy@lafazystudio.com" className="text-white hover:text-brand-300 transition-colors">lafazy@lafazystudio.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-brand-400" /></div>
                  <div>
                    <div className="text-sm text-gray-400">Location</div>
                    <div className="text-white">Remote · Worldwide</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-brand-400" /></div>
                  <div>
                    <div className="text-sm text-gray-400">Response Time</div>
                    <div className="text-white">Within 24 hours</div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-semibold text-white mb-2">Prefer to chat?</h3>
                <p className="text-sm text-gray-400 mb-4">Reach me directly on WhatsApp or social media.</p>
                <div className="flex flex-col gap-2">
                  <a href="https://wa.me/2347073692261" target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">WhatsApp</a>
                  <a href="https://www.facebook.com/profile.php?id=61590833153269" target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">Facebook</a>
                  <a href="https://www.tiktok.com/@lafazy.one.boy" target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">TikTok</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
