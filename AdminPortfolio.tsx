import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Star, Eye, EyeOff, Save, ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { FileUpload } from '@/components/FileUpload';
import type { PortfolioProject, ProjectCategory, PortfolioMedia } from '@/lib/types';

const EMPTY = {
  title: '', slug: '', excerpt: '', description: '', challenge: '', process: '',
  solution: '', problem: '', research: '', strategy: '', design_process: '',
  results: '', before_after: '', deliverables: '', timeline: '', client_outcome: '',
  tools: [] as string[], ai_prompt_workflow: '', category_id: '',
  featured: false, status: 'draft' as 'draft' | 'published', cover_image_url: '', case_study_pdf_url: '',
};

export function AdminPortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [editing, setEditing] = useState<PortfolioProject | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [toolsInput, setToolsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState<PortfolioMedia[]>([]);
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('portfolio_projects').select('*, category:project_categories(*)').order('created_at', { ascending: false }),
      supabase.from('project_categories').select('*').order('name'),
    ]);
    if (p) setProjects(p);
    if (c) setCategories(c);
  };

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setToolsInput('');
    setMedia([]);
    setShowForm(true);
  };

  const openEdit = async (p: PortfolioProject) => {
    setEditing(p);
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt ?? '', description: p.description ?? '',
      challenge: p.challenge ?? '', process: p.process ?? '', solution: p.solution ?? '',
      problem: p.problem ?? '', research: p.research ?? '', strategy: p.strategy ?? '',
      design_process: p.design_process ?? '', results: p.results ?? '', before_after: p.before_after ?? '',
      deliverables: p.deliverables ?? '', timeline: p.timeline ?? '', client_outcome: p.client_outcome ?? '',
      tools: p.tools ?? [], ai_prompt_workflow: p.ai_prompt_workflow ?? '',
      category_id: p.category_id ?? '', featured: p.featured, status: p.status as 'draft' | 'published',
      cover_image_url: p.cover_image_url ?? '', case_study_pdf_url: p.case_study_pdf_url ?? '',
    });
    setToolsInput((p.tools ?? []).join(', '));
    const { data: mediaData } = await supabase.from('portfolio_media').select('*').eq('project_id', p.id).order('sort_order');
    setMedia(mediaData ?? []);
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const tools = toolsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const payload = {
      ...form,
      tools,
      slug,
      category_id: form.category_id || null,
      excerpt: form.excerpt || null,
      description: form.description || null,
      challenge: form.challenge || null,
      process: form.process || null,
      solution: form.solution || null,
      ai_prompt_workflow: form.ai_prompt_workflow || null,
      cover_image_url: form.cover_image_url || null,
      case_study_pdf_url: form.case_study_pdf_url || null,
    };

    let projectId = editing?.id;

    if (editing) {
      await supabase.from('portfolio_projects').update(payload).eq('id', editing.id);
    } else {
      const { data: inserted } = await supabase.from('portfolio_projects').insert(payload).select('id').single();
      projectId = inserted?.id;
    }

    if (projectId && media.length > 0) {
      const existingIds = media.filter((m) => m.id).map((m) => m.id);
      if (existingIds.length > 0) {
        await supabase.from('portfolio_media').delete().eq('project_id', projectId).not('id', 'in', `(${existingIds.join(',')})`);
      } else {
        await supabase.from('portfolio_media').delete().eq('project_id', projectId);
      }
      const newMedia = media.filter((m) => !m.id).map((m, i) => ({ project_id: projectId, url: m.url, type: m.type, sort_order: i }));
      if (newMedia.length > 0) await supabase.from('portfolio_media').insert(newMedia);
    }

    setSaving(false);
    setShowForm(false);
    setMedia([]);
    load();
  };

  const remove = async (p: PortfolioProject) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    await supabase.from('portfolio_projects').delete().eq('id', p.id);
    load();
  };

  const togglePublished = async (p: PortfolioProject) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    await supabase.from('portfolio_projects').update({ status: newStatus }).eq('id', p.id);
    load();
  };

  const toggleFeatured = async (p: PortfolioProject) => {
    await supabase.from('portfolio_projects').update({ featured: !p.featured }).eq('id', p.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio Manager</h1>
          <p className="text-gray-400 mt-1">Create, edit, and manage your portfolio projects.</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> New Project</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p) => (
          <div key={p.id} className="glass-card p-5 group">
            <div className="aspect-[4/3] rounded-xl overflow-hidden glass mb-4 relative">
              {p.cover_image_url ? (
                <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-brand opacity-20" />
              )}
              <div className="absolute top-2 right-2 flex gap-1.5">
                {p.featured && <span className="badge bg-warning-500/20 border-warning-500/30 text-warning-400"><Star className="w-3 h-3" /></span>}
                <span className={`badge ${p.status === 'published' ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {p.status}
                </span>
              </div>
            </div>
            <h3 className="text-white font-medium mb-1">{p.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2 mb-3">{p.excerpt ?? 'No excerpt'}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(p)} className="flex-1 btn-ghost text-sm py-2"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
              <button onClick={() => togglePublished(p)} className="w-9 h-9 rounded-lg glass hover:bg-white/10 flex items-center justify-center text-gray-300" title={p.status === 'published' ? 'Unpublish' : 'Publish'}>
                {p.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => toggleFeatured(p)} className="w-9 h-9 rounded-lg glass hover:bg-white/10 flex items-center justify-center text-gray-300" title="Toggle featured">
                <Star className={`w-4 h-4 ${p.featured ? 'fill-warning-400 text-warning-400' : ''}`} />
              </button>
              <button onClick={() => remove(p)} className="w-9 h-9 rounded-lg glass hover:bg-danger-500/10 hover:text-danger-400 flex items-center justify-center text-gray-300" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-400">No projects yet. Click "New Project" to create your first one.</p>
        </div>
      )}

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-strong rounded-3xl w-full max-w-3xl my-8">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">{editing ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={save} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Title *</label>
                    <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Slug</label>
                    <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" placeholder="auto-generated" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Excerpt</label>
                  <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="input-field resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Challenge</label>
                    <textarea value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} rows={2} className="input-field resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Process</label>
                    <textarea value={form.process} onChange={(e) => setForm({ ...form, process: e.target.value })} rows={2} className="input-field resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Solution</label>
                    <textarea value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} rows={2} className="input-field resize-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Tools (comma-separated)</label>
                    <input value={toolsInput} onChange={(e) => setToolsInput(e.target.value)} className="input-field" placeholder="Figma, Illustrator, Photoshop" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Category</label>
                    <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field">
                      <option value="">None</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">AI Prompt Workflow</label>
                  <textarea value={form.ai_prompt_workflow} onChange={(e) => setForm({ ...form, ai_prompt_workflow: e.target.value })} rows={3} className="input-field resize-none font-mono text-sm" />
                </div>

                {/* Case Study Fields */}
                <div className="pt-2 border-t border-white/10">
                  <p className="text-sm font-semibold text-white mb-3">Case Study Details</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Problem</label>
                    <textarea value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} rows={2} className="input-field resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Research</label>
                    <textarea value={form.research} onChange={(e) => setForm({ ...form, research: e.target.value })} rows={2} className="input-field resize-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Strategy</label>
                    <textarea value={form.strategy} onChange={(e) => setForm({ ...form, strategy: e.target.value })} rows={2} className="input-field resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Design Process</label>
                    <textarea value={form.design_process} onChange={(e) => setForm({ ...form, design_process: e.target.value })} rows={2} className="input-field resize-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Results</label>
                    <textarea value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} rows={2} className="input-field resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Before / After</label>
                    <textarea value={form.before_after} onChange={(e) => setForm({ ...form, before_after: e.target.value })} rows={2} className="input-field resize-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Deliverables</label>
                    <textarea value={form.deliverables} onChange={(e) => setForm({ ...form, deliverables: e.target.value })} rows={2} className="input-field resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Timeline</label>
                    <input value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} className="input-field" placeholder="e.g. 4 weeks" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Client Outcome</label>
                  <textarea value={form.client_outcome} onChange={(e) => setForm({ ...form, client_outcome: e.target.value })} rows={2} className="input-field resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Cover Image</label>
                    <FileUpload
                      folder="portfolio/covers"
                      label="Upload cover image"
                      accept=".jpg,.jpeg,.png,.webp,.svg"
                      currentUrl={form.cover_image_url || null}
                      showPreview
                      onUploaded={(url) => setForm({ ...form, cover_image_url: url })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Case Study PDF</label>
                    <FileUpload
                      folder="portfolio/case-studies"
                      label="Upload case study PDF"
                      accept=".pdf"
                      currentUrl={form.case_study_pdf_url || null}
                      onUploaded={(url) => setForm({ ...form, case_study_pdf_url: url })}
                    />
                  </div>
                </div>

                {/* Gallery media */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Gallery Media</label>
                  <div className="flex gap-2 mb-3">
                    <button type="button" onClick={() => setNewMediaType('image')} className={`px-3 py-1.5 rounded-lg text-sm ${newMediaType === 'image' ? 'gradient-brand text-white' : 'glass text-gray-300'}`}>Image</button>
                    <button type="button" onClick={() => setNewMediaType('video')} className={`px-3 py-1.5 rounded-lg text-sm ${newMediaType === 'video' ? 'gradient-brand text-white' : 'glass text-gray-300'}`}>Video</button>
                  </div>
                  <FileUpload
                    folder="portfolio/gallery"
                    label={`Add ${newMediaType} to gallery`}
                    accept={newMediaType === 'image' ? '.jpg,.jpeg,.png,.webp,.svg' : '.mp4,.mov'}
                    onUploaded={(url) => setMedia([...media, { id: '', project_id: editing?.id ?? '', url, type: newMediaType, sort_order: media.length, created_at: '' }])}
                  />
                  {media.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                      {media.map((m, i) => (
                        <div key={i} className="relative group aspect-square rounded-lg overflow-hidden glass">
                          {m.type === 'video' ? (
                            <video src={m.url} className="w-full h-full object-cover" muted />
                          ) : (
                            <img src={m.url} alt="" className="w-full h-full object-cover" />
                          )}
                          <button type="button" onClick={() => setMedia(media.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded accent-brand-500" />
                    Featured
                  </label>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })} className="input-field">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
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
