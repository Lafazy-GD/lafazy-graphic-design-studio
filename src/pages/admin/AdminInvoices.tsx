import { useEffect, useState, useCallback } from 'react';
import {
  FileText, Loader2, AlertCircle, CheckCircle2, Clock, XCircle, Printer,
  Download, Search,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Invoice } from '@/lib/types';

const STATUS_STYLES: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  pending: { icon: Clock, color: 'text-warning-400', bg: 'bg-warning-500/10' },
  paid: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
  overdue: { icon: XCircle, color: 'text-danger-400', bg: 'bg-danger-500/10' },
  cancelled: { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-500/10' },
};

const CURRENCY_SYMBOL: Record<string, string> = { USD: '$', NGN: '₦', USDT: '₮' };

export function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Invoice | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (error) setError('Could not load invoices.');
    setInvoices((data as Invoice[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('invoices').update({ status }).eq('id', id);
    load();
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const filtered = invoices.filter(
    (inv) =>
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      inv.client_name.toLowerCase().includes(search.toLowerCase()) ||
      inv.client_email.toLowerCase().includes(search.toLowerCase())
  );

  const printInvoice = (inv: Invoice) => {
    const sym = CURRENCY_SYMBOL[inv.currency] || '$';
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>${inv.invoice_number}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1a1a2e; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
        .logo { font-size: 24px; font-weight: bold; }
        .logo span { color: #6366f1; }
        .inv-num { font-size: 28px; font-weight: bold; color: #6366f1; }
        .section { margin-bottom: 24px; }
        .label { color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
        .value { font-size: 16px; font-weight: 500; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th { text-align: left; padding: 12px; background: #f5f5f5; font-size: 12px; text-transform: uppercase; }
        .table td { padding: 12px; border-bottom: 1px solid #eee; }
        .total { text-align: right; font-size: 24px; font-weight: bold; margin-top: 20px; }
        .total span { color: #6366f1; }
        .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-paid { background: #d1fae5; color: #065f46; }
      </style></head><body>
      <div class="header">
        <div><div class="logo">Lafazy<span>.</span></div><div style="font-size:14px;color:#666;margin-top:4px;">Graphic Design Studio</div></div>
        <div style="text-align:right;">
          <div class="inv-num">${inv.invoice_number}</div>
          <div class="status status-${inv.status}">${inv.status}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:30px;">
        <div class="section">
          <div class="label">Bill To</div>
          <div class="value">${inv.client_name}</div>
          ${inv.client_company ? `<div>${inv.client_company}</div>` : ''}
          <div style="color:#666;">${inv.client_email}</div>
        </div>
        <div class="section" style="text-align:right;">
          <div class="label">Due Date</div>
          <div class="value">${inv.due_date ? new Date(inv.due_date).toLocaleDateString() : 'Upon receipt'}</div>
          <div class="label" style="margin-top:8px;">Issued</div>
          <div class="value">${new Date(inv.created_at).toLocaleDateString()}</div>
        </div>
      </div>
      <table class="table">
        <tr><th>Description</th><th style="text-align:right;">Amount</th></tr>
        <tr><td><strong>${inv.project_name}</strong>${inv.description ? `<br/><span style="color:#666;font-size:14px;">${inv.description}</span>` : ''}</td>
        <td style="text-align:right;">${sym}${inv.amount.toLocaleString()}</td></tr>
      </table>
      <div class="total">Total: <span>${sym}${inv.amount.toLocaleString()} ${inv.currency}</span></div>
      ${inv.notes ? `<div style="margin-top:30px;padding:16px;background:#f9fafb;border-radius:8px;"><strong>Notes:</strong> ${inv.notes}</div>` : ''}
      <div class="footer">
        <p>Lafazy Graphic Design Studio — International Creative Studio</p>
        <p>Payment methods available at lafazystudio.com/payment — Thank you for your business!</p>
      </div>
      </body></html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

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
          <FileText className="w-6 h-6 text-brand-400" /> Invoices
        </h1>
        <p className="text-gray-400 mt-1">View and manage all client invoices.</p>
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
          placeholder="Search by invoice number, client name, or email..."
          className="input-field pl-10"
        />
      </div>

      {/* Invoices Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Invoice #</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Client</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Project</th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-gray-500 py-12">No invoices found.</td></tr>
              ) : filtered.map((inv) => {
                const st = STATUS_STYLES[inv.status] || STATUS_STYLES.pending;
                const sym = CURRENCY_SYMBOL[inv.currency] || '$';
                return (
                  <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-white">{inv.invoice_number}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{inv.client_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400 max-w-[200px] truncate">{inv.project_name}</td>
                    <td className="px-4 py-3 text-sm text-white text-right font-medium">{sym}{inv.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                        <st.icon className="w-3 h-3" /> {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{new Date(inv.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSelected(inv)} className="text-xs text-brand-400 hover:text-brand-300">View</button>
                        <button onClick={() => printInvoice(inv)} className="text-gray-400 hover:text-white"><Printer className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start overflow-y-auto p-4 sm:p-8">
          <div className="glass-strong rounded-2xl max-w-lg w-full mx-auto my-8 p-6 sm:p-8 relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <XCircle className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-white mb-4">{selected.invoice_number}</h2>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-gray-400">Client</span><span className="text-sm text-white">{selected.client_name}</span></div>
              {selected.client_company && <div className="flex justify-between"><span className="text-sm text-gray-400">Company</span><span className="text-sm text-white">{selected.client_company}</span></div>}
              <div className="flex justify-between"><span className="text-sm text-gray-400">Email</span><span className="text-sm text-white">{selected.client_email}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-400">Project</span><span className="text-sm text-white">{selected.project_name}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-400">Amount</span><span className="text-sm text-white font-medium">{CURRENCY_SYMBOL[selected.currency] || '$'}{selected.amount.toLocaleString()} {selected.currency}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-400">Due Date</span><span className="text-sm text-white">{selected.due_date ? new Date(selected.due_date).toLocaleDateString() : 'Upon receipt'}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-400">Status</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${(STATUS_STYLES[selected.status] || STATUS_STYLES.pending).bg} ${(STATUS_STYLES[selected.status] || STATUS_STYLES.pending).color}`}>{selected.status}</span>
              </div>
              {selected.description && <div className="pt-3 border-t border-white/10"><span className="text-sm text-gray-400 block mb-1">Description</span><p className="text-sm text-gray-300">{selected.description}</p></div>}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
                className="input-field flex-1"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={() => printInvoice(selected)} className="btn-primary">
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
