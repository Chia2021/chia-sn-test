import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, ServiceItem } from './types';
import { CMSProvider, useCMS } from './context/CMSContext';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ComplianceSection } from './components/ComplianceSection';
import { CarouselSection } from './components/CarouselSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { ClientTestimonials } from './components/ClientTestimonials';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AdminFloatingBar } from './components/AdminFloatingBar';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { QuickEditModal } from './components/QuickEditModal';
import { TermsAndConditions } from './components/TermsAndConditions';
import { updateDynamicSEO } from './utils/seoManager';

const safeStorageGet = (key: string) => {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  } catch (error) {
    console.warn(`Unable to read localStorage key: ${key}`, error);
    return null;
  }
};

const safeStorageSet = (key: string, value: string) => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn(`Unable to write localStorage key: ${key}`, error);
  }
};

function useDynamicFavicon(logoUrl: string | null) {
  useEffect(() => {
    // Default fallback icon shipped in /public
    const fallback = '/favicon.svg';
    const desiredHref = logoUrl && logoUrl.length > 0 ? logoUrl : fallback;

    // Create or update the <link rel="icon"> tag
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    // Only assign if changed — prevents needless DOM writes
    if (link.href !== desiredHref) {
      link.href = desiredHref;
    }

    // Also update apple-touch-icon for a nicer mobile home-screen icon
    let apple = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
    if (!apple) {
      apple = document.createElement('link');
      apple.rel = 'apple-touch-icon';
      document.head.appendChild(apple);
    }
    if (apple.href !== desiredHref) {
      apple.href = desiredHref;
    }
  }, [logoUrl]);
}

function AppContent() {
  const { services, logoSettings } = useCMS();

  useDynamicFavicon(logoSettings.logoUrl);

  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang')?.toUpperCase();
      if (urlLang === 'EN' || urlLang === 'FR') {
        return urlLang as Language;
      }
      const savedPref = safeStorageGet('chia_sn_user_lang_pref');
      if (savedPref === 'EN' || savedPref === 'FR') {
        return savedPref;
      }
    }
    return 'EN';
  });

  const [currentView, setCurrentView] = useState<'home' | 'terms'>(() => {
    return typeof window !== 'undefined' && window.location.hash === '#terms' ? 'terms' : 'home';
  });

  const [selectedServiceForConsultation, setSelectedServiceForConsultation] = useState<string>('syscohada');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);

  useEffect(() => {
    safeStorageSet('chia_sn_lang', currentLang);
    updateDynamicSEO({ lang: currentLang, view: currentView });
  }, [currentLang, currentView]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#terms') {
        setCurrentView('terms');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '' || window.location.hash.startsWith('#')) {
        if (window.location.hash !== '#terms') {
          setCurrentView('home');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global keyboard shortcut to open quick search (Cmd+K / Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === '/' && !isSearchOpen) {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea' && activeTag !== 'select') {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const toggleLanguage = () => {
    setCurrentLang((prev) => {
      const next = prev === 'FR' ? 'EN' : 'FR';
      safeStorageSet('chia_sn_user_lang_pref', next);
      return next;
    });
  };

  const navigateToHome = (targetHash?: string) => {
    setCurrentView('home');
    if (targetHash) {
      window.location.hash = targetHash;
      setTimeout(() => {
        const el = document.querySelector(targetHash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      if (window.location.hash === '#terms') {
        history.pushState(null, '', window.location.pathname);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToTerms = () => {
    setCurrentView('terms');
    window.location.hash = '#terms';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServiceSelect = (serviceTitle: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      if (window.location.hash === '#terms') {
        history.pushState(null, '', window.location.pathname);
      }
    }
    // Map service title to option key or keep as message context
    if (serviceTitle.toLowerCase().includes('comptabilité') || serviceTitle.toLowerCase().includes('bookkeeping')) {
      setSelectedServiceForConsultation('bookkeeping');
    } else if (serviceTitle.toLowerCase().includes('dsf') || serviceTitle.toLowerCase().includes('syscohada')) {
      setSelectedServiceForConsultation('syscohada');
    } else if (serviceTitle.toLowerCase().includes('fiscal') || serviceTitle.toLowerCase().includes('tax')) {
      setSelectedServiceForConsultation('tax');
    } else if (serviceTitle.toLowerCase().includes('audit')) {
      setSelectedServiceForConsultation('audit');
    } else {
      setSelectedServiceForConsultation('restructuring');
    }

    setTimeout(() => {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleOpenServiceFromSearch = (serviceId: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      if (window.location.hash === '#terms') {
        history.pushState(null, '', window.location.pathname);
      }
    }
    const found = services.find((s) => s.id === serviceId);
    if (found) {
      setActiveServiceModal(found);
      setTimeout(() => {
        const servicesEl = document.getElementById('services');
        if (servicesEl) {
          servicesEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Utility Bar */}
      <TopBar currentLang={currentLang} onToggleLang={toggleLanguage} />

      {/* Sticky Main Navigation */}
      <Navbar
        currentLang={currentLang}
        onToggleLang={toggleLanguage}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateSection={(href) => navigateToHome(href)}
        onOpenTerms={navigateToTerms}
        isTermsView={currentView === 'terms'}
      />

      {/* Main Content Sections or Terms Page */}
      {currentView === 'terms' ? (
        <main className="flex-1">
          <TermsAndConditions
            currentLang={currentLang}
            onBackToHome={() => navigateToHome()}
            onToggleLang={toggleLanguage}
            onNavigateToContact={() => navigateToHome('#contact')}
          />
        </main>
      ) : (
        <main className="flex-1">
          <Hero currentLang={currentLang} />
          <ServicesSection
            currentLang={currentLang}
            onSelectService={handleServiceSelect}
            activeServiceModal={activeServiceModal}
            onOpenServiceModal={(service) => setActiveServiceModal(service)}
            onCloseServiceModal={() => setActiveServiceModal(null)}
          />
          <ComplianceSection currentLang={currentLang} />
          <CarouselSection currentLang={currentLang} />
          <FAQSection currentLang={currentLang} />
          <ContactSection
            currentLang={currentLang}
            selectedServicePreload={selectedServiceForConsultation}
          />
          <ClientTestimonials currentLang={currentLang} />
        </main>
      )}

      {/* Footer */}
      <Footer currentLang={currentLang} onOpenTerms={navigateToTerms} />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currentLang={currentLang}
        onSelectServiceModal={handleOpenServiceFromSearch}
      />

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            aria-label="Retour en haut"
            className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#0f4c81] hover:bg-[#1d70b8] text-white shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 cursor-pointer"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Action Button */}
      <WhatsAppButton currentLang={currentLang} />

      {/* CMS Admin UI Elements */}
      <AdminFloatingBar currentLang={currentLang} />
      <AdminPanelModal currentLang={currentLang} />
      <AdminLoginModal currentLang={currentLang} />
      <QuickEditModal currentLang={currentLang} />
    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <AppContent />
    </CMSProvider>
  );
}

