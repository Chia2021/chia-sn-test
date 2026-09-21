import { useState, useEffect } from 'react';
import { MessageCircle, X, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';

interface WhatsAppButtonProps {
  currentLang: Language;
}

export function WhatsAppButton({ currentLang }: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // WhatsApp numbers for Cameroon offices (Douala headquarters: +237 670 12 34 56)
  // International format without spaces or symbols for wa.me URL
  const whatsappNumber = '237670123456';

  const defaultMessage =
    currentLang === 'FR'
      ? encodeURIComponent(
          'Bonjour Cabinet Chia-SN, je souhaite solliciter une consultation pour un accompagnement comptable et fiscal.'
        )
      : encodeURIComponent(
          'Hello Cabinet Chia-SN, I would like to request a consultation regarding accounting and tax advisory services.'
        );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  // Reveal the floating button after slight scroll or after 2.5s on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsVisible(true);
      }
    };

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Show a gentle helper prompt on mobile after 5s once visible if user hasn't interacted
  useEffect(() => {
    if (isVisible && !hasInteracted) {
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(true);
      }, 4000);

      // Auto-hide the gentle tooltip after 9 seconds
      const autoDismissTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 13000);

      return () => {
        clearTimeout(tooltipTimer);
        clearTimeout(autoDismissTimer);
      };
    }
  }, [isVisible, hasInteracted]);

  const handleOpenChat = () => {
    setHasInteracted(true);
    setShowTooltip(false);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="floating-whatsapp-container"
      className="fixed bottom-6 left-5 z-40 sm:bottom-8 sm:left-6"
    >
      <AnimatePresence>
        {isVisible && (
          <div className="relative flex items-center">
            {/* Contextual Consultation Tooltip / Popover Bubble */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: -12, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute bottom-16 left-0 w-64 p-3.5 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 text-xs backdrop-blur-md"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold text-emerald-400">
                        {currentLang === 'FR' ? 'En ligne • Cabinet Chia-SN' : 'Online • Chia-SN'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTooltip(false);
                        setHasInteracted(true);
                      }}
                      className="text-slate-400 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                      aria-label="Close message"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    {currentLang === 'FR'
                      ? 'Besoin d’un conseil fiscal ou d’une assistance DSF ? Échangez directement sur WhatsApp avec un associé.'
                      : 'Need urgent tax advice or DSF assistance? Chat directly on WhatsApp with a partner.'}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-semibold text-emerald-300">
                    <button
                      type="button"
                      onClick={handleOpenChat}
                      className="hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{currentLang === 'FR' ? 'Démarrer le chat' : 'Start chat'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <span className="text-slate-500 font-normal">Douala & Yaoundé</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Floating Action Button */}
            <motion.button
              id="btn-floating-whatsapp"
              type="button"
              onClick={handleOpenChat}
              initial={{ opacity: 0, scale: 0.6, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 15 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 22,
              }}
              className="relative flex items-center gap-2.5 pl-3.5 pr-4 py-3 sm:py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-2xl shadow-emerald-600/30 transition-colors border border-white/20 cursor-pointer group"
              aria-label={
                currentLang === 'FR'
                  ? 'Contacter Cabinet Chia-SN sur WhatsApp'
                  : 'Contact Cabinet Chia-SN via WhatsApp'
              }
            >
              {/* Pulsing ring around button */}
              <span className="absolute -inset-1 rounded-full bg-[#25D366]/35 animate-ping -z-10 pointer-events-none" />

              {/* Official WhatsApp SVG Logo */}
              <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                <svg
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>

              {/* Text label with live badge */}
              <div className="flex flex-col text-left leading-none">
                <span className="text-[10px] font-medium tracking-wide uppercase text-emerald-100/90">
                  {currentLang === 'FR' ? 'Consultation Directe' : 'Direct Consultation'}
                </span>
                <span className="text-sm font-bold tracking-tight text-white mt-0.5">
                  WhatsApp
                </span>
              </div>

              {/* Online indicator dot */}
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-200 border-2 border-[#25D366] ml-0.5" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
