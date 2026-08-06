import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Save, Trash2, LayoutGrid, List, GripVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { FileUpload } from '@/components/FileUpload';
import type { JobApplication } from '@/lib/types';

const STATUSES = ['applied', 'interview', 'offer', 'rejected', 'accepted'] as const;
const STATUS_COLORS: Record<string, string> = {
  applied: 'bg-brand-500/20 border-brand-500/30 text-brand-300',
  interview: 'bg-accent-500/20 border-accent-500/30 text-accent-300',
  offer: 'bg-green-500/20 border-green-500/30 text-green-300',
  rejected: 'bg-danger-500/20 border-danger-500/30 text-danger-300',
  accepted: 'bg-warning-500/20 border-warning-500/30 text-warning-300',
};

const EMPTY = {
  company: '', role: '', location: '', salary: '', platform: '',
  application_date: '', status: 'applied' as JobApplication['status'],
  interview_stage: '', follow_up_date: '', notes: '', attachment_url: '',
};

export function AdminJobs() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('job_applications').select('*').order('created_at', { ascending: false });
    if (data) setJobs(data);
  };

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (j: JobApplication) => {
    setEditing(j);
    setForm({ company: j.company, role: j.role, location: j.location ?? '', salary: j.salary ?? '', platform: j.platform ?? '', application_date: j.application_date ?? '', status: j.status, interview_stage: j.interview_stage ?? '', follow_up_date: j.follow_up_date ?? '', notes: j.notes ?? '', attachment_url: j.attachment_url ?? '' });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, location: form.location || null, salary: form.salary || null, platform: form.platform || null, application_date: form.application_date || null, interview_stage: form.interview_stage || null, follow_up_date: form.follow_up_date || null, notes: form.notes || null, attachment_url: form.attachment_url || null };
    if (editing) await supabase.from('job_applications').update(payload).eq('id', editing.id);
    else await supabase.from('job_applications').insert(payload);
    setSaving(false); setShowForm(false); load();
  };

  const remove = async (j: JobApplication) => {
    if (!confirm(`Delete application for ${j.company}?`)) return;
    await supabase.from('job_applications').delete().eq('id', j.id);
    load();
  };

  const onDrop = async (status: string) => {
    if (!dragId) return;
    await supabase.from('job_applications').update({ status }).eq('id', dragId);
    setDragId(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Application Tracker</h1>
          <p className="text-gray-400 mt-1">Track your remote job applications and interviews.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex glass rounded-xl p-1">
            <button onClick={() => setView('kanban')} className={`p-2 rounded-lg ${view === 'kanban' ? 'bg-white/10 text-white' : 'text-gray-400'}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setView('table')} className={`p-2 rounded-lg ${view === 'table' ? 'bg-white/10 text-white' : 'text-gray-400'}`}><List className="w-4 h-4" /></button>
          </div>
          <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> Add Application</button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATUSES.map((status) => {
            const items = jobs.filter((j) => j.status === status);
            return (
              <div key={status} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(status)} className="glass rounded-2xl p-4 min-h-[200px]">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[status]}`}>{status}</span>
                  <span className="text-xs text-gray-500">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((j) => (
                    <div key={j.id} draggable onDragStart={() => setDragId(j.id)} onClick={() => openEdit(j)} className="glass-card p-3 cursor-pointer hover:border-white/20 transition-all">
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-3 h-3 text-gray-600 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-white truncate">{j.role}</div>
                          <div className="text-xs text-gray-400 truncate">{j.company}</div>
                          {j.location && <div className="text-xs text-gray-500 mt-1">{j.location}</div>}
                          {j.salary && <div className="text-xs text-green-400 mt-0.5">{j.salary}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && <div className="text-center py-8 text-xs text-gray-600">Drag cards here</div>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                <th className="p-4 font-medium">Company</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Salary</th>
                <th className="p-4 font-medium">Platform</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white">{j.company}</td>
                  <td className="p-4 text-gray-300">{j.role}</td>
                  <td className="p-4 text-gray-400">{j.location ?? '—'}</td>
                  <td className="p-4 text-gray-400">{j.salary ?? '—'}</td>
                  <td className="p-4 text-gray-400">{j.platform ?? '—'}</td>
                  <td className="p-4 text-gray-400">{j.application_date ? new Date(j.application_date).toLocaleDateString() : '—'}</td>
                  <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs border ${STATUS_COLORS[j.status]}`}>{j.status}</span></td>
                  <td className="p-4">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(j)} className="text-gray-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                      <button onClick={() => remove(j)} className="text-gray-400 hover:text-danger-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {jobs.length === 0 && <div className="p-12 text-center text-gray-500">No applications yet.</div>}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8 overflow-y-auto" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-strong rounded-3xl w-full max-w-2xl my-8">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">{editing ? 'Edit Application' : 'New Application'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={save} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-300 mb-2">Company *</label><input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field" /></div>
                  <div><label className="block text-sm text-gray-300 mb-2">Role *</label><input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className="block text-sm text-gray-300 mb-2">Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" /></div>
                  <div><label className="block text-sm text-gray-300 mb-2">Salary</label><input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="input-field" /></div>
                  <div><label className="block text-sm text-gray-300 mb-2">Platform</label><input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="input-field" placeholder="LinkedIn, Upwork..." /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-300 mb-2">Application Date</label><input type="date" value={form.application_date} onChange={(e) => setForm({ ...form, application_date: e.target.value })} className="input-field" /></div>
                  <div><label className="block text-sm text-gray-300 mb-2">Follow-up Date</label><input type="date" value={form.follow_up_date} onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })} className="input-field" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-300 mb-2">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as JobApplication['status'] })} className="input-field">{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
                  <div><label className="block text-sm text-gray-300 mb-2">Interview Stage</label><input value={form.interview_stage} onChange={(e) => setForm({ ...form, interview_stage: e.target.value })} className="input-field" placeholder="HR screen, technical..." /></div>
                </div>
                <div><label className="block text-sm text-gray-300 mb-2">Attachment</label>
                  <FileUpload
                    folder="jobs/attachments"
                    label="Upload attachment"
                    accept=".pdf,.zip,.docx"
                    currentUrl={form.attachment_url || null}
                    onUploaded={(url) => setForm({ ...form, attachment_url: url })}
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
