# Lafazy Graphic Design Studio

Premium international creative studio website — production-ready, fully responsive, and optimized for global deployment.

## Overview

A complete creative studio platform featuring:
- **Public site**: Home, About, Services, Portfolio (with case studies), Blog, Jobs board, Contact, Resume/CV download center, Recruiter Package page
- **Payment infrastructure**: Multi-currency (NGN, USD, Crypto) with 10 payment methods, invoice generation, payment confirmations, and receipt uploads
- **Admin dashboard**: Portfolio management, blog CMS, job postings, message inbox, file storage, SEO manager, analytics, payment settings, invoice management, and payment confirmation review
- **Legal pages**: Payment Policy, Refund Policy, Terms of Service

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite 5, Tailwind CSS 3, Framer Motion, Lucide Icons
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Deployment**: Vercel (optimized config with security headers, caching, and compression)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (free tier works fine)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lafazy-studio.git
cd lafazy-studio

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your Supabase credentials to .env
# VITE_SUPABASE_URL=your-project-url
# VITE_SUPABASE_ANON_KEY=your-anon-key

# Start the dev server
npm run dev
```

### Build for Production

```bash
npm run build      # Creates optimized production build in dist/
npm run preview    # Preview the production build locally
npm run typecheck   # Run TypeScript type checking
npm run lint        # Run ESLint
```

## Project Structure

```
lafazy-studio/
├── public/                  # Static assets (favicon, robots.txt, sitemap.xml)
├── src/
│   ├── components/          # Shared UI components (Navbar, Footer, FileUpload, etc.)
│   ├── lib/                 # Utilities (supabase client, auth, SEO, analytics, types)
│   ├── pages/               # Public pages (Home, About, Portfolio, Payment, etc.)
│   │   └── admin/           # Admin dashboard pages
│   ├── App.tsx              # Main app with lazy-loaded routes
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles + Tailwind
├── supabase/
│   ├── migrations/          # Database migrations (applied via Supabase MCP)
│   └── functions/           # Edge functions (contact notification)
├── vercel.json              # Vercel deployment config with security headers
├── tailwind.config.js       # Tailwind theme (custom color system)
├── vite.config.ts           # Vite config (code splitting, aliases)
└── package.json
```

## Supabase Setup

### 1. Create a Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your Project URL and anon key from Settings > API
3. Add them to your `.env` file:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 2. Run Migrations

Migrations are in `supabase/migrations/`. They are applied automatically when using the Bolt platform. For manual setup, run each SQL file in the Supabase SQL Editor in order:

1. `lafazy_studio_schema.sql` — Core tables (portfolio, blog, jobs, contact, visitor messages, settings, downloadable resources)
2. `create_storage_bucket.sql` — Storage bucket for file uploads
3. `add_docx_support.sql` — DOCX file type support
4. `phase4_case_studies_and_testimonials.sql` — Case studies and testimonials tables
5. `fix_function_search_path.sql` — Security fix for function search paths
6. `seed_portfolio_testimonials_resources.sql` — Initial content
7. `update_meenas_villa_case_study.sql` — Case study update
8. `payment_infrastructure_schema.sql` — Payment methods, invoices, payment confirmations tables

### 3. Create Admin Account

1. Navigate to `/login` on your deployed site
2. Sign up with your email and password
3. This first account is your admin account
4. Access the admin dashboard at `/admin`

### 4. Configure Storage

The `studio-uploads` storage bucket is created automatically. It stores:
- Portfolio project images
- Blog article cover images
- File upload attachments
- Payment receipt uploads (in `receipts/` folder)
- QR code images (in `qr-codes/` folder)

## Payment Setup

### 1. Configure Payment Methods

1. Log into the admin dashboard at `/admin`
2. Navigate to **Payments** in the sidebar
3. Click **Add Method** or edit existing methods
4. Fill in your real payment details:
   - **Bank Transfer**: Account name, account number, bank name
   - **Opay/Moniepoint/PalmPay**: Account name and number
   - **Raenest USD**: USD account name, number, SWIFT code, routing number
   - **Binance Pay**: Binance Pay ID
   - **USDT/BTC/ETH**: Wallet addresses
   - **QR Codes**: Upload QR code images for each method
5. Set payment instructions for each method
6. Toggle methods active/inactive as needed

### 2. Payment Flow

1. Client visits `/checkout` or clicks "Start a Project" from the Hire Me page
2. Selects service, package, and currency
3. Enters their details
4. Invoice is generated with a unique number (INV-YYYY-NNNN)
5. Client is directed to `/payment` to complete payment
6. Client selects currency and payment method
7. Copies account/wallet details and makes payment
8. Submits payment confirmation with receipt upload
9. Admin reviews confirmation in `/admin/confirmations`
10. Admin marks confirmation as verified or rejected

### 3. Invoice Management

- All invoices are visible in `/admin/invoices`
- Admin can update invoice status (pending, paid, overdue, cancelled)
- Invoices can be printed as professional PDF documents

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Vite — no configuration needed
4. Add environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

The included `vercel.json` configures:
- SPA routing (all non-admin routes serve index.html)
- Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- Asset caching (1 year for static assets, 1 hour for sitemap/robots)
- Clean URLs

### Alternative Platforms

The build output in `dist/` is a standard static site that can be deployed to:
- Netlify
- Cloudflare Pages
- GitHub Pages
- Any static hosting provider

## Security

- **Row Level Security (RLS)**: Enabled on all database tables
- **Admin-only writes**: All content management requires authentication
- **Public reads**: Portfolio, blog, and payment methods are publicly readable
- **Payment confirmations**: Public insert (clients submit), admin-only read
- **CSP**: Content Security Policy configured in vercel.json
- **HSTS**: Strict-Transport-Security with 2-year max-age
- **File upload validation**: Type and size validation on all uploads
- **Environment variables**: Secrets stored in Vercel/Supabase, never in code

## Performance

- **Code splitting**: All routes are lazy-loaded via React.lazy
- **Bundle optimization**: Manual chunks for React, Framer Motion, Supabase, and icons
- **Font optimization**: Google Fonts with preconnect
- **Image optimization**: Pexels CDN for stock images, Supabase storage for uploads
- **Caching**: Long-term caching for static assets via vercel.json

## SEO

- **Sitemap**: `public/sitemap.xml` with all 18 pages
- **Robots.txt**: Allows crawling of public pages, blocks admin
- **Meta tags**: Dynamic per-page SEO via `useSeo` hook
- **Open Graph**: Social media preview tags on every page
- **Structured Data**: JSON-LD for ProfessionalService and Person schemas
- **Canonical URLs**: Set per-page to prevent duplicate content

## License

This is a private project for Lafazy Graphic Design Studio. All rights reserved.
