import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  Quote,
  CheckCircle2,
  Building2,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  Users,
  Sliders
} from 'lucide-react';
import { Language } from '../types';
import { useCMS } from '../context/CMSContext';
import { EditableText } from './EditableText';

interface ClientTestimonialsProps {
  currentLang: Language;
}

export function ClientTestimonials({ currentLang }: ClientTestimonialsProps) {
  const { getTranslations, testimonials, isAdmin, setIsAdminPanelOpen } = useCMS();
  const t = getTranslations(currentLang);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Extract unique services for filtering
  const filterOptions = [
    { key: 'all', label: t['testimonials-filter-all'] },
    { key: 'dsf', label: currentLang === 'FR' ? 'DSF & Fiscalité' : 'DSF & Tax' },
    { key: 'syscohada', label: currentLang === 'FR' ? 'Conformité SYSCOHADA' : 'SYSCOHADA Standards' },
    { key: 'payroll', label: currentLang === 'FR' ? 'Comptabilité & Paie' : 'Bookkeeping & Payroll' },
    { key: 'tax-control', label: currentLang === 'FR' ? 'Contrôle Fiscal' : 'Tax Defense' }
  ];

  const filteredTestimonials = testimonials.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'dsf') {
      return item.id === 'testi-1';
    }
    if (selectedFilter === 'syscohada') {
      return item.id === 'testi-2';
    }
    if (selectedFilter === 'tax-control') {
      return item.id === 'testi-3';
    }
    if (selectedFilter === 'payroll') {
      return item.id === 'testi-4';
    }
    return true;
  });

  const handleCtaClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const trustStats = [
    {
      id: 'stat-clients',
      val: t['testimonials-stat1-val'],
      lbl: t['testimonials-stat1-lbl'],
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: 'stat-satisfaction',
      val: t['testimonials-stat2-val'],
      lbl: t['testimonials-stat2-lbl'],
      icon: Award,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      id: 'stat-penalties',
      val: t['testimonials-stat3-val'],
      lbl: t['testimonials-stat3-lbl'],
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'stat-years',
      val: t['testimonials-stat4-val'],
      lbl: t['testimonials-stat4-lbl'],
      icon: TrendingUp,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    }
  ];

  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-t border-slate-200 relative overflow-hidden"
    >
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 relative">
          {isAdmin && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setIsAdminPanelOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{currentLang === 'FR' ? 'Gérer les avis clients dans le CMS' : 'Manage testimonials in CMS'}</span>
              </button>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-50 text-[#0f4c81] border border-blue-200/80 mb-4 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <EditableText translationKey="testimonials-tag" label="Tag Témoignages">
              <span>{t['testimonials-tag']}</span>
            </EditableText>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            <EditableText translationKey="testimonials-title" label="Titre Témoignages">
              <span>{t['testimonials-title']}</span>
            </EditableText>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed"
          >
            <EditableText translationKey="testimonials-subtitle" label="Sous-titre Témoignages" as="p">
              {t['testimonials-subtitle']}
            </EditableText>
          </motion.div>
        </div>

        {/* Trust Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {trustStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                id={stat.id}
                className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <div className={`p-3 rounded-lg border shrink-0 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    {stat.val}
                  </div>
                  <div className="text-xs font-medium text-slate-500 line-clamp-2">
                    {stat.lbl}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filterOptions.map((filter) => (
            <button
              key={filter.key}
              id={`testimonial-filter-${filter.key}`}
              type="button"
              onClick={() => setSelectedFilter(filter.key)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedFilter === filter.key
                  ? 'bg-[#0f4c81] text-white shadow-sm ring-2 ring-[#0f4c81]/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-14"
        >
          <AnimatePresence mode="popLayout">
            {filteredTestimonials.map((item) => (
              <motion.article
                key={item.id}
                id={`testimonial-card-${item.id}`}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-blue-200 relative"
              >
                {/* Top Row: Service Badge & Stars */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-[#0f4c81] border border-slate-200">
                      <Building2 className="w-3.5 h-3.5 text-[#0f4c81]" />
                      {item.serviceUsed[currentLang]}
                    </span>

                    <div className="flex items-center gap-1" aria-label="5 étoiles sur 5">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Highlight Metric Callout (if present) */}
                  {item.highlightMetric && (
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
                      <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong className="font-bold text-emerald-900">
                          {item.highlightMetric.value}
                        </strong>{' '}
                        • {item.highlightMetric.label[currentLang]}
                      </span>
                    </div>
                  )}

                  {/* Quote Body */}
                  <div className="relative mb-6">
                    <Quote className="w-8 h-8 text-slate-200 absolute -top-2 -left-2 -z-0 opacity-80" />
                    <p className="relative z-10 text-slate-700 text-sm sm:text-base leading-relaxed italic">
                      "{item.quote[currentLang]}"
                    </p>
                  </div>
                </div>

                {/* Author Information */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
                  <div className="flex items-center gap-3.5">
                    {/* Avatar Initials Badge */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0f4c81] to-[#1d70b8] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 ring-2 ring-blue-100">
                      {item.avatarInitials}
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0f4c81] transition-colors">
                        {item.author}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {item.role[currentLang]} •{' '}
                        <span className="text-slate-800 font-semibold">{item.company}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.location}
                        </span>
                        <span>•</span>
                        <span>{item.industry[currentLang]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Verified Partner Badge */}
                  <div
                    title={t['testimonials-verified']}
                    className="hidden sm:flex flex-col items-end shrink-0"
                  >
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {currentLang === 'FR' ? 'Vérifié' : 'Verified'}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Callout Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-[#0f4c81] to-[#0a3153] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
              {t['testimonials-cta-heading']}
            </h3>
            <p className="text-blue-100 text-sm sm:text-base">
              {t['testimonials-cta-desc']}
            </p>
          </div>

          <button
            id="testimonial-cta-contact-btn"
            type="button"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg hover:shadow-xl shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#0f4c81]"
          >
            <span>{t['testimonials-cta-btn']}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
