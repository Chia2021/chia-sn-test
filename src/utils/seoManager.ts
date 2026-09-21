import { Language } from '../types';

interface SEOOptions {
  lang: Language;
  view: 'home' | 'terms';
}

export function updateDynamicSEO({ lang, view }: SEOOptions) {
  if (typeof document === 'undefined') return;

  const isEn = lang === 'EN';
  const isTerms = view === 'terms';

  // 1. Determine Title & Descriptions
  let title = 'Chia-SN | Compta & Conseil Fiscal';
  let description =
    "Cabinet d'expertise comptable et conseil fiscal au Cameroun spécialisé en normes SYSCOHADA et DSF.";

  if (isTerms) {
    if (isEn) {
      title = 'Terms & Conditions | Chia-SN Cameroon';
      description =
        'Terms of engagement, professional standards, and legal notices of Cabinet Chia-SN in Douala and Yaounde, Cameroon.';
    } else {
      title = 'Conditions Générales & Mentions Légales | Chia-SN';
      description =
        "Conditions générales d'intervention, secret professionnel (Art. 378 Code Pénal) et cadre déontologique du Cabinet Chia-SN au Cameroun.";
    }
  } else if (isEn) {
    title = 'Chia-SN | Accounting & Tax Advisory Cameroon';
    description =
      'Chartered accounting and tax advisory firm in Cameroon specializing in SYSCOHADA accounting standards, tax audit defense, and corporate filings.';
  }

  // 2. Set Document Title & HTML Lang attribute
  document.title = title;
  document.documentElement.lang = isEn ? 'en' : 'fr';

  // 3. Helper to update or create meta tag
  const setMeta = (nameOrProperty: string, content: string, isProperty = false) => {
    const selector = isProperty
      ? `meta[property="${nameOrProperty}"]`
      : `meta[name="${nameOrProperty}"]`;
    let element = document.querySelector(selector) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      if (isProperty) {
        element.setAttribute('property', nameOrProperty);
      } else {
        element.setAttribute('name', nameOrProperty);
      }
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 4. Update Meta Description & OpenGraph / Twitter
  setMeta('description', description);
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:locale', isEn ? 'en_US' : 'fr_FR', true);
  setMeta('og:locale:alternate', isEn ? 'fr_FR' : 'en_US', true);
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);

  // 5. Update Canonical URL
  const currentOrigin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://chia-sn.cm';
  const canonicalUrl = isTerms
    ? `${currentOrigin}/#terms`
    : `${currentOrigin}/`;

  let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonicalUrl);
}
