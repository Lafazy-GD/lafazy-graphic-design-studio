/*
# Add DOCX support to storage bucket

## Overview
Updates the `studio-uploads` storage bucket to include DOCX (Microsoft Word)
as an allowed MIME type, matching the Phase 3 requirement for DOCX uploads.

## Changes
- Adds `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  to allowed_mime_types (the standard MIME type for .docx files)
- All other settings remain unchanged
*/

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
    'video/mp4', 'video/quicktime',
    'application/pdf', 'application/zip',
    'application/postscript',
    'image/vnd.adobe.photoshop',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/octet-stream'
  ]
WHERE id = 'studio-uploads';
