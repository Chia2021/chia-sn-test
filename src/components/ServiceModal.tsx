import { X, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, ServiceItem } from '../types';
import { useCMS } from '../context/CMSContext';

interface ServiceModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onSelectForConsultation: (serviceTitle: string) => void;
}

export function ServiceModal({
  service,
  isOpen,
  onClose,
  currentLang,
  onSelectForConsultation,
}: ServiceModalProps) {
  if (!service) return null;
  const { getTranslations } = useCMS();
  const t = getTranslations(currentLang);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10"
          >
            {/* Header */}
            <div className="bg-[#0f4c81] text-white p-6 sm:p-8 relative">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                aria-label={t['services-close-modal']}
              >
                <X className="w-5 h-5" />
              </button>

              {service.badge && (
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full mb-3">
                  {service.badge[currentLang]}
                </span>
              )}
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {service.title[currentLang]}
              </h3>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-slate-600 text-base leading-relaxed">
                {service.description[currentLang]}
              </p>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                  {currentLang === 'FR' ? 'Périmètre & Livrables Clés :' : 'Key Scope & Deliverables:'}
                </h4>
                <ul className="space-y-3">
                  {service.deliverables[currentLang].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-sm font-semibold transition-colors"
                >
                  {t['services-close-modal']}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectForConsultation(service.title[currentLang]);
                    onClose();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>{currentLang === 'FR' ? 'Demander un devis pour ce service' : 'Inquire about this service'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
