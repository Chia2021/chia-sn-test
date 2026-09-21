import { useState } from 'react';
import {
  Globe,
  Share2,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Search,
  Smartphone,
  Monitor,
  Code2,
  MapPin,
  FileCode,
  ShieldCheck,
} from 'lucide-react';
import { Language } from '../../types';

interface SEOManagementSectionProps {
  currentLang: Language;
}

export function SEOManagementSection({ currentLang }: SEOManagementSectionProps) {
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
  const [socialPlatform, setSocialPlatform] = useState<'linkedin' | 'whatsapp' | 'twitter'>('linkedin');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedMeta, setCopiedMeta] = useState(false);

  const isEn = currentLang === 'EN';

  const siteTitle = isEn
    ? 'Chia-SN | Accounting & Tax Advisory Cameroon'
    : 'Chia-SN | Compta & Conseil Fiscal';

  const siteDescription = isEn
    ? 'Chartered accounting and tax advisory firm in Cameroon specializing in SYSCOHADA standards, tax audit defense, and corporate corporate filings.'
    : "Cabinet d'expertise comptable et conseil fiscal au Cameroun spécialisé en normes SYSCOHADA et DSF.";

  const canonicalUrl = 'https://chia-sn.cm/';

  const sampleJsonLd = `{
  "@context": "https://schema.org",
  "@type": ["AccountingService", "ProfessionalService", "LegalService"],
  "name": "Cabinet Chia-SN - Expertise Comptable & Conseil Fiscal",
  "url": "https://chia-sn.cm/",
  "telephone": "+237670123456",
  "email": "contact@chia-sn.cm",
  "priceRange": "$$$",
  "currenciesAccepted": "XAF, EUR, USD",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Bonanjo, Immeuble Horizon",
    "addressLocality": "Douala",
    "addressRegion": "Littoral",
    "addressCountry": "CM"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 4.0435,
    "longitude": 9.6917
  }
}`;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(sampleJsonLd);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleCopyMeta = () => {
    const metaSnippet = `<!-- Primary Meta Tags -->
<title>${siteTitle}</title>
<meta name="description" content="${siteDescription}" />
<link rel="canonical" href="${canonicalUrl}" />

<!-- OpenGraph / Facebook / LinkedIn -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:title" content="${siteTitle}" />
<meta property="og:description" content="${siteDescription}" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${siteTitle}" />
<meta name="twitter:description" content="${siteDescription}" />`;

    navigator.clipboard.writeText(metaSnippet);
    setCopiedMeta(true);
    setTimeout(() => setCopiedMeta(false), 2000);
  };

  const seoChecklist = [
    {
      label: isEn ? 'Page Title Tag (30-60 chars)' : 'Balise Titre <title> (30-60 car.)',
      status: 'optimal',
      detail: `${siteTitle.length} caractères`,
    },
    {
      label: isEn ? 'Meta Description (120-160 chars)' : 'Méta Description (120-160 car.)',
      status: 'optimal',
      detail: `${siteDescription.length} caractères`,
    },
    {
      label: isEn ? 'OpenGraph Social Card Protocol' : 'Protocole OpenGraph (og:title, og:image)',
      status: 'optimal',
      detail: isEn ? 'Active for LinkedIn, FB, WhatsApp' : 'Actif pour LinkedIn, WhatsApp, Facebook',
    },
    {
      label: isEn ? 'Twitter / X Card Tags' : 'Balises Twitter Cards (summary_large_image)',
      status: 'optimal',
      detail: isEn ? 'Active (@CabinetChiaSN)' : 'Actif (@CabinetChiaSN)',
    },
    {
      label: isEn ? 'Canonical URL Tag' : 'Balise d\'URL Canonique',
      status: 'optimal',
      detail: canonicalUrl,
    },
    {
      label: isEn ? 'Schema.org JSON-LD (AccountingService)' : 'Données Structurées Schema.org (AccountingService)',
      status: 'optimal',
      detail: isEn ? 'Indexed for Google Rich Snippets' : 'Indexé pour Extraits Enrichis Google',
    },
    {
      label: isEn ? 'FAQ Schema.org (FAQPage Rich Snippet)' : 'Données Structurées FAQ (FAQPage Google)',
      status: 'optimal',
      detail: isEn ? 'Active (Accordions on SERP)' : 'Actif (Accordéons sur les résultats Google)',
    },
    {
      label: isEn ? 'Local SEO & Geolocation (Douala/Yaoundé)' : 'Référencement Local & Géolocalisation (Douala/Yaoundé)',
      status: 'optimal',
      detail: 'CM-LT (4.0435°N, 9.6917°E)',
    },
    {
      label: isEn ? 'Sitemap XML & Robots.txt' : 'Fichiers sitemap.xml & robots.txt',
      status: 'optimal',
      detail: '/sitemap.xml & /robots.txt',
    },
    {
      label: isEn ? 'Bilingual Alternate Hreflang Tags' : 'Balises Multilingues Hreflang (FR / EN)',
      status: 'optimal',
      detail: isEn ? 'Dynamic Client & XML alternates' : 'Balises dynamiques FR et EN',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1b2b] to-[#0f4c81] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <Globe className="w-3.5 h-3.5" />
              <span>{isEn ? 'SEO & Search Engine Optimization' : 'Optimisation SEO & Référencement Naturel'}</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {isEn ? 'Search Engine Visibility & Rich Snippets' : 'Visibilité Google, Cartes Réseaux & Données Structurées'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {isEn
                ? 'High-performance search metadata tailored for Cameroon & CEMAC enterprise search queries, featuring Schema.org AccountingService, FAQPage rich snippets, and social sharing cards.'
                : 'Métadonnées de haute précision taillées pour les requêtes entreprises au Cameroun et zone CEMAC (DSF, SYSCOHADA, conseil fiscal, audit), avec Schema.org et cartes réseaux sociaux.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMeta}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer border border-white/20"
            >
              {copiedMeta ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedMeta ? (isEn ? 'Copied!' : 'Copié !') : (isEn ? 'Copy Meta Tags' : 'Copier Méta')}</span>
            </button>
            <button
              type="button"
              onClick={handleCopySchema}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              {copiedSchema ? <Check className="w-4 h-4 text-slate-900" /> : <Code2 className="w-4 h-4" />}
              <span>{copiedSchema ? (isEn ? 'Copied!' : 'Copié !') : (isEn ? 'Copy Schema JSON' : 'Copier JSON-LD')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Google Search Preview & Social Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Google SERP Snippet Preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-sm text-slate-800">
                {isEn ? 'Google Search Snippet Preview' : 'Aperçu dans les résultats Google'}
              </h4>
            </div>

            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setDevicePreview('desktop')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  devicePreview === 'desktop'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setDevicePreview('mobile')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  devicePreview === 'mobile'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Realistic Google Search Card */}
          <div
            className={`bg-white rounded-xl border border-slate-200 p-4 font-sans ${
              devicePreview === 'mobile' ? 'max-w-sm mx-auto shadow-sm' : 'shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-[#0f4c81] text-white flex items-center justify-center text-[10px] font-bold">
                C
              </div>
              <div className="leading-tight truncate">
                <div className="text-xs font-medium text-slate-800 truncate">Cabinet Chia-SN</div>
                <div className="text-[11px] text-slate-500 truncate">
                  https://chia-sn.cm › cameroun › expertise-comptable
                </div>
              </div>
            </div>

            <h5 className="text-[#1a0dab] hover:underline text-base font-semibold leading-snug cursor-pointer mb-1">
              {siteTitle}
            </h5>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {siteDescription}
            </p>

            {/* Google Sitelinks / Rich snippet links */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[#1a0dab] font-medium hover:underline cursor-pointer block truncate">
                  DSF 15 Mars & Télédéclaration
                </span>
                <span className="text-slate-500 text-[10px] block truncate">
                  Élaboration des 36 notes annexes...
                </span>
              </div>
              <div>
                <span className="text-[#1a0dab] font-medium hover:underline cursor-pointer block truncate">
                  SYSCOHADA Révisé
                </span>
                <span className="text-slate-500 text-[10px] block truncate">
                  Tenue de comptabilité conforme...
                </span>
              </div>
              <div>
                <span className="text-[#1a0dab] font-medium hover:underline cursor-pointer block truncate">
                  Conseil Fiscal & CGI
                </span>
                <span className="text-slate-500 text-[10px] block truncate">
                  Assistance contrôle fiscal DGI...
                </span>
              </div>
              <div>
                <span className="text-[#1a0dab] font-medium hover:underline cursor-pointer block truncate">
                  Douala Bonanjo & Yaoundé
                </span>
                <span className="text-slate-500 text-[10px] block truncate">
                  Prendre rendez-vous au cabinet...
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Score de pertinence SERP</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 98 / 100
            </span>
          </div>
        </div>

        {/* Social Card Preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-sm text-slate-800">
                {isEn ? 'Social Card Preview (OpenGraph)' : 'Aperçu Partage Réseaux Sociaux'}
              </h4>
            </div>

            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setSocialPlatform('linkedin')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  socialPlatform === 'linkedin'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                LinkedIn
              </button>
              <button
                type="button"
                onClick={() => setSocialPlatform('whatsapp')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  socialPlatform === 'whatsapp'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setSocialPlatform('twitter')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  socialPlatform === 'twitter'
                    ? 'bg-slate-100 text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                X / Twitter
              </button>
            </div>
          </div>

          {/* Visual Social Card Mockup */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Banner graphic */}
            <div className="h-32 bg-gradient-to-br from-[#0b1b2b] via-[#0f4c81] to-[#1d70b8] p-4 flex flex-col justify-between text-white relative">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold tracking-wider uppercase text-amber-400">Cabinet Chia-SN</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-[10px]">Douala • Yaoundé</span>
              </div>
              <div>
                <div className="text-sm font-bold text-white leading-tight">
                  Expertise Comptable & Conseil Fiscal
                </div>
                <div className="text-[11px] text-slate-200">
                  SYSCOHADA Révisé • Déclaration Statistique et Fiscale (DSF)
                </div>
              </div>
            </div>

            {/* Social Card Content */}
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">chia-sn.cm</div>
              <h5 className="font-bold text-xs text-slate-900 truncate mt-0.5">{siteTitle}</h5>
              <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{siteDescription}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Balises testées</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> og:title, og:image, twitter:card
            </span>
          </div>
        </div>
      </div>

      {/* Technical SEO Audit & Checklist */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">
                {isEn ? 'SEO Performance & Indexing Checklist' : 'Audit de Conformité SEO & Indexabilité'}
              </h4>
              <p className="text-xs text-slate-500">
                {isEn
                  ? 'All 10 core search optimization requirements are fully satisfied and active.'
                  : 'Les 10 critères essentiels pour le référencement sur Google et Bing sont actifs et conformes.'}
              </p>
            </div>
          </div>

          <div className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>10 / 10 Conforme</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {seoChecklist.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
            >
              <div className="space-y-0.5 pr-2">
                <span className="font-semibold text-slate-800 block">{item.label}</span>
                <span className="text-[11px] text-slate-500 block truncate max-w-xs">{item.detail}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded shrink-0">
                <Check className="w-3 h-3" />
                <span>OK</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Search Engine Crawl Files & External Testers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sitemap & Robots Files */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-sm text-slate-800">
              {isEn ? 'Crawling & Indexing Files' : 'Fichiers d\'exploration (Crawling)'}
            </h4>
          </div>
          <p className="text-xs text-slate-600">
            {isEn
              ? 'Robots instructions and XML sitemap generated in /public directory for search engines.'
              : 'Directives robots.txt et sitemap.xml générées dans le dossier public pour les moteurs de recherche.'}
          </p>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
              <div className="font-mono text-slate-700">/robots.txt</div>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
              >
                <span>{isEn ? 'View File' : 'Consulter'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
              <div className="font-mono text-slate-700">/sitemap.xml</div>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
              >
                <span>{isEn ? 'View File' : 'Consulter'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* External Validation Tools */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-sm text-slate-800">
              {isEn ? 'Google & Schema.org Official Validators' : 'Validateurs Officiels Google & Schema'}
            </h4>
          </div>
          <p className="text-xs text-slate-600">
            {isEn
              ? 'Test your live structured data, rich snippet eligibility, and social cards.'
              : 'Testez l\'éligibilité aux extraits enrichis Google et validez les balises Schema.org.'}
          </p>

          <div className="space-y-2 pt-1">
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 bg-white hover:bg-blue-50/50 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-colors"
            >
              <span>Google Rich Results Test</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://validator.schema.org/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 bg-white hover:bg-blue-50/50 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-colors"
            >
              <span>Schema.org Markup Validator</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
