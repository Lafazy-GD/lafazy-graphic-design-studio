import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, File as FileIcon, Trash2, Search, HardDrive, X, ImageIcon, Video, FileText, Archive } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface StorageItem {
  name: string;
  id: string;
  size: number;
  metadata: { mimetype?: string; size?: number };
  publicUrl: string;
}

const FOLDERS = [
  { name: 'portfolio/covers', label: 'Portfolio Covers', icon: ImageIcon },
  { name: 'portfolio/gallery', label: 'Portfolio Gallery', icon: ImageIcon },
  { name: 'portfolio/case-studies', label: 'Case Studies', icon: FileText },
  { name: 'blog/covers', label: 'Blog Covers', icon: ImageIcon },
  { name: 'downloads', label: 'Downloads', icon: FileText },
  { name: 'jobs/attachments', label: 'Job Attachments', icon: Archive },
  { name: 'attachments/contact', label: 'Contact Attachments', icon: FileText },
  { name: 'attachments/visitors', label: 'Visitor Attachments', icon: FileText },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext)) return ImageIcon;
  if (['mp4', 'mov'].includes(ext)) return Video;
  if (['pdf', 'docx'].includes(ext)) return FileText;
  if (['zip', 'ai', 'psd'].includes(ext)) return Archive;
  return FileIcon;
}

export function AdminStorage() {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [activeFolder, setActiveFolder] = useState(FOLDERS[0].name);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<StorageItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from('studio-uploads').list(activeFolder, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) { setItems([]); setLoading(false); return; }
    const mapped: StorageItem[] = (data ?? []).map((item) => {
      const path = `${activeFolder}/${item.name}`;
      const { data: urlData } = supabase.storage.from('studio-uploads').getPublicUrl(path);
      return {
        name: item.name,
        id: item.id,
        size: item.metadata?.size ?? 0,
        metadata: item.metadata ?? {},
        publicUrl: urlData.publicUrl,
      };
    });
    setItems(mapped);
    setLoading(false);
  }, [activeFolder]);

  useEffect(() => { load(); }, [load]);

  const remove = async (item: StorageItem) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    const path = `${activeFolder}/${item.name}`;
    await supabase.storage.from('studio-uploads').remove([path]);
    setItems(items.filter((i) => i.name !== item.name));
  };

  const filtered = items.filter((i) => !query || i.name.toLowerCase().includes(query.toLowerCase()));
  const totalSize = items.reduce((s, i) => s + i.size, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><HardDrive className="w-6 h-6 text-brand-400" /> File Storage</h1>
          <p className="text-gray-400 mt-1">Browse and manage uploaded files in Supabase Storage.</p>
        </div>
        <div className="glass rounded-xl px-4 py-2 text-sm text-gray-400">
          {items.length} files · {formatSize(totalSize)}
        </div>
      </div>

      {/* Folder tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {FOLDERS.map((f) => (
          <button
            key={f.name}
            onClick={() => setActiveFolder(f.name)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all ${
              activeFolder === f.name ? 'gradient-brand text-white' : 'glass text-gray-300 hover:text-white'
            }`}
          >
            <f.icon className="w-4 h-4" /> {f.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files..." className="input-field pl-11" />
      </div>

      {/* File grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item, i) => {
            const Icon = getFileIcon(item.name);
            const isImage = /\.(jpg|jpeg|png|webp|svg)$/i.test(item.name);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card p-4 group"
              >
                <div className="aspect-square rounded-xl overflow-hidden glass mb-3 cursor-pointer" onClick={() => setPreview(item)}>
                  {isImage ? (
                    <img src={item.publicUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-500/5">
                      <Icon className="w-10 h-10 text-brand-400/60" />
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatSize(item.size)}</p>
                  </div>
                  <button onClick={() => remove(item)} className="text-gray-500 hover:text-danger-400 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Folder className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-gray-400">No files in this folder yet.</p>
        </div>
      )}

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setPreview(null)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-strong rounded-3xl p-6 max-w-3xl w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium truncate">{preview.name}</h3>
                <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="rounded-2xl overflow-hidden glass max-h-[60vh] flex items-center justify-center">
                {/\.(jpg|jpeg|png|webp|svg)$/i.test(preview.name) ? (
                  <img src={preview.publicUrl} alt={preview.name} className="max-h-[60vh] w-auto object-contain" />
                ) : /\.(mp4|mov)$/i.test(preview.name) ? (
                  <video src={preview.publicUrl} controls className="max-h-[60vh] w-auto" />
                ) : (
                  <div className="p-12 text-center">
                    <FileText className="w-16 h-16 text-brand-400/40 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Preview not available for this file type.</p>
                    <a href={preview.publicUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">Open file</a>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                <span>{formatSize(preview.size)}</span>
                <a href={preview.publicUrl} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300">Open in new tab</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
