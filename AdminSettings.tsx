import { useEffect, useState } from 'react';
import { Save, Settings as SettingsIcon, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Setting } from '@/lib/types';

const SETTING_KEYS = [
  { key: 'site_name', label: 'Site Name' },
  { key: 'owner_name', label: 'Owner Name' },
  { key: 'tagline', label: 'Tagline' },
  { key: 'email', label: 'Contact Email' },
  { key: 'facebook', label: 'Facebook URL' },
  { key: 'tiktok', label: 'TikTok URL' },
  { key: 'whatsapp', label: 'WhatsApp URL' },
];

export function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('settings').select('*');
    if (data) {
      const map: Record<string, string> = {};
      (data as Setting[]).forEach((s) => { map[s.key] = s.value ?? ''; });
      setSettings(map);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    for (const { key } of SETTING_KEYS) {
      const value = settings[key] ?? '';
      const existing = await supabase.from('settings').select('id').eq('key', key).maybeSingle();
      if (existing.data) {
        await supabase.from('settings').update({ value }).eq('id', existing.data.id);
      } else {
        await supabase.from('settings').insert({ key, value });
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><SettingsIcon className="w-6 h-6 text-brand-400" /> Site Settings</h1>
        <p className="text-gray-400 mt-1">Manage your site-wide configuration and social links.</p>
      </div>

      <form onSubmit={save} className="glass-card p-6 sm:p-8 max-w-2xl space-y-5">
        {SETTING_KEYS.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm text-gray-300 mb-2">{label}</label>
            <input value={settings[key] ?? ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} className="input-field" />
          </div>
        ))}
        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving} className="btn-primary"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}</button>
          {saved && <span className="text-sm text-green-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Saved!</span>}
        </div>
      </form>
    </div>
  );
}
