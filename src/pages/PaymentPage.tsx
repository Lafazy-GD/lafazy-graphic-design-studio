import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Copy, Check, Wallet, Building2, Smartphone, Bitcoin, ArrowRight,
  FileText, Upload, AlertCircle, CheckCircle2, Loader2, Receipt,
} from 'lucide-react';
import { useSeo } from '@/lib/seo';
import { Section, SectionHeading, GlowOrb, Breadcrumbs, CtaButton } from '@/components/ui';
import { FileUpload } from '@/components/FileUpload';
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';
import type { PaymentMethod } from '@/lib/types';

const CURRENCIES = [
  { code: 'NGN', label: 'Nigerian Naira', symbol: '₦' },
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'USDT', label: 'Cryptocurrency', symbol: '₮' },
];

const CATEGORY_ICONS: Record<string, typeof Building2> = {
  bank: Building2,
  mobile: Smartphone,
  crypto: Bitcoin,
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackEvent('copy_payment_detail', { label });
  }, [text, label]);

  if (!text) return null;

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function DetailRow({ label, value, copyable }: { label: string; value: string | null; copyable?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-white font-medium font-mono">{value}</span>
        {copyable && <CopyButton text={value} label={label} />}
      </div>
    </div>
  );
}

export function PaymentPage() {
  useSeo({
    title: 'Payment Center — Multi-Currency & Crypto Payment | Lafazy Studio',
    description: 'Pay for design services in NGN, USD, or cryptocurrency. Bank transfer, Opay, Moniepoint, PalmPay, Binance Pay, USDT, BTC, ETH. Secure and encrypted.',
    keywords: 'payment methods, bank transfer, crypto payment, USDT, Bitcoin, Ethereum, Opay, Moniepoint, PalmPay, Binance Pay',
    canonicalPath: '/payment',
  });

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('NGN');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    invoice_number: '',
    transaction_id: '',
    amount_paid: '',
    notes: '',
  });
  const [receiptUrl, setReceiptUrl] = useState('');
  const [receiptPath, setReceiptPath] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMethods();
  }, []);

  const loadMethods = async () => {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) {
      setError('Could not load payment methods. Please try again later.');
      setLoading(false);
      return;
    }
    setMethods((data as PaymentMethod[]) || []);
    setLoading(false);
  };

  const filteredMethods = methods.filter((m) => {
    if (currency === 'NGN') return m.currency === 'NGN';
    if (currency === 'USD') return m.currency === 'USD' && m.category !== 'crypto';
    if (currency === 'USDT') return m.currency === 'USD' && m.category === 'crypto';
    return true;
  });

  const selected = methods.find((m) => m.slug === selectedMethod);

  const generateReference = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let ref = 'PAY-';
    for (let i = 0; i < 8; i++) ref += chars[Math.floor(Math.random() * chars.length)];
    return ref;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!form.client_name || !form.client_email || !form.amount_paid) {
      setError('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    if (!selectedMethod) {
      setError('Please select a payment method.');
      setSubmitting(false);
      return;
    }

    const reference = generateReference();
    const method = methods.find((m) => m.slug === selectedMethod);

    const { error: insertError } = await supabase.from('payment_confirmations').insert({
      reference_number: reference,
      client_name: form.client_name,
      client_email: form.client_email,
      payment_method: method?.name || selectedMethod,
      transaction_id: form.transaction_id || null,
      amount_paid: parseFloat(form.amount_paid),
      currency,
      receipt_url: receiptUrl || null,
      notes: form.notes || null,
      status: 'pending',
    });

    if (insertError) {
      setError('Could not submit confirmation. Please try again or contact us directly.');
      setSubmitting(false);
      return;
    }

    trackEvent('payment_confirmation_submitted', { reference, method: selectedMethod, currency });
    setSubmitted(true);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center">
        <Loader2 className="w-8 h-8 text-brand-400 mx-auto animate-spin" />
        <p className="mt-4 text-sm text-gray-500">Loading payment options...</p>
      </div>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12">
        <GlowOrb className="w-[400px] h-[400px] bg-accent-500 top-0 left-10" />
        <div className="container-max section-padding relative">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Payment' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">Payment Center</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-balance">
              Pay for your <span className="gradient-text">design project</span>
            </h1>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              Choose your preferred currency and payment method. All transactions are secure.
              After payment, submit the confirmation form below with your receipt.
            </p>
          </motion.div>
        </div>
      </section>

      <Section className="!pt-4">
        <div className="container-max section-padding">
          {/* Currency Selector */}
          <div className="glass-card p-6 mb-8">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">1. Select Currency</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { setCurrency(c.code); setSelectedMethod(null); }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    currency === c.code
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl font-bold text-white">{c.symbol}</div>
                  <div className="text-sm text-gray-400 mt-1">{c.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="glass-card p-6 mb-8">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">2. Select Payment Method</h2>
            {filteredMethods.length === 0 ? (
              <p className="text-sm text-gray-500">No payment methods available for this currency. Please contact us directly.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredMethods.map((m) => {
                  const Icon = CATEGORY_ICONS[m.category] || Wallet;
                  const active = selectedMethod === m.slug;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m.slug)}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                        active ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${active ? 'gradient-brand' : 'bg-brand-500/10'}`}>
                        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-brand-400'}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-white truncate">{m.name}</div>
                        <div className="text-xs text-gray-500">{m.currency}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Details */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 mb-8"
            >
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">3. Payment Details</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  {selected.instructions && (
                    <div className="mb-4 p-4 rounded-xl bg-brand-500/5 border border-brand-500/20">
                      <p className="text-sm text-gray-300 leading-relaxed">{selected.instructions}</p>
                    </div>
                  )}
                  <div className="space-y-0">
                    <DetailRow label="Account Name" value={selected.account_name} copyable />
                    <DetailRow label="Account Number" value={selected.account_number} copyable />
                    <DetailRow label="Bank Name" value={selected.bank_name} copyable={false} />
                    <DetailRow label="USD Account Name" value={selected.usd_account_name} copyable />
                    <DetailRow label="USD Account Number" value={selected.usd_account_number} copyable />
                    <DetailRow label="SWIFT Code" value={selected.swift_code} copyable />
                    <DetailRow label="Routing Number" value={selected.routing_number} copyable />
                    <DetailRow label="Binance Pay ID" value={selected.binance_pay_id} copyable />
                    <DetailRow label="Wallet Address" value={selected.wallet_address} copyable />
                  </div>
                </div>
                {selected.qr_code_url && (
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-4 bg-white rounded-2xl">
                      <img src={selected.qr_code_url} alt={`QR code for ${selected.name}`} className="w-48 h-48 object-contain" />
                    </div>
                    <p className="text-sm text-gray-400 mt-3">Scan to pay via {selected.name}</p>
                  </div>
                )}
              </div>
              {!selected.account_number && !selected.wallet_address && !selected.binance_pay_id && !selected.usd_account_number && (
                <div className="mt-4 p-4 rounded-xl bg-warning-500/10 border border-warning-500/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    Payment details for this method are being configured. Please contact us directly at the email below to complete your payment, or check back soon.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Confirmation Form */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">Confirmation Submitted!</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Your payment confirmation has been received. You'll receive a verification email within 24 hours.
                A reference number has been generated for your records.
              </p>
              <div className="mt-6">
                <CtaButton to="/" variant="ghost">Return Home <ArrowRight className="w-4 h-4" /></CtaButton>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card p-6">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {selectedMethod ? '4. Submit Payment Confirmation' : 'Submit Payment Confirmation'}
              </h2>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-danger-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-danger-400">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Your Name *</label>
                    <input
                      value={form.client_name}
                      onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      value={form.client_email}
                      onChange={(e) => setForm({ ...form, client_email: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Invoice Number (if you have one)</label>
                    <input
                      value={form.invoice_number}
                      onChange={(e) => setForm({ ...form, invoice_number: e.target.value })}
                      className="input-field"
                      placeholder="INV-2026-0001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Transaction ID</label>
                    <input
                      value={form.transaction_id}
                      onChange={(e) => setForm({ ...form, transaction_id: e.target.value })}
                      className="input-field"
                      placeholder="Transaction reference from your bank/wallet"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Amount Paid *</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={form.amount_paid}
                        onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
                        className="input-field"
                        placeholder="0.00"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">{currency}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Payment Method</label>
                    <input
                      value={selected?.name || '—'}
                      disabled
                      className="input-field opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Upload Receipt</label>
                  <FileUpload
                    folder="receipts"
                    onUploaded={(url) => setReceiptUrl(url)}
                    label="Upload payment receipt (PDF, PNG, JPG)"
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Additional Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="input-field min-h-[80px]"
                    placeholder="Any additional information about your payment"
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Receipt className="w-4 h-4" /> Submit Confirmation</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
