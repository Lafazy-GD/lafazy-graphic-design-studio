/*
# Create Supabase Storage bucket for file uploads

## Overview
Creates a public storage bucket named `studio-uploads` to hold all user-uploaded
files: portfolio images/videos, blog covers, downloadable resources, job
application attachments, and contact/visitor message attachments.

## Storage bucket
- `studio-uploads` — public bucket (files are readable by anyone via signed URL
  or public URL; writes require authentication)

## Policies
- SELECT (read): public — anyone can read files (needed for public portfolio
  images, blog covers, download PDFs)
- INSERT (upload): authenticated only — only the logged-in admin can upload
- UPDATE: authenticated only
- DELETE: authenticated only

## Public uploads for contact/visitor forms
The contact and visitor message forms allow anonymous users to attach files.
To support this, INSERT is also allowed for the `anon` role but restricted to
the `attachments/` folder prefix. This lets visitors upload attachments without
being able to write to other folders.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'studio-uploads',
  'studio-uploads',
  true,
  104857600, -- 100MB
  ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
    'video/mp4', 'video/quicktime',
    'application/pdf', 'application/zip',
    'application/postscript', -- .ai
    'image/vnd.adobe.photoshop', -- .psd
    'application/octet-stream' -- fallback for .ai/.psd/.zip variants
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Read: public
DROP POLICY IF EXISTS "uploads_read_public" ON storage.objects;
CREATE POLICY "uploads_read_public"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'studio-uploads');

-- Upload: authenticated (admin) — any folder
DROP POLICY IF EXISTS "uploads_insert_auth" ON storage.objects;
CREATE POLICY "uploads_insert_auth"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'studio-uploads');

-- Upload: anon — only to attachments/ folder (for contact/visitor forms)
DROP POLICY IF EXISTS "uploads_insert_anon_attachments" ON storage.objects;
CREATE POLICY "uploads_insert_anon_attachments"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'studio-uploads' AND (storage.foldername(name))[1] = 'attachments');

-- Update: authenticated only
DROP POLICY IF EXISTS "uploads_update_auth" ON storage.objects;
CREATE POLICY "uploads_update_auth"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'studio-uploads') WITH CHECK (bucket_id = 'studio-uploads');

-- Delete: authenticated only
DROP POLICY IF EXISTS "uploads_delete_auth" ON storage.objects;
CREATE POLICY "uploads_delete_auth"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'studio-uploads');
