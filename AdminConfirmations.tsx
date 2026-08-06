import { useEffect, useState, useCallback } from 'react';
import {
  Receipt, Loader2, AlertCircle, CheckCircle2, Clock, XCircle,
  ExternalLink, Search,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PaymentConfirmation } from '@/lib/types';

const STATUS_STYLES: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  pending: { icon: Clock, color: 'text-warning-400', bg: 'bg-warning-500/10' },
  verified: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
  rejected: { icon: XCircle, color: 'text-danger-400', bg: 'bg-danger-500/10' },
};

const CURRENCY_SYMBOL: Record<string, string> = { USD: '$', NGN: '₦', USDT: '₮' };

export function AdminConfirmations() {
  const [confirmations, setConfirmations] = useState<PaymentConfirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payment_confirmations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError('Could not load payment confirmations.');
    setConfirmations((data as PaymentConfirmation[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('payment_confirmations').update({ status }).eq('id', id);
    load();
  };

  const filtered = confirmations.filter(
    (c) =>
      c.reference_number.toLowerCase().includes(search.toLowerCase()) ||
      c.client_name.toLowerCase().includes(search.toLowerCase()) ||
      c.client_email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Receipt className="w-6 h-6 text-brand-400" /> Payment Confirmations
        </h1>
        <p className="text-gray-400 mt-1">Review payment confirmations submitted by clients.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-danger-400 shrink-0 mt-0.5" />
          <p className="text-sm text-danger-400">{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by reference, name, or email..."
          className="input-field pl-10"
        />
      </div>

      {/* Confirmations */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center text-gray-500">No payment confirmations yet.</div>
        ) : filtered.map((c) => {
          const st = STATUS_STYLES[c.status] || STATUS_STYLES.pending;
          const sym = CURRENCY_SYMBOL[c.currency] || '$';
          return (
            <div key={c.id} className="glass-card p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-white">{c.reference_number}</span>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                      <st.icon className="w-3 h-3" /> {c.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    <div><span className="text-gray-400">Client:</span> <span className="text-white">{c.client_name}</span></div>
                    <div><span className="text-gray-400">Email:</span> <span className="text-white">{c.client_email}</span></div>
                    <div><span className="text-gray-400">Method:</span> <span className="text-white">{c.payment_method}</span></div>
                    <div><span className="text-gray-400">Amount:</span> <span className="text-white font-medium">{sym}{c.amount_paid.toLocaleString()} {c.currency}</span></div>
                    {c.transaction_id && <div><span className="text-gray-400">Txn ID:</span> <span className="text-white font-mono text-xs">{c.transaction_id}</span></div>}
                    <div><span className="text-gray-400">Date:</span> <span className="text-white">{new Date(c.created_at).toLocaleDateString()}</span></div>
                  </div>
                  {c.notes && <p className="text-sm text-gray-400 pt-2"><span className="text-gray-500">Notes:</span> {c.notes}</p>}
                  {c.receipt_url && (
                    <a href={c.receipt_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 mt-2">
                      <ExternalLink className="w-3.5 h-3.5" /> View Receipt
                    </a>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:w-40">
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c.id, e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
