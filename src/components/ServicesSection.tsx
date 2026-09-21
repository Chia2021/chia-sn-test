import { useState } from 'react';
import { Calculator, FileSpreadsheet, ShieldCheck, TrendingUp, ArrowRight, Check, Sliders } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, ServiceItem } from '../types';
import { ServiceModal } from './ServiceModal';
import { useCMS } from '../context/CMSContext';
import { EditableText } from './EditableText';

interface ServicesSectionProps {
  currentLang: Language;
  onSelectService: (serviceName: string) => void;
  activeServiceModal?: ServiceItem | null;
  onCloseServiceModal?: () => void;
  onOpenServiceModal?: (service: ServiceItem) => void;
}

export function ServicesSection({
  currentLang,
  onSelectService,
  activeServiceModal,
  onCloseServiceModal,
  onOpenServiceModal,
}: ServicesSectionProps) {
  const { getTranslations, services, isAdmin, setIsAdminPanelOpen } = useCMS();
  const t = getTranslations(currentLang);
  const [internalSelectedService, setInternalSelectedService] = useState<ServiceItem | null>(null);

  const activeModalService = activeServiceModal !== undefined ? activeServiceModal : internalSelectedService;
  const handleOpen = onOpenServiceModal || setInternalSelectedService;
  const handleClose = onCloseServiceModal || (() => setInternalSelectedService(null));

  const getIcon = (iconName: ServiceItem['iconName']) => {
    switch (iconName) {
      case 'calculator':
        return Calculator;
      case 'file-spreadsheet':
        return FileSpreadsheet;
      case 'shield-check':
        return ShieldCheck;
      case 'trending-up':
        return TrendingUp;
      default:
        return Calculator;
    }
  };

  return (
    <section id="services" className="py-20 lg:py-28 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          {isAdmin && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setIsAdminPanelOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{currentLang === 'FR' ? 'Gérer les services dans le CMS' : 'Manage services in CMS'}</span>
              </button>
            </div>
          )}

          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0f4c81] bg-blue-100/60 px-3.5 py-1 rounded-full inline-block mb-3">
            <EditableText translationKey="services-tag" label="Tag Services">
              <span>{t['services-tag']}</span>
            </EditableText>
          </span>
          <h2 id="services-title" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            <EditableText translationKey="services-title" label="Titre Services">
              <span>{t['services-title']}</span>
            </EditableText>
          </h2>
          <div className="w-16 h-1 bg-[#e67e22] mx-auto rounded-full mb-6" />
          <EditableText translationKey="services-subtitle" label="Sous-titre Services" as="p" className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {t['services-subtitle']}
          </EditableText>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-8">
          {services.map((service, index) => {
            const Icon = getIcon(service.iconName);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl p-7 sm:p-8 shadow-sm hover:shadow-xl border border-slate-200 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top card metadata */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-blue-50 text-[#0f4c81] group-hover:bg-[#0f4c81] group-hover:text-white transition-colors duration-300 flex items-center justify-center shrink-0 shadow-inner">
                      <Icon className="w-7 h-7" />
                    </div>
                    {service.badge && (
                      <span className="text-xs font-semibold text-[#0f4c81] bg-blue-50/80 px-3 py-1 rounded-full border border-blue-100">
                        {service.badge[currentLang]}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[#0f4c81] transition-colors mb-3">
                    {service.title[currentLang]}
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                    {service.description[currentLang]}
                  </p>

                  {/* Key deliverables checklist */}
                  <div className="pt-4 border-t border-slate-100 space-y-2 mb-6">
                    {service.deliverables[currentLang].slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => handleOpen(service)}
                    className="text-sm font-bold text-[#0f4c81] hover:text-[#1d70b8] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{t['services-learn-more']}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectService(service.title[currentLang])}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-amber-400 hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    {currentLang === 'FR' ? 'Choisir' : 'Select'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detail Deliverables Modal */}
      <ServiceModal
        service={activeModalService}
        isOpen={!!activeModalService}
        onClose={handleClose}
        currentLang={currentLang}
        onSelectForConsultation={(title) => onSelectService(title)}
      />
    </section>
  );
}
