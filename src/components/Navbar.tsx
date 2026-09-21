import { useState, useEffect } from 'react';
import { Menu, X, PhoneCall, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { useCMS } from '../context/CMSContext';
import { Logo } from './Logo';

interface NavbarProps {
  currentLang: Language;
  onToggleLang: () => void;
  onOpenSearch: () => void;
  onNavigateSection?: (href: string) => void;
  onOpenTerms?: () => void;
  isTermsView?: boolean;
}

export function Navbar({
  currentLang,
  onToggleLang,
  onOpenSearch,
  onNavigateSection,
  onOpenTerms,
  isTermsView,
}: NavbarProps) {
  const { getTranslations } = useCMS();
  const t = getTranslations(currentLang);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'services', 'compliance', 'carousel-section', 'faq', 'contact', 'testimonials'];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t['nav-home'], id: 'nav-home', sectionId: 'home' },
    { href: '#services', label: t['nav-services'], id: 'nav-services', sectionId: 'services' },
    { href: '#compliance', label: t['nav-compliance'], id: 'nav-compliance', sectionId: 'compliance' },
    { href: '#carousel-section', label: t['nav-gallery'], id: 'nav-gallery', sectionId: 'carousel-section' },
    { href: '#faq', label: t['nav-faq'], id: 'nav-faq', sectionId: 'faq' },
    { href: '#contact', label: t['nav-contact'], id: 'nav-contact', sectionId: 'contact' },
    { href: '#testimonials', label: t['nav-testimonials'], id: 'nav-testimonials', sectionId: 'testimonials' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(href);
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-white shadow-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
          >
            <Logo size="md" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
            <ul className="flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.sectionId;
                return (
                  <li key={link.id}>
                    <a
                      id={link.id}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`relative px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                        isActive
                          ? 'text-[#0f4c81] font-bold'
                          : 'text-slate-700 hover:text-[#0f4c81] hover:bg-slate-50'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavPill"
                          className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#e67e22] rounded-full"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Desktop Quick Search & CTA */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <button
                id="header-search-btn"
                type="button"
                onClick={onOpenSearch}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-[#0f4c81] bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition-all cursor-pointer shadow-2xs group focus:outline-none focus:ring-2 focus:ring-blue-600"
                title={`${t['search-btn-label']} (⌘K)`}
                aria-label={t['search-btn-label']}
              >
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0f4c81] transition-colors" />
                <span className="hidden xl:inline">{t['search-btn-short']}</span>
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-slate-500 border border-slate-200 rounded shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              <a
                id="header-cta-btn"
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-[#0f4c81] hover:bg-[#1d70b8] active:scale-[0.98] rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
              >
                {t['nav-cta']}
              </a>
            </div>
          </nav>

          {/* Mobile Actions (Search + Language toggle + Hamburger button) */}
          <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
            <button
              id="mobile-search-btn"
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-slate-600 hover:text-[#0f4c81] hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
              aria-label={t['search-btn-label']}
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={onToggleLang}
              className="px-2.5 py-1 text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200 transition-colors"
              aria-label={t['lang-toggle']}
            >
              {t['lang-code']}
            </button>

            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? t['menu-close'] : t['menu-open']}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md overflow-hidden shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-5 space-y-4">
              {/* Mobile Quick Search Bar Trigger */}
              <button
                type="button"
                id="mobile-drawer-search-trigger"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#0f4c81]" />
                  <span>{t['search-btn-label']}</span>
                </div>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-500">
                  ⌘K
                </kbd>
              </button>

              <ul className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.sectionId;
                  return (
                    <li key={`mobile-${link.id}`}>
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-[#0f4c81] font-bold border-l-4 border-[#e67e22]'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#e67e22]' : 'text-slate-400'}`} />
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="pt-4 border-t border-slate-200 space-y-3">
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="w-full flex items-center justify-center py-3 px-4 text-center font-bold text-white bg-[#0f4c81] hover:bg-[#1d70b8] rounded-lg shadow transition-colors"
                >
                  {t['nav-cta']}
                </a>

                <a
                  href="tel:+237670123456"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-center font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm"
                >
                  <PhoneCall className="w-4 h-4 text-amber-600" />
                  <span>+237 670 12 34 56 (Assistance Directe)</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenTerms) onOpenTerms();
                    else window.location.hash = '#terms';
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-4 text-center font-semibold text-slate-500 hover:text-[#0f4c81] transition-colors text-xs cursor-pointer"
                >
                  <span>{currentLang === 'FR' ? 'Conditions Générales & Mentions Légales' : 'Terms of Service & Legal Notice'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
