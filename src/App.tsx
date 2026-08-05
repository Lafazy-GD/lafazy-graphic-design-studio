import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { PublicLayout } from '@/components/PublicLayout';
import { AdminLayout } from '@/components/AdminLayout';
import { PageLoader } from '@/components/ui';

const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('@/pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const BlogPage = lazy(() => import('@/pages/BlogPage').then(m => ({ default: m.BlogPage })));
const ArticleDetailPage = lazy(() => import('@/pages/ArticleDetailPage').then(m => ({ default: m.ArticleDetailPage })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const JobsPage = lazy(() => import('@/pages/JobsPage').then(m => ({ default: m.JobsPage })));
const RecruitersPage = lazy(() => import('@/pages/RecruitersPage').then(m => ({ default: m.RecruitersPage })));
const RecruiterPackagePage = lazy(() => import('@/pages/RecruiterPackagePage').then(m => ({ default: m.RecruiterPackagePage })));
const ResumePage = lazy(() => import('@/pages/ResumePage').then(m => ({ default: m.ResumePage })));
const HireMePage = lazy(() => import('@/pages/HireMePage').then(m => ({ default: m.HireMePage })));
const AiPromptPage = lazy(() => import('@/pages/AiPromptPage').then(m => ({ default: m.AiPromptPage })));
const PaymentPage = lazy(() => import('@/pages/PaymentPage').then(m => ({ default: m.PaymentPage })));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const PaymentPolicyPage = lazy(() => import('@/pages/LegalPages').then(m => ({ default: m.PaymentPolicyPage })));
const RefundPolicyPage = lazy(() => import('@/pages/LegalPages').then(m => ({ default: m.RefundPolicyPage })));
const TermsPage = lazy(() => import('@/pages/LegalPages').then(m => ({ default: m.TermsPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));

const AdminOverview = lazy(() => import('@/pages/admin/AdminOverview').then(m => ({ default: m.AdminOverview })));
const AdminPortfolio = lazy(() => import('@/pages/admin/AdminPortfolio').then(m => ({ default: m.AdminPortfolio })));
const AdminBlog = lazy(() => import('@/pages/admin/AdminBlog').then(m => ({ default: m.AdminBlog })));
const AdminJobs = lazy(() => import('@/pages/admin/AdminJobs').then(m => ({ default: m.AdminJobs })));
const AdminContact = lazy(() => import('@/pages/admin/AdminMessages').then(m => ({ default: m.AdminContact })));
const AdminVisitors = lazy(() => import('@/pages/admin/AdminMessages').then(m => ({ default: m.AdminVisitors })));
const AdminDownloads = lazy(() => import('@/pages/admin/AdminDownloads').then(m => ({ default: m.AdminDownloads })));
const AdminStorage = lazy(() => import('@/pages/admin/AdminStorage').then(m => ({ default: m.AdminStorage })));
const AdminSeo = lazy(() => import('@/pages/admin/AdminSeo').then(m => ({ default: m.AdminSeo })));
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));
const AdminPayments = lazy(() => import('@/pages/admin/AdminPayments').then(m => ({ default: m.AdminPayments })));
const AdminInvoices = lazy(() => import('@/pages/admin/AdminInvoices').then(m => ({ default: m.AdminInvoices })));
const AdminConfirmations = lazy(() => import('@/pages/admin/AdminConfirmations').then(m => ({ default: m.AdminConfirmations })));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<ArticleDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/recruiters" element={<RecruitersPage />} />
              <Route path="/recruiter-package" element={<RecruiterPackagePage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/hire-me" element={<HireMePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/ai-prompt-engineering" element={<AiPromptPage />} />
              <Route path="/payment-policy" element={<PaymentPolicyPage />} />
              <Route path="/refund-policy" element={<RefundPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Route>

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="contact" element={<AdminContact />} />
              <Route path="visitors" element={<AdminVisitors />} />
              <Route path="downloads" element={<AdminDownloads />} />
              <Route path="storage" element={<AdminStorage />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="seo" element={<AdminSeo />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="invoices" element={<AdminInvoices />} />
              <Route path="confirmations" element={<AdminConfirmations />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
