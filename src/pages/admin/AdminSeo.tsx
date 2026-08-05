import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Save, Search, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SeoMetadata } from '@/lib/types';

const EMPTY = { page_path: '', title: '', description: '', og_image_url: '', keywords: '' };

export function AdminSeo() {
  const [entries, setEntries] = useState<SeoMetadata[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SeoMetadata | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('seo_metadata').select('*').order('page_path');
    if (data) setEntries(data as SeoMetadata[]);
  };

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (e: SeoMetadata) => {
    setEditing(e);
    setForm({ page_path: e.page_path, title: e.title ?? '', description: e.description ?? '', og_image_url: e.og_image_url ?? '', keywords: e.keywords ?? '' });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      page_path: form.page_path,
      title: form.title || null,
      description: form.description || null,
      og_image_url: form.og_image_url || null,
      keywords: form.keywords || null,
    };
    if (editing) await supabase.from('seo_metadata').update(payload).eq('id', editing.id);
    else await supabase.from('seo_metadata').insert(payload);
    setSaving(false); setShowForm(false); load();
  };

  const remove = async (e: SeoMetadata) => {
    if (!confirm(`Delete SEO metadata for "${e.page_path}"?`)) return;
    await supabase.from('seo_metadata').delete().eq('id', e.id);
    load();
  };

  const filtered = entries.filter((e) => !query || e.page_path.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Globe className="w-6 h-6 text-brand-400" /> SEO Manager</h1>
          <p className="text-gray-400 mt-1">Manage per-page SEO metadata, Open Graph, and keywords.</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> Add Page</button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pages..." className="input-field pl-11" />
      </div>

      <div className="space-y-3">
        {filtered.map((e) => (
          <div key={e.id} className="glass-card p-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <code className="text-sm text-brand-400 font-mono">{e.page_path}</code>
              </div>
              {e.title && <h3 className="text-white font-medium truncate">{e.title}</h3>}
              {e.description && <p className="text-sm text-gray-400 mt-1 line-clamp-2">{e.description}</p>}
              {e.keywords && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {e.keywords.split(',').map((k) => k.trim()).filter(Boolean).map((k) => (
                    <span key={k} className="badge text-xs">{k}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEdit(e)} className="w-9 h-9 rounded-lg glass hover:bg-white/10 flex items-center justify-center text-gray-300"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => remove(e)} className="w-9 h-9 rounded-lg glass hover:bg-danger-500/10 hover:text-danger-400 flex items-center justify-center text-gray-300"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Globe className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-gray-400">No SEO entries yet. Add metadata for your pages.</p>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8 overflow-y-auto" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-strong rounded-3xl w-full max-w-lg my-8">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">{editing ? 'Edit SEO' : 'New SEO Entry'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={save} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Page Path *</label>
                  <input required value={form.page_path} onChange={(e) => setForm({ ...form, page_path: e.target.value })} className="input-field font-mono" placeholder="/about" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="SEO page title" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" placeholder="Meta description..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">OG Image URL</label>
                  <input value={form.og_image_url} onChange={(e) => setForm({ ...form, og_image_url: e.target.value })} className="input-field" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Keywords (comma-separated)</label>
                  <input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className="input-field" placeholder="design, branding, AI" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
