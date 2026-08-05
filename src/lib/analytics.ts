// Analytics utility — supports Vercel Analytics and Google Analytics
// Vercel Analytics is auto-injected when deployed on Vercel with @vercel/analytics
// Google Analytics requires VITE_GA_MEASUREMENT_ID env var

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

let gaInitialized = false;

function initGA() {
  if (gaInitialized || !GA_ID) return;
  gaInitialized = true;

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script1);

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });
}

export function trackPageView(path: string) {
  initGA();
  if (window.gtag && GA_ID) {
    window.gtag('event', 'page_view', { page_path: path });
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  initGA();
  if (window.gtag && GA_ID) {
    window.gtag('event', name, params);
  }
}

export function trackDownload(resourceTitle: string) {
  trackEvent('download', { resource_title: resourceTitle });
}

export function trackContactSubmit(service?: string) {
  trackEvent('contact_submit', { service });
}

export function trackPortfolioView(projectSlug: string) {
  trackEvent('portfolio_view', { project_slug: projectSlug });
}
