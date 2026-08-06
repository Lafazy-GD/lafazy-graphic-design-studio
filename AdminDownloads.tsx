import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Save, Trash2, Download, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { FileUpload } from '@/components/FileUpload';
import type { DownloadableResource } from '@/lib/types';

const TYPES = ['cv', 'resume', 'cover_letter', 'portfolio', 'brand', 'brochure'];

const EMPTY = { title: '', slug: '', description: '', type: 'resume', file_url: '' };

export function AdminDownloads() {
  const [resources, setResources] = useState<DownloadableResource[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DownloadableResource | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('downloadable_resources').select('*').order('created_at', { ascending: false });
    if (data) setResources(data);
  };

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (r: DownloadableResource) => {
    setEditing(r);
    setForm({ title: r.title, slug: r.slug, description: r.description ?? '', type: r.type, file_url: r.file_url });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const payload = { ...form, slug, description: form.description || null };
    if (editing) await supabase.from('downloadable_resources').update(payload).eq('id', editing.id);
    else await supabase.from('downloadable_resources').insert(payload);
    setSaving(false); setShowForm(false); load();
  };

  const remove = async (r: DownloadableResource) => {
    if (!confirm(`Delete "${r.title}"?`)) return;
    await supabase.from('downloadable_resources').delete().eq('id', r.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Download Center</h1>
          <p className="text-gray-400 mt-1">Manage downloadable resources like CV, resume, and portfolio PDFs.</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> Add Resource</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((r) => (
          <div key={r.id} className="glass-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center"><FileText className="w-5 h-5 text-white" /></div>
              <span className="badge">{r.type}</span>
            </div>
            <h3 className="text-white font-medium">{r.title}</h3>
            {r.description && <p className="text-sm text-gray-400 mt-1 line-clamp-2">{r.description}</p>}
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-500 flex items-center gap-1"><Download className="w-3 h-3" /> {r.download_count} downloads</span>
              <div className="flex gap-1.5">
                <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-lg glass hover:bg-white/10 flex items-center justify-center text-gray-300 text-xs">Edit</button>
                <button onClick={() => remove(r)} className="w-8 h-8 rounded-lg glass hover:bg-danger-500/10 hover:text-danger-400 flex items-center justify-center text-gray-300"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {resources.length === 0 && <div className="glass-card p-12 text-center"><p className="text-gray-400">No resources yet. Add your CV, resume, or portfolio PDF.</p></div>}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8 overflow-y-auto" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-strong rounded-3xl w-full max-w-lg my-8">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">{editing ? 'Edit Resource' : 'New Resource'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={save} className="p-6 space-y-4">
                <div><label className="block text-sm text-gray-300 mb-2">Title *</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm text-gray-300 mb-2">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">{TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="block text-sm text-gray-300 mb-2">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input-field resize-none" /></div>
                <div><label className="block text-sm text-gray-300 mb-2">File</label>
                  <FileUpload
                    folder="downloads"
                    label="Upload resource file"
                    accept=".pdf,.zip,.docx"
                    currentUrl={form.file_url || null}
                    onUploaded={(url) => setForm({ ...form, file_url: url })}
                  />
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
