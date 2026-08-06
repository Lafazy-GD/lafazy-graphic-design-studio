import { useEffect, useState } from 'react';
import { Mail, Trash2, Archive, CheckCircle2, Building2, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ContactMessage, VisitorMessage } from '@/lib/types';

export function AdminContact() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  const updateStatus = async (m: ContactMessage, status: string) => {
    await supabase.from('contact_messages').update({ status }).eq('id', m.id);
    load();
  };

  const remove = async (m: ContactMessage) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contact_messages').delete().eq('id', m.id);
    load();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
        <p className="text-gray-400 mt-1">Project inquiries from your contact form.</p>
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="glass-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-medium">{m.name}</span>
                  <span className="text-sm text-gray-400">{m.email}</span>
                  {m.company && <span className="text-sm text-gray-400">· {m.company}</span>}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${m.status === 'new' ? 'bg-brand-500/20 text-brand-300' : m.status === 'read' ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-700/20 text-gray-500'}`}>{m.status}</span>
                </div>
                {m.service && <span className="badge mb-2">{m.service}</span>}
                {m.budget && <span className="badge mb-2 ml-1">{m.budget}</span>}
                {m.timeline && <span className="badge mb-2 ml-1">{m.timeline}</span>}
                <p className="text-sm text-gray-300 mt-2 leading-relaxed">{m.message}</p>
                <div className="text-xs text-gray-500 mt-2">{new Date(m.created_at).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {m.status !== 'read' && <button onClick={() => updateStatus(m, 'read')} className="w-9 h-9 rounded-lg glass hover:bg-white/10 flex items-center justify-center text-gray-300" title="Mark as read"><CheckCircle2 className="w-4 h-4" /></button>}
                {m.status !== 'archived' && <button onClick={() => updateStatus(m, 'archived')} className="w-9 h-9 rounded-lg glass hover:bg-white/10 flex items-center justify-center text-gray-300" title="Archive"><Archive className="w-4 h-4" /></button>}
                <button onClick={() => remove(m)} className="w-9 h-9 rounded-lg glass hover:bg-danger-500/10 hover:text-danger-400 flex items-center justify-center text-gray-300" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {messages.length === 0 && <div className="glass-card p-12 text-center"><Mail className="w-10 h-10 text-white/20 mx-auto mb-3" /><p className="text-gray-400">No contact messages yet.</p></div>}
    </div>
  );
}

export function AdminVisitors() {
  const [messages, setMessages] = useState<VisitorMessage[]>([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('visitor_messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  const toggleModerate = async (m: VisitorMessage) => {
    await supabase.from('visitor_messages').update({ moderated: !m.moderated }).eq('id', m.id);
    load();
  };

  const remove = async (m: VisitorMessage) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('visitor_messages').delete().eq('id', m.id);
    load();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Visitor Messages</h1>
        <p className="text-gray-400 mt-1">Messages from recruiters and companies. Moderate to show publicly.</p>
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="glass-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-white font-medium">{m.recruiter_name}</span>
                  {m.company_name && <span className="text-sm text-gray-400 flex items-center gap-1"><Building2 className="w-3 h-3" /> {m.company_name}</span>}
                  <span className="text-sm text-gray-400">{m.email}</span>
                  {m.website && <a href={m.website} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-400 flex items-center gap-1"><Globe className="w-3 h-3" /> website</a>}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${m.moderated ? 'bg-green-500/20 text-green-400' : 'bg-warning-500/20 text-warning-400'}`}>{m.moderated ? 'published' : 'pending'}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{m.message}</p>
                <div className="text-xs text-gray-500 mt-2">{new Date(m.created_at).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleModerate(m)} className="px-3 py-2 rounded-lg glass hover:bg-white/10 text-sm text-gray-300">{m.moderated ? 'Unpublish' : 'Publish'}</button>
                <button onClick={() => remove(m)} className="w-9 h-9 rounded-lg glass hover:bg-danger-500/10 hover:text-danger-400 flex items-center justify-center text-gray-300"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {messages.length === 0 && <div className="glass-card p-12 text-center"><Mail className="w-10 h-10 text-white/20 mx-auto mb-3" /><p className="text-gray-400">No visitor messages yet.</p></div>}
    </div>
  );
}
