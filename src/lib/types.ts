export type ProjectStatus = 'draft' | 'published';

export interface Profile {
  id: string;
  full_name: string;
  role: string;
  avatar_url: string | null;
  bio: string | null;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  description: string | null;
  challenge: string | null;
  process: string | null;
  solution: string | null;
  problem: string | null;
  research: string | null;
  strategy: string | null;
  design_process: string | null;
  results: string | null;
  before_after: string | null;
  deliverables: string | null;
  timeline: string | null;
  client_outcome: string | null;
  tools: string[];
  ai_prompt_workflow: string | null;
  category_id: string | null;
  featured: boolean;
  status: ProjectStatus;
  cover_image_url: string | null;
  case_study_pdf_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: ProjectCategory | null;
}

export interface PortfolioMedia {
  id: string;
  project_id: string;
  url: string;
  type: 'image' | 'video';
  sort_order: number;
  created_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category_id: string | null;
  featured: boolean;
  status: ProjectStatus;
  cover_image_url: string | null;
  reading_time: number;
  created_at: string;
  updated_at: string;
  category?: BlogCategory | null;
  tags?: BlogTag[];
}

export interface VisitorMessage {
  id: string;
  company_name: string | null;
  recruiter_name: string;
  email: string;
  website: string | null;
  message: string;
  attachment_url: string | null;
  moderated: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  budget: string | null;
  timeline: string | null;
  message: string;
  attachment_url: string | null;
  status: 'new' | 'read' | 'archived';
  created_at: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string | null;
  salary: string | null;
  platform: string | null;
  application_date: string | null;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'accepted';
  interview_stage: string | null;
  follow_up_date: string | null;
  notes: string | null;
  attachment_url: string | null;
  created_at: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  path: string;
  size: number;
  mime_type: string | null;
  folder: string;
  created_at: string;
}

export interface DownloadableResource {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  type: string;
  file_url: string;
  download_count: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  company: string | null;
  content: string;
  avatar_url: string | null;
  rating: number;
  project: string | null;
  verified: boolean;
  created_at: string;
}

export interface SeoMetadata {
  id: string;
  page_path: string;
  title: string | null;
  description: string | null;
  og_image_url: string | null;
  keywords: string | null;
}

export interface Setting {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  slug: string;
  currency: string;
  category: string;
  account_name: string | null;
  account_number: string | null;
  bank_name: string | null;
  usd_account_name: string | null;
  usd_account_number: string | null;
  swift_code: string | null;
  routing_number: string | null;
  wallet_address: string | null;
  binance_pay_id: string | null;
  qr_code_url: string | null;
  instructions: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_company: string | null;
  client_email: string;
  project_name: string;
  description: string | null;
  amount: number;
  currency: string;
  due_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentConfirmation {
  id: string;
  reference_number: string;
  invoice_id: string | null;
  client_name: string;
  client_email: string;
  payment_method: string;
  transaction_id: string | null;
  amount_paid: number;
  currency: string;
  receipt_url: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  invoice?: Invoice | null;
}
