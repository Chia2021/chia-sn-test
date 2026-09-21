import { Mail, Phone, MapPin, ChevronRight, Lock, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { useCMS } from '../context/CMSContext';
import { Logo } from './Logo';

interface FooterProps {
  currentLang: Language;
  onOpenTerms?: () => void;
}

export function Footer({ currentLang, onOpenTerms }: FooterProps) {
  const { getTranslations, isAdmin, setIsAdminPanelOpen, setIsLoginModalOpen } = useCMS();
  const t = getTranslations(currentLang);

  const quickLinks = [
    { label: t['nav-home'], href: '#home' },
    { label: t['nav-services'], href: '#services' },
    { label: t['nav-compliance'], href: '#compliance' },
    { label: t['nav-gallery'], href: '#carousel-section' },
    { label: t['nav-faq'], href: '#faq' },
    { label: t['nav-testimonials'], href: '#testimonials' },
    { label: t['nav-contact'], href: '#contact' },
    { label: t['footer-terms-short'] || (currentLang === 'FR' ? 'Conditions Générales' : 'Terms & Conditions'), href: '#terms', isTerms: true },
  ];

  const standards = [
    'Système Comptable OHADA (SYSCOHADA)',
    'Déclaration Statistique et Fiscale (DSF)',
    'Code Général des Impôts (CGI Cameroun)',
    'Déclarations Sociales CNPS & DIPE',
    'Normes Internationales ISA / CEMAC',
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isTerms?: boolean) => {
    e.preventDefault();
    if (isTerms || href === '#terms') {
      if (onOpenTerms) {
        onOpenTerms();
      } else {
        window.location.hash = '#terms';
      }
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="main-footer" className="bg-[#0b1b2b] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white/95 p-2.5 rounded-xl inline-block">
              <Logo size="sm" showSubtitle={true} />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              {t['footer-about-text']}
            </p>
            <div className="text-xs text-amber-400/90 font-medium">
              Douala (Bonanjo) • Yaoundé (Bastos) • Bafoussam
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {t['footer-quicklinks']}
            </h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href, link.isTerms)}
                    className="inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Standards & Certifications */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {t['footer-standards']}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              {standards.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Assistance */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {currentLang === 'FR' ? 'Assistance Directe' : 'Direct Assistance'}
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <span>Bonanjo, Immeuble Horizon, Douala, Cameroun</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+237670123456" className="hover:text-white transition-colors">
                  +237 670 12 34 56
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:contact@chia-sn.cm" className="hover:text-white transition-colors">
                  contact@chia-sn.cm
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} Chia-SN Cabinet Conseil. {t['footer-rights']}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <button
              id="footer-terms-btn"
              type="button"
              onClick={() => (onOpenTerms ? onOpenTerms() : (window.location.hash = '#terms'))}
              className="text-slate-400 hover:text-amber-400 underline decoration-slate-600 transition-colors cursor-pointer"
            >
              {t['footer-terms'] || (currentLang === 'FR' ? 'Conditions Générales' : 'Terms & Conditions')}
            </button>
            <span>•</span>
            <span>Douala - Yaoundé</span>
            <span>•</span>
            <span>SYSCOHADA Révisé</span>
            <span>•</span>
            <span>CGI Cameroun</span>
            <span>•</span>
            <button
              id="footer-admin-login-btn"
              type="button"
              onClick={() => (isAdmin ? setIsAdminPanelOpen(true) : setIsLoginModalOpen(true))}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isAdmin ? (currentLang === 'FR' ? 'Gestion CMS' : 'CMS Dashboard') : (currentLang === 'FR' ? 'Espace Admin' : 'Admin Portal')}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
