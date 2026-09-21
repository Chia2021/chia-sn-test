import { Mail, Phone, Clock, Globe, Shield, Sliders } from 'lucide-react';
import { Language } from '../types';
import { useCMS } from '../context/CMSContext';

interface TopBarProps {
  currentLang: Language;
  onToggleLang: () => void;
}

export function TopBar({ currentLang, onToggleLang }: TopBarProps) {
  const { getTranslations, isAdmin, setIsAdminPanelOpen, setIsLoginModalOpen } = useCMS();
  const t = getTranslations(currentLang);

  const handleAdminClick = () => {
    if (isAdmin) {
      setIsAdminPanelOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div id="top-utility-bar" className="bg-[#0b3557] text-slate-100 text-xs py-2 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Contact info snippets */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-slate-200">
          <a
            id="top-email-link"
            href="mailto:contact@chia-sn.cm"
            className="inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>{t['top-email']}</span>
          </a>

          <a
            id="top-phone-link"
            href="tel:+237670123456"
            className="inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>{t['top-phone']}</span>
          </a>

          <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{t['top-hours']}</span>
          </span>
        </div>

        {/* Right side: Social links, Admin trigger & Bilingual Switch */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Admin quick access button */}
          <button
            id="top-admin-btn"
            type="button"
            onClick={handleAdminClick}
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
              isAdmin
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800/60'
            }`}
            title={isAdmin ? 'Ouvrir le panneau d\'administration CMS' : 'Accès Administrateur (Gestion textes & images)'}
          >
            {isAdmin ? <Sliders className="w-3 h-3" /> : <Shield className="w-3 h-3 text-amber-400" />}
            <span>{isAdmin ? (currentLang === 'FR' ? 'Panneau CMS' : 'CMS Panel') : 'Admin'}</span>
          </button>

          {/* Social icons */}
          <div className="flex items-center gap-3 text-slate-300">
            <a
              id="social-linkedin"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Chia-SN"
              className="hover:text-amber-400 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
            <a
              id="social-facebook"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Chia-SN"
              className="hover:text-amber-400 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
              </svg>
            </a>
            <a
              id="social-whatsapp"
              href="https://wa.me/237670123456"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Chia-SN Direct"
              className="hover:text-emerald-400 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.07 16.3C4.24 14.98 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.03C9.36 7.03 9.09 7.1 8.87 7.33C8.65 7.57 8.02 8.16 8.02 9.36C8.02 10.57 8.9 11.73 9.02 11.89C9.15 12.06 10.73 14.5 13.16 15.54C15.18 16.41 15.59 16.24 16.03 16.2C16.48 16.16 17.47 15.61 17.67 15.03C17.88 14.46 17.88 13.97 17.81 13.86C17.75 13.76 17.6 13.7 17.36 13.58C17.13 13.46 15.98 12.89 15.77 12.81C15.56 12.73 15.4 12.69 15.24 12.93C15.08 13.17 14.63 13.7 14.49 13.86C14.35 14.03 14.21 14.05 13.98 13.93C13.74 13.81 12.74 13.48 11.55 12.42C10.63 11.59 10.01 10.57 9.89 10.37C9.77 10.17 9.87 10.05 9.99 9.94C10.1 9.83 10.24 9.65 10.36 9.5C10.48 9.36 10.52 9.25 10.6 9.09C10.68 8.93 10.64 8.8 10.58 8.68C10.52 8.56 10.05 7.42 9.86 6.94C9.67 6.47 9.48 6.53 9.34 6.53H9.05C8.89 6.53 8.71 6.59 8.57 6.74C8.42 6.89 8.02 7.28 8.02 8.08"/>
              </svg>
            </a>
          </div>

          {/* Language Switch Button */}
          <button
            id="toggle-lang-btn"
            onClick={onToggleLang}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-400/50 hover:border-amber-400 text-slate-100 hover:text-amber-400 bg-slate-800/40 hover:bg-slate-800 transition-all font-semibold cursor-pointer"
            title={t['lang-toggle']}
            aria-label={t['lang-toggle']}
          >
            <Globe className="w-3 h-3 text-amber-400" />
            <span className="font-bold">{t['lang-code']}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

