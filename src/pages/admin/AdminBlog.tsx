import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Eye, EyeOff, Save, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { FileUpload } from '@/components/FileUpload';
import type { BlogPost, BlogCategory } from '@/lib/types';

const EMPTY = {
  title: '', slug: '', excerpt: '', content: '', category_id: '',
  featured: false, status: 'draft' as 'draft' | 'published', cover_image_url: '', reading_time: 1,
};

export function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [catName, setCatName] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('blog_posts').select('*, category:blog_categories(*)').order('created_at', { ascending: false }),
      supabase.from('blog_categories').select('*').order('name'),
    ]);
    if (p) setPosts(p);
    if (c) setCategories(c);
  };

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt ?? '', content: p.content ?? '', category_id: p.category_id ?? '', featured: p.featured, status: p.status as 'draft' | 'published', cover_image_url: p.cover_image_url ?? '', reading_time: p.reading_time });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const payload = { ...form, slug, category_id: form.category_id || null, excerpt: form.excerpt || null, content: form.content || null, cover_image_url: form.cover_image_url || null };
    if (editing) await supabase.from('blog_posts').update(payload).eq('id', editing.id);
    else await supabase.from('blog_posts').insert(payload);
    setSaving(false); setShowForm(false); load();
  };

  const remove = async (p: BlogPost) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    await supabase.from('blog_posts').delete().eq('id', p.id);
    load();
  };

  const togglePublished = async (p: BlogPost) => {
    await supabase.from('blog_posts').update({ status: p.status === 'published' ? 'draft' : 'published' }).eq('id', p.id);
    load();
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await supabase.from('blog_categories').insert({ name: catName, slug });
    setCatName(''); setShowCatForm(false); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Manager</h1>
          <p className="text-gray-400 mt-1">Create, edit, and publish articles.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowCatForm(true)} className="btn-ghost text-sm">Categories</button>
          <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> New Post</button>
        </div>
      </div>

      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="glass-card p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden glass shrink-0">
              {p.cover_image_url ? <img src={p.cover_image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full gradient-brand opacity-20" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {p.featured && <Star className="w-3.5 h-3.5 fill-warning-400 text-warning-400" />}
                <h3 className="text-white font-medium truncate">{p.title}</h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{p.category?.name ?? 'Uncategorized'}</span>
                <span>{p.reading_time} min read</span>
                <span>{new Date(p.created_at).toLocaleDateString()}</span>
                <span className={`px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{p.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEdit(p)} className="w-9 h-9 rounded-lg glass hover:bg-white/10 flex items-center justify-center text-gray-300"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => togglePublished(p)} className="w-9 h-9 rounded-lg glass hover:bg-white/10 flex items-center justify-center text-gray-300">{p.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              <button onClick={() => remove(p)} className="w-9 h-9 rounded-lg glass hover:bg-danger-500/10 hover:text-danger-400 flex items-center justify-center text-gray-300"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && <div className="glass-card p-12 text-center"><p className="text-gray-400">No posts yet. Create your first article.</p></div>}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8 overflow-y-auto" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-strong rounded-3xl w-full max-w-2xl my-8">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">{editing ? 'Edit Post' : 'New Post'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={save} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-300 mb-2">Title *</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" /></div>
                  <div><label className="block text-sm text-gray-300 mb-2">Slug</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" placeholder="auto-generated" /></div>
                </div>
                <div><label className="block text-sm text-gray-300 mb-2">Excerpt</label><textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="input-field resize-none" /></div>
                <div><label className="block text-sm text-gray-300 mb-2">Content</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="input-field resize-none font-mono text-sm" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className="block text-sm text-gray-300 mb-2">Category</label><select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field"><option value="">None</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  <div><label className="block text-sm text-gray-300 mb-2">Reading Time (min)</label><input type="number" value={form.reading_time} onChange={(e) => setForm({ ...form, reading_time: Number(e.target.value) })} className="input-field" /></div>
                  <div><label className="block text-sm text-gray-300 mb-2">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })} className="input-field"><option value="draft">Draft</option><option value="published">Published</option></select></div>
                </div>
                <div><label className="block text-sm text-gray-300 mb-2">Cover Image</label>
                  <FileUpload
                    folder="blog/covers"
                    label="Upload cover image"
                    accept=".jpg,.jpeg,.png,.webp,.svg"
                    currentUrl={form.cover_image_url || null}
                    showPreview
                    onUploaded={(url) => setForm({ ...form, cover_image_url: url })}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded accent-brand-500" /> Featured</label>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCatForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowCatForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-strong rounded-3xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-semibold text-white">Categories</h2><button onClick={() => setShowCatForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button></div>
              <div className="space-y-2 mb-4">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg glass">
                    <span className="text-sm text-white">{c.name}</span>
                    <button onClick={async () => { await supabase.from('blog_categories').delete().eq('id', c.id); load(); }} className="text-gray-500 hover:text-danger-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                {categories.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No categories yet.</p>}
              </div>
              <form onSubmit={addCategory} className="flex gap-2">
                <input required value={catName} onChange={(e) => setCatName(e.target.value)} className="input-field" placeholder="Category name" />
                <button type="submit" className="btn-primary shrink-0"><Plus className="w-4 h-4" /></button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
