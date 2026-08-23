import { useEffect } from 'react';

const SITE = 'https://www.gurnaaz.co.in';
const DEFAULT = {
  title: 'GURNAAZ — Premium Handcrafted Ethnic Wear',
  description: 'Discover handcrafted premium ethnic wear by Gurnaaz. Luxury suits, Anarkali, Sharara, Banarasi & Chikankari — where tradition meets timeless elegance.',
  keywords: 'Gurnaaz, premium ethnic wear, handcrafted suits, Anarkali, Sharara, Banarasi, Chikankari, luxury Indian fashion, designer suits, wedding wear',
  image: `${SITE}/gurnaaz_logo.png`,
  type: 'website',
  schema: null,
};

export default function useSEO(overrides = {}) {
  const seo = { ...DEFAULT, ...overrides };

  useEffect(() => {
    document.title = seo.title;

    const set = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    set('name', 'description', seo.description);
    set('name', 'keywords', seo.keywords);
    set('name', 'robots', seo.robots || 'index, follow, max-snippet:-1, max-image-preview:large');

    set('property', 'og:title', seo.title);
    set('property', 'og:description', seo.description);
    set('property', 'og:image', seo.image);
    set('property', 'og:type', seo.type);
    set('property', 'og:url', seo.url || SITE);
    set('property', 'og:site_name', 'Gurnaaz');
    set('property', 'og:locale', 'en_IN');

    set('name', 'twitter:card', 'summary_large_image');
    set('name', 'twitter:title', seo.title);
    set('name', 'twitter:description', seo.description);
    set('name', 'twitter:image', seo.image);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = seo.url || SITE;
    else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = seo.url || SITE;
      document.head.appendChild(link);
    }

    if (seo.schema) {
      const existing = document.getElementById('seo-schema');
      if (existing) existing.remove();
      const script = document.createElement('script');
      script.id = 'seo-schema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(seo.schema);
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById('seo-schema');
      if (s) s.remove();
    };
  }, [seo.title, seo.url]);
}
