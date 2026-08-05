import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Check, FileText, Loader2, AlertCircle,
  CheckCircle2, Sparkles, Rocket, Star, Building2, Crown,
} from 'lucide-react';
import { useSeo } from '@/lib/seo';
import { Section, GlowOrb, Breadcrumbs, CtaButton } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

const SERVICES = [
  { id: 'brand-identity', name: 'Brand Identity Design', desc: 'Logo, brand guidelines, color systems' },
  { id: 'logo-design', name: 'Logo Design', desc: 'Custom logo design with variations' },
  { id: 'social-media', name: 'Social Media Design', desc: 'Post templates, ad creatives, content systems' },
  { id: 'ai-workflow', name: 'AI Prompt Engineering', desc: 'AI workflow setup and team training' },
  { id: 'creative-direction', name: 'Creative Direction', desc: 'Art direction and campaign design' },
  { id: 'custom', name: 'Custom Project', desc: 'Something else? Let\'s discuss.' },
];

const PACKAGES = [
  {
    id: 'starter', name: 'Starter', icon: Rocket, price: 1000, priceNGN: 500000,
    desc: 'For early-stage brands needing a professional foundation',
    features: ['Logo design (2 concepts)', 'Color palette', 'Typography', 'Business card', 'Social profile kit', '2 revision rounds'],
  },
  {
    id: 'professional', name: 'Professional', icon: Star, price: 3000, priceNGN: 1500000,
    desc: 'For growing brands that need a complete identity system',
    features: ['Everything in Starter', 'Full brand guidelines (15+ pages)', 'Logo system', 'Social templates (8)', 'Presentation template', '3 revision rounds'],
  },
  {
    id: 'studio', name: 'Studio', icon: Building2, price: 10000, priceNGN: 5000000,
    desc: 'For established brands seeking a premium creative partnership',
    features: ['Everything in Professional', 'Brand strategy', 'Full guidelines (30+ pages)', 'Packaging design', 'Website design system', 'AI workflow setup'],
  },
  {
    id: 'enterprise', name: 'Enterprise', icon: Crown, price: 0, priceNGN: 0,
    desc: 'For global brands needing ongoing creative support',
    features: ['Dedicated creative direction', 'Monthly design support', 'AI workflow integration', 'Team training', 'Priority turnaround', 'Quarterly brand audit'],
  },
];

const CURRENCIES = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'NGN', label: 'Nigerian Naira', symbol: '₦' },
];

function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 9000) + 1000);
  return `INV-${year}-${num}`;
}

export function CheckoutPage() {
  useSeo({
    title: 'Hire Me — Checkout | Lafazy Studio',
    description: 'Select your service, choose a package, and start your project with Lafazy Studio. Multi-currency checkout with flexible payment options.',
    keywords: 'hire graphic designer, checkout, branding services, design packages',
    canonicalPath: '/checkout',
  });

  const [step, setStep] = useState(1);
  const [service, setService] = useState('');
  const [pkg, setPkg] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [form, setForm] = useState({
    client_name: '', client_company: '', client_email: '', project_name: '', description: '',
  });
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedPkg = PACKAGES.find((p) => p.id === pkg);
  const selectedService = SERVICES.find((s) => s.id === service);
  const amount = currency === 'USD' ? selectedPkg?.price || 0 : selectedPkg?.priceNGN || 0;
  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol || '$';

  const handleGenerateInvoice = async () => {
    setSubmitting(true);
    setError(null);
    const invNum = generateInvoiceNumber();
    setInvoiceNumber(invNum);

    const { error: insertError } = await supabase.from('invoices').insert({
      invoice_number: invNum,
      client_name: form.client_name,
      client_company: form.client_company || null,
      client_email: form.client_email,
      project_name: form.project_name,
      description: form.description || null,
      amount,
      currency,
      status: 'pending',
    });

    if (insertError) {
      setError('Could not generate invoice. Please try again.');
      setSubmitting(false);
      return;
    }

    trackEvent('invoice_generated', { invoice_number: invNum, service, package: pkg, currency, amount });
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <>
        <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12">
          <GlowOrb className="w-[400px] h-[400px] bg-green-500 top-0 left-1/4" />
          <div className="container-max section-padding relative">
            <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Hire Me', to: '/hire-me' }, { label: 'Checkout' }]} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <CheckCircle2 className="w-16 h-16 text-green-400 mb-6" />
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Invoice Generated!</h1>
              <p className="text-lg text-gray-400 mb-6">
                Your invoice has been created. Use the reference number below to proceed with payment.
              </p>
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Invoice Number</span>
                  <span className="text-lg font-mono font-bold text-white">{invoiceNumber}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Service</span>
                  <span className="text-sm text-white">{selectedService?.name}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Package</span>
                  <span className="text-sm text-white">{selectedPkg?.name}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-sm text-gray-400">Amount Due</span>
                  <span className="text-2xl font-bold gradient-text">{symbol}{amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <CtaButton to="/payment">
                  Proceed to Payment <ArrowRight className="w-4 h-4" />
                </CtaButton>
                <CtaButton to="/" variant="ghost">Return Home</CtaButton>
              </div>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12">
        <GlowOrb className="w-[400px] h-[400px] bg-brand-500 top-0 left-10" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Hire Me', to: '/hire-me' }, { label: 'Checkout' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">Checkout</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-balance">
              Start your <span className="gradient-text">project</span>
            </h1>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              Select your service, choose a package, and generate an invoice. Then proceed to payment.
            </p>
          </motion.div>
        </div>
      </section>

      <Section className="!pt-4">
        <div className="container-max section-padding max-w-3xl">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? 'gradient-brand text-white' : 'bg-white/5 text-gray-500'
                }`}>{step > s ? <Check className="w-4 h-4" /> : s}</div>
                {s < 4 && <div className={`h-0.5 flex-1 rounded ${step > s ? 'bg-brand-500' : 'bg-white/5'}`} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-danger-400 shrink-0 mt-0.5" />
              <p className="text-sm text-danger-400">{error}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Service */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold text-white mb-4">Select a Service</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setService(s.id); }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        service === s.id ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-sm font-medium text-white">{s.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{s.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button disabled={!service} onClick={() => setStep(2)} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Package */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold text-white mb-4">Choose a Package</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PACKAGES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPkg(p.id)}
                      className={`p-5 rounded-xl border text-left transition-all ${
                        pkg === p.id ? 'border-brand-500 bg-brand-500/10 ring-1 ring-brand-500/20' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${pkg === p.id ? 'gradient-brand' : 'bg-brand-500/10'}`}>
                          <p.icon className={`w-4 h-4 ${pkg === p.id ? 'text-white' : 'text-brand-400'}`} />
                        </div>
                        <span className="text-sm font-semibold text-white">{p.name}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">{p.desc}</p>
                      {p.price > 0 ? (
                        <div className="text-lg font-bold gradient-text">
                          ${p.price.toLocaleString()} <span className="text-xs text-gray-500">/ ₦{p.priceNGN.toLocaleString()}</span>
                        </div>
                      ) : (
                        <div className="text-lg font-bold gradient-text">Custom Pricing</div>
                      )}
                      <ul className="mt-3 space-y-1">
                        {p.features.slice(0, 3).map((f) => (
                          <li key={f} className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Check className="w-3 h-3 text-brand-400" /> {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(1)} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</button>
                  <button disabled={!pkg} onClick={() => setStep(3)} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Currency + Details */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold text-white mb-4">Your Details & Currency</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Currency</label>
                    <div className="grid grid-cols-2 gap-3">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => setCurrency(c.code)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            currency === c.code ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <span className="text-lg font-bold text-white">{c.symbol}</span>
                          <span className="text-xs text-gray-400 block">{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Your Name *</label>
                      <input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Company (optional)</label>
                      <input value={form.client_company} onChange={(e) => setForm({ ...form, client_company: e.target.value })} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Email *</label>
                    <input type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Project Name *</label>
                    <input value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} className="input-field" placeholder="e.g. Brand Identity for TechCo" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Project Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px]" placeholder="Briefly describe what you need" />
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(2)} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</button>
                  <button
                    disabled={!form.client_name || !form.client_email || !form.project_name}
                    onClick={() => setStep(4)}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Review <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review + Generate Invoice */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold text-white mb-4">Review & Generate Invoice</h2>
                <div className="glass-card p-6 space-y-4">
                  <div className="flex justify-between"><span className="text-sm text-gray-400">Service</span><span className="text-sm text-white">{selectedService?.name}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-400">Package</span><span className="text-sm text-white">{selectedPkg?.name}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-400">Name</span><span className="text-sm text-white">{form.client_name}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-400">Email</span><span className="text-sm text-white">{form.client_email}</span></div>
                  {form.client_company && <div className="flex justify-between"><span className="text-sm text-gray-400">Company</span><span className="text-sm text-white">{form.client_company}</span></div>}
                  <div className="flex justify-between"><span className="text-sm text-gray-400">Project</span><span className="text-sm text-white">{form.project_name}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-400">Currency</span><span className="text-sm text-white">{currency}</span></div>
                  {selectedPkg && selectedPkg.price > 0 && (
                    <div className="flex justify-between pt-4 border-t border-white/10">
                      <span className="text-sm text-gray-400">Amount</span>
                      <span className="text-2xl font-bold gradient-text">{symbol}{amount.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedPkg && selectedPkg.price === 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-400">Custom pricing — we'll discuss details after you submit.</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(3)} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</button>
                  <button onClick={handleGenerateInvoice} disabled={submitting} className="btn-primary">
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><FileText className="w-4 h-4" /> Generate Invoice</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </>
  );
}
