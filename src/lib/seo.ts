import { useEffect } from 'react';

interface SeoOptions {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  canonicalPath?: string;
}

const SITE_URL = 'https://lafazystudio.com';

export function useSeo({ title, description, image, keywords, canonicalPath }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title ? `${title} — Lafazy Studio` : 'Lafazy Graphic Design Studio — Premium International Creative Studio';
    const desc = description || 'Premium international creative studio for branding, logo design, visual identity, and AI-powered creative solutions. Available for remote work worldwide.';
    const canonical = canonicalPath ? `${SITE_URL}${canonicalPath}` : SITE_URL;

    document.title = fullTitle;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setOg = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonical);

    setMeta('description', desc);
    if (keywords) setMeta('keywords', keywords);

    setOg('og:title', fullTitle);
    setOg('og:description', desc);
    setOg('og:type', 'website');
    setOg('og:url', canonical);
    setOg('og:site_name', 'Lafazy Graphic Design Studio');
    if (image) setOg('og:image', image);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', desc);
    if (image) setMeta('twitter:image', image);
  }, [title, description, image, keywords, canonicalPath]);
}

export function setJsonLd(data: Record<string, unknown>) {
  let script = document.getElementById('json-ld');
  if (!script) {
    script = document.createElement('script');
    script.id = 'json-ld';
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function setBreadcrumbJsonLd(items: { label: string; url: string }[]) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  let script = document.getElementById('json-ld-breadcrumbs');
  if (!script) {
    script = document.createElement('script');
    script.id = 'json-ld-breadcrumbs';
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}
