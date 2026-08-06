import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, File as FileIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ACCEPTED = [
  'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
  'video/mp4', 'video/quicktime',
  'application/pdf', 'application/zip',
  'application/postscript', 'image/vnd.adobe.photoshop',
  'application/octet-stream',
];

const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.mp4', '.mov', '.pdf', '.zip', '.ai', '.psd'];
const MAX_SIZE = 100 * 1024 * 1024; // 100MB

interface FileUploadProps {
  folder: string;
  onUploaded: (url: string, path: string) => void;
  label?: string;
  accept?: string;
  currentUrl?: string | null;
  showPreview?: boolean;
}

interface UploadState {
  progress: number;
  status: 'uploading' | 'done' | 'error';
  error?: string;
}

export function FileUpload({
  folder,
  onUploaded,
  label = 'Upload file',
  accept,
  currentUrl,
  showPreview = false,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [upload, setUpload] = useState<UploadState | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (file: File): string | null => {
    if (file.size > MAX_SIZE) return 'File exceeds 100MB limit';
    const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase();
    if (!EXTENSIONS.includes(ext)) return 'File type not supported';
    return null;
  };

  const doUpload = useCallback(async (file: File) => {
    const validationError = validate(file);
    if (validationError) {
      setUpload({ progress: 0, status: 'error', error: validationError });
      return;
    }

    setFileName(file.name);
    setUpload({ progress: 0, status: 'uploading' });

    const ext = file.name.split('.').pop() ?? 'bin';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `${folder}/${safeName}`;

    const { data, error } = await supabase.storage
      .from('studio-uploads')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      setUpload({ progress: 0, status: 'error', error: error.message });
      return;
    }

    const { data: urlData } = supabase.storage.from('studio-uploads').getPublicUrl(data.path);

    setUpload({ progress: 100, status: 'done' });
    onUploaded(urlData.publicUrl, data.path);
  }, [folder, onUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) doUpload(file);
  }, [doUpload]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) doUpload(file);
  };

  const isImage = (url: string | null | undefined) =>
    url && /\.(jpg|jpeg|png|webp|svg)$/i.test(url);

  const isVideo = (url: string | null | undefined) =>
    url && /\.(mp4|mov)$/i.test(url);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept ?? EXTENSIONS.join(',')}
        onChange={handleSelect}
        className="hidden"
      />

      {/* Current file preview */}
      {currentUrl && !upload && (
        <div className="mb-3 glass rounded-xl p-3 flex items-center gap-3">
          {showPreview && isImage(currentUrl) ? (
            <img src={currentUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
          ) : showPreview && isVideo(currentUrl) ? (
            <video src={currentUrl} className="w-12 h-12 rounded-lg object-cover" muted />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <FileIcon className="w-5 h-5 text-brand-400" />
            </div>
          )}
          <span className="text-sm text-gray-300 truncate flex-1">
            {currentUrl.split('/').pop()}
          </span>
          <button
            type="button"
            onClick={async () => {
              const path = currentUrl.split('/studio-uploads/')[1];
              if (path) await supabase.storage.from('studio-uploads').remove([path]);
              onUploaded('', '');
            }}
            className="text-gray-400 hover:text-danger-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragOver ? 'border-brand-400 bg-brand-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
        }`}
      >
        <AnimatePresence mode="wait">
          {upload?.status === 'uploading' && (
            <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Loader2 className="w-8 h-8 text-brand-400 mx-auto mb-3 animate-spin" />
              <p className="text-sm text-gray-300 truncate max-w-xs mx-auto">{fileName}</p>
              <div className="mt-3 h-1.5 rounded-full bg-ink-700 overflow-hidden max-w-xs mx-auto">
                <div className="h-full gradient-brand rounded-full transition-all" style={{ width: `${upload.progress}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">Uploading...</p>
            </motion.div>
          )}

          {upload?.status === 'done' && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <p className="text-sm text-gray-300 truncate max-w-xs mx-auto">{fileName}</p>
              <p className="text-xs text-green-400 mt-1">Upload complete</p>
            </motion.div>
          )}

          {upload?.status === 'error' && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AlertCircle className="w-8 h-8 text-danger-400 mx-auto mb-3" />
              <p className="text-sm text-danger-400">{upload.error}</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setUpload(null); }}
                className="text-xs text-gray-400 hover:text-white mt-2"
              >
                Try again
              </button>
            </motion.div>
          )}

          {!upload && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <UploadCloud className="w-8 h-8 text-gray-500 mx-auto mb-3" />
              <p className="text-sm text-gray-300">{label}</p>
              <p className="text-xs text-gray-500 mt-1">Drag & drop or click to browse</p>
              <p className="text-xs text-gray-600 mt-2">JPG, PNG, WEBP, SVG, MP4, MOV, PDF, ZIP, AI, PSD — up to 100MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
