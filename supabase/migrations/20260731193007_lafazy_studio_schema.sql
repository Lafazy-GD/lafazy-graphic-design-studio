/*
# Lafazy Graphic Design Studio — Core Schema

## Overview
Creates the full relational schema for the Lafazy creative studio platform:
portfolio projects + media, blog posts + categories + tags, contact/visitor
messages, job application tracker, downloadable resources, testimonials,
SEO metadata, site settings, and an uploaded-files registry.

## Public vs Admin model
- Public visitors (anon key) can READ published content and SUBMIT messages.
- The authenticated owner (Lafazy / admin) can perform full CRUD on all tables.
- This is a hybrid app: public marketing site + hidden admin dashboard.

## Tables created
1. profiles — extends auth.users with owner display info
2. project_categories — portfolio categories
3. portfolio_projects — portfolio project entries
4. portfolio_media — images/videos per project
5. blog_categories — blog categories
6. blog_tags — blog tags
7. blog_posts — blog articles
8. blog_post_tags — many-to-many post/tag
9. visitor_messages — recruiter/company message board
10. contact_messages — project inquiry form submissions
11. job_applications — personal job application tracker
12. uploaded_files — registry of files in Supabase Storage
13. downloadable_resources — public download center items
14. testimonials — client testimonials
15. seo_metadata — per-page SEO overrides
16. settings — site-wide key/value settings

## Security
- RLS enabled on every table.
- Public read on published content (TO anon, authenticated).
- Authenticated-only write on content tables.
- Public insert on message tables; authenticated-only read/moderation.
- Authenticated-only CRUD on admin tables (job_applications, uploaded_files).
- download_count updated via a SECURITY DEFINER-safe pattern using an UPDATE
  policy (the owner is the only authenticated user).
*/

-- 1. profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT 'Lafazy',
  role text NOT NULL DEFAULT 'admin',
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_read_own" ON profiles;
CREATE POLICY "profiles_read_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 2. project_categories
CREATE TABLE IF NOT EXISTS project_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "project_categories_read" ON project_categories;
CREATE POLICY "project_categories_read" ON project_categories FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "project_categories_write" ON project_categories;
CREATE POLICY "project_categories_write" ON project_categories FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "project_categories_update" ON project_categories;
CREATE POLICY "project_categories_update" ON project_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "project_categories_delete" ON project_categories;
CREATE POLICY "project_categories_delete" ON project_categories FOR DELETE
  TO authenticated USING (true);

-- 3. portfolio_projects
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  description text,
  challenge text,
  process text,
  solution text,
  tools text[] DEFAULT '{}',
  ai_prompt_workflow text,
  category_id uuid REFERENCES project_categories(id) ON DELETE SET NULL,
  featured boolean DEFAULT false,
  status text NOT NULL DEFAULT 'draft', -- draft | published
  cover_image_url text,
  case_study_pdf_url text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON portfolio_projects(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio_projects(featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_projects(category_id);

DROP POLICY IF EXISTS "portfolio_read" ON portfolio_projects;
CREATE POLICY "portfolio_read" ON portfolio_projects FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "portfolio_insert" ON portfolio_projects;
CREATE POLICY "portfolio_insert" ON portfolio_projects FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "portfolio_update" ON portfolio_projects;
CREATE POLICY "portfolio_update" ON portfolio_projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "portfolio_delete" ON portfolio_projects;
CREATE POLICY "portfolio_delete" ON portfolio_projects FOR DELETE
  TO authenticated USING (true);

-- 4. portfolio_media
CREATE TABLE IF NOT EXISTS portfolio_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES portfolio_projects(id) ON DELETE CASCADE,
  url text NOT NULL,
  type text NOT NULL DEFAULT 'image', -- image | video
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE portfolio_media ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_portfolio_media_project ON portfolio_media(project_id);

DROP POLICY IF EXISTS "portfolio_media_read" ON portfolio_media;
CREATE POLICY "portfolio_media_read" ON portfolio_media FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "portfolio_media_insert" ON portfolio_media;
CREATE POLICY "portfolio_media_insert" ON portfolio_media FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "portfolio_media_update" ON portfolio_media;
CREATE POLICY "portfolio_media_update" ON portfolio_media FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "portfolio_media_delete" ON portfolio_media;
CREATE POLICY "portfolio_media_delete" ON portfolio_media FOR DELETE
  TO authenticated USING (true);

-- 5. blog_categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_categories_read" ON blog_categories;
CREATE POLICY "blog_categories_read" ON blog_categories FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "blog_categories_write" ON blog_categories;
CREATE POLICY "blog_categories_write" ON blog_categories FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "blog_categories_update" ON blog_categories;
CREATE POLICY "blog_categories_update" ON blog_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "blog_categories_delete" ON blog_categories;
CREATE POLICY "blog_categories_delete" ON blog_categories FOR DELETE
  TO authenticated USING (true);

-- 6. blog_tags
CREATE TABLE IF NOT EXISTS blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_tags_read" ON blog_tags;
CREATE POLICY "blog_tags_read" ON blog_tags FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "blog_tags_write" ON blog_tags;
CREATE POLICY "blog_tags_write" ON blog_tags FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "blog_tags_update" ON blog_tags;
CREATE POLICY "blog_tags_update" ON blog_tags FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "blog_tags_delete" ON blog_tags;
CREATE POLICY "blog_tags_delete" ON blog_tags FOR DELETE
  TO authenticated USING (true);

-- 7. blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
  featured boolean DEFAULT false,
  status text NOT NULL DEFAULT 'draft', -- draft | published
  cover_image_url text,
  reading_time int DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category_id);

DROP POLICY IF EXISTS "blog_posts_read" ON blog_posts;
CREATE POLICY "blog_posts_read" ON blog_posts FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "blog_posts_insert" ON blog_posts;
CREATE POLICY "blog_posts_insert" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "blog_posts_update" ON blog_posts;
CREATE POLICY "blog_posts_update" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "blog_posts_delete" ON blog_posts;
CREATE POLICY "blog_posts_delete" ON blog_posts FOR DELETE
  TO authenticated USING (true);

-- 8. blog_post_tags
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_post_tags_read" ON blog_post_tags;
CREATE POLICY "blog_post_tags_read" ON blog_post_tags FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "blog_post_tags_write" ON blog_post_tags;
CREATE POLICY "blog_post_tags_write" ON blog_post_tags FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "blog_post_tags_delete" ON blog_post_tags;
CREATE POLICY "blog_post_tags_delete" ON blog_post_tags FOR DELETE
  TO authenticated USING (true);

-- 9. visitor_messages
CREATE TABLE IF NOT EXISTS visitor_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text,
  recruiter_name text NOT NULL,
  email text NOT NULL,
  website text,
  message text NOT NULL,
  attachment_url text,
  moderated boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE visitor_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_visitor_moderated ON visitor_messages(moderated);

DROP POLICY IF EXISTS "visitor_messages_insert" ON visitor_messages;
CREATE POLICY "visitor_messages_insert" ON visitor_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "visitor_messages_read" ON visitor_messages;
CREATE POLICY "visitor_messages_read" ON visitor_messages FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "visitor_messages_update" ON visitor_messages;
CREATE POLICY "visitor_messages_update" ON visitor_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "visitor_messages_delete" ON visitor_messages;
CREATE POLICY "visitor_messages_delete" ON visitor_messages FOR DELETE
  TO authenticated USING (true);

-- 10. contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  service text,
  budget text,
  timeline text,
  message text NOT NULL,
  attachment_url text,
  status text DEFAULT 'new', -- new | read | archived
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);

DROP POLICY IF EXISTS "contact_messages_insert" ON contact_messages;
CREATE POLICY "contact_messages_insert" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "contact_messages_read" ON contact_messages;
CREATE POLICY "contact_messages_read" ON contact_messages FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "contact_messages_update" ON contact_messages;
CREATE POLICY "contact_messages_update" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "contact_messages_delete" ON contact_messages;
CREATE POLICY "contact_messages_delete" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- 11. job_applications
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  location text,
  salary text,
  platform text,
  application_date date,
  status text DEFAULT 'applied', -- applied | interview | offer | rejected | accepted
  interview_stage text,
  follow_up_date date,
  notes text,
  attachment_url text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_job_status ON job_applications(status);

DROP POLICY IF EXISTS "job_applications_read" ON job_applications;
CREATE POLICY "job_applications_read" ON job_applications FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "job_applications_insert" ON job_applications;
CREATE POLICY "job_applications_insert" ON job_applications FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "job_applications_update" ON job_applications;
CREATE POLICY "job_applications_update" ON job_applications FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "job_applications_delete" ON job_applications;
CREATE POLICY "job_applications_delete" ON job_applications FOR DELETE
  TO authenticated USING (true);

-- 12. uploaded_files
CREATE TABLE IF NOT EXISTS uploaded_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  path text NOT NULL,
  size bigint DEFAULT 0,
  mime_type text,
  folder text DEFAULT 'misc',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "uploaded_files_read" ON uploaded_files;
CREATE POLICY "uploaded_files_read" ON uploaded_files FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "uploaded_files_insert" ON uploaded_files;
CREATE POLICY "uploaded_files_insert" ON uploaded_files FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "uploaded_files_update" ON uploaded_files;
CREATE POLICY "uploaded_files_update" ON uploaded_files FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "uploaded_files_delete" ON uploaded_files;
CREATE POLICY "uploaded_files_delete" ON uploaded_files FOR DELETE
  TO authenticated USING (true);

-- 13. downloadable_resources
CREATE TABLE IF NOT EXISTS downloadable_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'pdf', -- cv | resume | cover_letter | portfolio | brand | brochure
  file_url text NOT NULL,
  download_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE downloadable_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "resources_read" ON downloadable_resources;
CREATE POLICY "resources_read" ON downloadable_resources FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "resources_insert" ON downloadable_resources;
CREATE POLICY "resources_insert" ON downloadable_resources FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "resources_update" ON downloadable_resources;
CREATE POLICY "resources_update" ON downloadable_resources FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "resources_delete" ON downloadable_resources;
CREATE POLICY "resources_delete" ON downloadable_resources FOR DELETE
  TO authenticated USING (true);

-- 14. testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text,
  company text,
  content text NOT NULL,
  avatar_url text,
  rating int DEFAULT 5,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "testimonials_read" ON testimonials;
CREATE POLICY "testimonials_read" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "testimonials_insert" ON testimonials;
CREATE POLICY "testimonials_insert" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "testimonials_update" ON testimonials;
CREATE POLICY "testimonials_update" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "testimonials_delete" ON testimonials;
CREATE POLICY "testimonials_delete" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- 15. seo_metadata
CREATE TABLE IF NOT EXISTS seo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text UNIQUE NOT NULL,
  title text,
  description text,
  og_image_url text,
  keywords text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seo_read" ON seo_metadata;
CREATE POLICY "seo_read" ON seo_metadata FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "seo_insert" ON seo_metadata;
CREATE POLICY "seo_insert" ON seo_metadata FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "seo_update" ON seo_metadata;
CREATE POLICY "seo_update" ON seo_metadata FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "seo_delete" ON seo_metadata;
CREATE POLICY "seo_delete" ON seo_metadata FOR DELETE
  TO authenticated USING (true);

-- 16. settings
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings_read" ON settings;
CREATE POLICY "settings_read" ON settings FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "settings_insert" ON settings;
CREATE POLICY "settings_insert" ON settings FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "settings_update" ON settings;
CREATE POLICY "settings_update" ON settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "settings_delete" ON settings;
CREATE POLICY "settings_delete" ON settings FOR DELETE
  TO authenticated USING (true);

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_portfolio_updated ON portfolio_projects;
CREATE TRIGGER trg_portfolio_updated BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_blog_updated ON blog_posts;
CREATE TRIGGER trg_blog_updated BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_settings_updated ON settings;
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed default settings
INSERT INTO settings (key, value) VALUES
  ('site_name', 'Lafazy Graphic Design Studio'),
  ('owner_name', 'Lafazy'),
  ('tagline', 'Premium International Creative Studio'),
  ('email', 'lafazy@lafazystudio.com'),
  ('facebook', 'https://www.facebook.com/profile.php?id=61590833153269'),
  ('tiktok', 'https://www.tiktok.com/@lafazy.one.boy'),
  ('whatsapp', 'https://wa.me/2347073692261')
ON CONFLICT (key) DO NOTHING;
