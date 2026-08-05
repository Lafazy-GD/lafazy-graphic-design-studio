import { useEffect, useState, useCallback } from 'react';
import {
  CreditCard, Plus, Trash2, Save, CheckCircle2, Building2, Smartphone,
  Bitcoin, Wallet, Loader2, AlertCircle, X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PaymentMethod } from '@/lib/types';
import { FileUpload } from '@/components/FileUpload';

const CATEGORY_OPTIONS = [
  { value: 'bank', label: 'Bank', icon: Building2 },
  { value: 'mobile', label: 'Mobile Money', icon: Smartphone },
  { value: 'crypto', label: 'Cryptocurrency', icon: Bitcoin },
];

const CURRENCY_OPTIONS = ['NGN', 'USD'];

const EMPTY_METHOD: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  slug: '',
  currency: 'NGN',
  category: 'bank',
  account_name: '',
  account_number: '',
  bank_name: '',
  usd_account_name: '',
  usd_account_number: '',
  swift_code: '',
  routing_number: '',
  wallet_address: '',
  binance_pay_id: '',
  qr_code_url: '',
  instructions: '',
  is_active: true,
  sort_order: 0,
};

export function AdminPayments() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('payment_methods').select('*').order('sort_order');
    if (error) {
      setError('Could not load payment methods.');
      setLoading(false);
      return;
    }
    setMethods((data as PaymentMethod[]) || []);
    setLoading(false);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!editing) return;
    const slug = editing.slug || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const payload = {
      ...editing,
      slug,
      sort_order: editing.sort_order || methods.length + 1,
    };

    if (editing.id) {
      const { error } = await supabase.from('payment_methods').update(payload).eq('id', editing.id);
      if (error) setError(error.message);
    } else {
      const { id, created_at, updated_at, ...insertPayload } = payload;
      const { error } = await supabase.from('payment_methods').insert(insertPayload);
      if (error) setError(error.message);
    }

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setShowForm(false);
      setEditing(null);
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this payment method?')) return;
    await supabase.from('payment_methods').delete().eq('id', id);
    load();
  };

  const handleEdit = (m: PaymentMethod) => {
    setEditing(m);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditing({ ...EMPTY_METHOD } as PaymentMethod);
    setShowForm(true);
  };

  const updateField = (field: keyof PaymentMethod, value: string | boolean | number) => {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-brand-400" /> Payment Settings
          </h1>
          <p className="text-gray-400 mt-1">Manage your payment methods, bank accounts, and wallet addresses.</p>
        </div>
        <button onClick={handleAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Method
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-danger-400 shrink-0 mt-0.5" />
          <p className="text-sm text-danger-400">{error}</p>
        </div>
      )}

      {/* Payment Methods List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {methods.map((m) => {
          const cat = CATEGORY_OPTIONS.find((c) => c.value === m.category);
          const Icon = cat?.icon || Wallet;
          return (
            <div key={m.id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{m.name}</h3>
                    <p className="text-xs text-gray-500">{m.currency} — {cat?.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${m.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                    {m.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              {m.account_number && <p className="text-xs text-gray-400 font-mono">Acct: {m.account_number}</p>}
              {m.wallet_address && <p className="text-xs text-gray-400 font-mono truncate">Wallet: {m.wallet_address.slice(0, 20)}...</p>}
              {m.binance_pay_id && <p className="text-xs text-gray-400 font-mono">Binance ID: {m.binance_pay_id}</p>}
              {!m.account_number && !m.wallet_address && !m.binance_pay_id && !m.usd_account_number && (
                <p className="text-xs text-warning-400">No details configured yet</p>
              )}
              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => handleEdit(m)} className="text-xs text-brand-400 hover:text-brand-300">Edit</button>
                <button onClick={() => handleDelete(m.id)} className="text-xs text-danger-400 hover:text-danger-300">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Add Form Modal */}
      {showForm && editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start overflow-y-auto p-4 sm:p-8">
          <div className="glass-strong rounded-2xl max-w-2xl w-full mx-auto my-8 p-6 sm:p-8 relative">
            <button
              onClick={() => { setShowForm(false); setEditing(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-white mb-6">
              {editing.id ? 'Edit Payment Method' : 'Add Payment Method'}
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Name *</label>
                  <input value={editing.name} onChange={(e) => updateField('name', e.target.value)} className="input-field" placeholder="e.g. GTBank Transfer" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Slug</label>
                  <input value={editing.slug} onChange={(e) => updateField('slug', e.target.value)} className="input-field" placeholder="auto-generated from name" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Currency</label>
                  <select value={editing.currency} onChange={(e) => updateField('currency', e.target.value)} className="input-field">
                    {CURRENCY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Category</label>
                  <select value={editing.category} onChange={(e) => updateField('category', e.target.value)} className="input-field">
                    {CATEGORY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Bank fields */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-gray-300">Bank / Account Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Account Name</label>
                    <input value={editing.account_name || ''} onChange={(e) => updateField('account_name', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Account Number</label>
                    <input value={editing.account_number || ''} onChange={(e) => updateField('account_number', e.target.value)} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Bank Name</label>
                  <input value={editing.bank_name || ''} onChange={(e) => updateField('bank_name', e.target.value)} className="input-field" />
                </div>
              </div>

              {/* USD fields */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-gray-300">USD Account Details (Raenest / International)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">USD Account Name</label>
                    <input value={editing.usd_account_name || ''} onChange={(e) => updateField('usd_account_name', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">USD Account Number</label>
                    <input value={editing.usd_account_number || ''} onChange={(e) => updateField('usd_account_number', e.target.value)} className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">SWIFT Code</label>
                    <input value={editing.swift_code || ''} onChange={(e) => updateField('swift_code', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Routing Number</label>
                    <input value={editing.routing_number || ''} onChange={(e) => updateField('routing_number', e.target.value)} className="input-field" />
                  </div>
                </div>
              </div>

              {/* Crypto fields */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-gray-300">Cryptocurrency / Binance Pay</h3>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Wallet Address</label>
                  <input value={editing.wallet_address || ''} onChange={(e) => updateField('wallet_address', e.target.value)} className="input-field font-mono" placeholder="0x... / bc1... / T..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Binance Pay ID</label>
                  <input value={editing.binance_pay_id || ''} onChange={(e) => updateField('binance_pay_id', e.target.value)} className="input-field" />
                </div>
              </div>

              {/* QR Code */}
              <div className="pt-4 border-t border-white/10">
                <label className="block text-sm text-gray-300 mb-2">QR Code Image (optional)</label>
                <FileUpload
                  folder="qr-codes"
                  onUploaded={(url) => updateField('qr_code_url', url)}
                  label="Upload QR code image"
                  accept=".png,.jpg,.jpeg,.svg"
                  currentUrl={editing.qr_code_url}
                  showPreview
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Payment Instructions</label>
                <textarea
                  value={editing.instructions || ''}
                  onChange={(e) => updateField('instructions', e.target.value)}
                  className="input-field min-h-[80px]"
                  placeholder="Instructions shown to clients on the payment page"
                />
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) => updateField('is_active', e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-500"
                />
                <span className="text-sm text-gray-300">Active (visible on payment page)</span>
              </label>

              <div className="flex items-center gap-4 pt-2">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
                {saved && <span className="text-sm text-green-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Saved!</span>}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
