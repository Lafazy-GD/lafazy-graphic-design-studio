import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, MessageSquare, Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSeo } from '@/lib/seo';
import { Section, GlowOrb, Breadcrumbs } from '@/components/ui';
import { FileUpload } from '@/components/FileUpload';
import type { VisitorMessage } from '@/lib/types';

export function RecruitersPage() {
  useSeo({ title: 'Recruiters — Leave a Message', description: 'Recruiters and companies can leave a message for Lafazy directly.', canonicalPath: '/recruiters' });

  const [form, setForm] = useState({ company_name: '', recruiter_name: '', email: '', website: '', message: '', attachment_url: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<VisitorMessage[]>([]);

  useEffect(() => {
    supabase.from('visitor_messages').select('*').eq('moderated', true).order('created_at', { ascending: false }).limit(6).then(({ data }) => {
      if (data) setMessages(data);
    });
  }, []);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase.from('visitor_messages').insert({
      company_name: form.company_name || null,
      recruiter_name: form.recruiter_name,
      email: form.email,
      website: form.website || null,
      message: form.message,
      attachment_url: form.attachment_url || null,
    });
    setSubmitting(false);
    if (err) { setError('Something went wrong. Please try again.'); return; }
    setSent(true);
    setForm({ company_name: '', recruiter_name: '', email: '', website: '', message: '', attachment_url: '' });
  };

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-8">
        <GlowOrb className="w-[400px] h-[400px] bg-brand-500 top-0 right-10" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Recruiters' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">For Recruiters</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-balance">Leave a message for Lafazy</h1>
            <p className="mt-6 text-lg text-gray-400">Are you a recruiter or hiring company? Drop a message and I'll get back to you promptly.</p>
          </motion.div>
        </div>
      </section>

      <Section className="!pt-8">
        <div className="container-max section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div>
              {sent ? (
                <div className="glass-card p-10 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white">Message received!</h3>
                  <p className="text-gray-400 mt-2">Thank you. I'll review your message and respond soon.</p>
                  <button onClick={() => setSent(false)} className="btn-ghost mt-6">Leave another</button>
                </div>
              ) : (
                <form onSubmit={submit} className="glass-card p-6 sm:p-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Recruiter Name *</label>
                      <input required value={form.recruiter_name} onChange={(e) => update('recruiter_name', e.target.value)} className="input-field" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Email *</label>
                      <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" placeholder="you@company.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Company</label>
                      <input value={form.company_name} onChange={(e) => update('company_name', e.target.value)} className="input-field" placeholder="Company name" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Website</label>
                      <input value={form.website} onChange={(e) => update('website', e.target.value)} className="input-field" placeholder="https://" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Message *</label>
                    <textarea required value={form.message} onChange={(e) => update('message', e.target.value)} rows={5} className="input-field resize-none" placeholder="Tell me about the role..." />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Attachment (optional)</label>
                    <FileUpload
                      folder="attachments/visitors"
                      label="Upload attachment"
                      accept=".jpg,.jpeg,.png,.webp,.svg,.pdf,.zip,.docx"
                      currentUrl={form.attachment_url || null}
                      onUploaded={(url) => update('attachment_url', url)}
                    />
                  </div>
                  {error && <p className="text-sm text-danger-400">{error}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                    {submitting ? 'Sending...' : <>Submit <Send className="w-4 h-4" /></>}
                  </button>
                </form>
              )}
            </div>

            {/* Messages */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-brand-400" /> Recent messages</h3>
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className="glass-card p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-brand-400" />
                        <span className="text-sm font-medium text-white">{m.recruiter_name}</span>
                        {m.company_name && <span className="text-sm text-gray-400">· {m.company_name}</span>}
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{m.message}</p>
                      <div className="mt-2 text-xs text-gray-500">{new Date(m.created_at).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-8 text-center">
                  <MessageSquare className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No public messages yet. Be the first to leave one!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
