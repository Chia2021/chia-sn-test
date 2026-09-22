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
  Sliders,
  Send,
  X,
} from 'lucide-react';
import { Language, TestimonialItem } from '../types';
import { useCMS } from '../context/CMSContext';
import { EditableText } from './EditableText';

interface ClientTestimonialsProps {
  currentLang: Language;
}

export function ClientTestimonials({ currentLang }: ClientTestimonialsProps) {
  const { getTranslations, testimonials, isAdmin, setIsAdminPanelOpen, submitClientTestimonial } = useCMS();
  const t = getTranslations(currentLang);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState({
    author: '',
    email: '',
    company: '',
    service: '',
    location: '',
    rating: 5,
    quote: '',
  });

  const publishedTestimonials = testimonials.filter((item) => {
    const status = item.status === 'pending' || item.status === 'rejected' || item.status === 'published'
      ? item.status
      : 'published';
    return status === 'published';
  });

  // Extract unique services for filtering
  const filterOptions = [
    { key: 'all', label: t['testimonials-filter-all'] },
    { key: 'dsf', label: currentLang === 'FR' ? 'DSF & Fiscalité' : 'DSF & Tax' },
    { key: 'syscohada', label: currentLang === 'FR' ? 'Conformité SYSCOHADA' : 'SYSCOHADA Standards' },
    { key: 'payroll', label: currentLang === 'FR' ? 'Comptabilité & Paie' : 'Bookkeeping & Payroll' },
    { key: 'tax-control', label: currentLang === 'FR' ? 'Contrôle Fiscal' : 'Tax Defense' }
  ];

  const filteredTestimonials = publishedTestimonials.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'dsf') {
      return /DSF|tax|fiscal/i.test(item.serviceUsed[currentLang] || item.company || '');
    }
    if (selectedFilter === 'syscohada') {
      return /SYSCOHADA|OHADA|compliance|conformit/i.test(item.serviceUsed[currentLang] || item.company || '');
    }
    if (selectedFilter === 'tax-control') {
      return /contrôle|inspection|audit|tax/i.test(item.serviceUsed[currentLang] || item.company || '');
    }
    if (selectedFilter === 'payroll') {
      return /paie|payroll|bookkeeping|comptabilit/i.test(item.serviceUsed[currentLang] || item.company || '');
    }
    return true;
  });

  const handleCtaClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTestimonialSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.author.trim() || !formState.email.trim() || !formState.company.trim() || !formState.quote.trim()) {
      return;
    }

    const initials = formState.author
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    submitClientTestimonial({
      author: formState.author.trim(),
      email: formState.email.trim(),
      company: formState.company.trim(),
      role: { FR: 'Client', EN: 'Client' },
      industry: { FR: 'Expérience client', EN: 'Client experience' },
      location: formState.location.trim() || 'Cameroun',
      rating: Number(formState.rating) || 5,
      quote: {
        FR: formState.quote.trim(),
        EN: formState.quote.trim(),
      },
      serviceUsed: {
        FR: formState.service.trim() || 'Service de conseil',
        EN: formState.service.trim() || 'Advisory service',
      },
      avatarInitials: initials,
      badge: { FR: 'Soumission client', EN: 'Client submission' },
      status: 'pending',
    });

    setFormState({
      author: '',
      email: '',
      company: '',
      service: '',
      location: '',
      rating: 5,
      quote: '',
    });
    setIsFormOpen(false);
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

        <div className="mb-10 flex justify-center">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#0f4c81] px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(15,76,129,0.22)] transition-all hover:bg-[#1d70b8]"
          >
            <Send className="w-4 h-4" />
            <span>{currentLang === 'FR' ? 'Déposer un témoignage' : 'Share your testimonial'}</span>
          </button>
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              className="mb-12 overflow-hidden rounded-[32px] border border-[#dfeaf6] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_rgba(244,247,252,0.92)_40%,_rgba(225,236,248,0.85)_100%)] p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-6 lg:p-8"
            >
              <div className="mb-6 flex items-start justify-between gap-4 rounded-[24px] border border-slate-200/80 bg-white/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-sm sm:p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f4c81] to-[#173a5a] text-white shadow-[0_12px_30px_rgba(15,76,129,0.28)]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0f4c81]">
                      {currentLang === 'FR' ? 'Témoignage client' : 'Client testimonial'}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                      {currentLang === 'FR' ? 'Votre expérience compte' : 'Your experience matters'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {currentLang === 'FR'
                        ? 'Déposez votre avis. Notre équipe le valide avant publication.'
                        : 'Share your feedback. Our team reviews it before publishing.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-full border border-slate-200 bg-white/70 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close testimonial form"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleTestimonialSubmit} className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    {currentLang === 'FR' ? 'Nom complet' : 'Full name'}
                  </label>
                  <input
                    value={formState.author}
                    onChange={(e) => setFormState((prev) => ({ ...prev, author: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0f4c81] focus:bg-white focus:ring-2 focus:ring-[#0f4c81]/10"
                    placeholder={currentLang === 'FR' ? 'Votre nom' : 'Your name'}
                    required
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    {currentLang === 'FR' ? 'Adresse e-mail' : 'Email address'}
                  </label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0f4c81] focus:bg-white focus:ring-2 focus:ring-[#0f4c81]/10"
                    placeholder={currentLang === 'FR' ? 'prenom@entreprise.cm' : 'name@company.com'}
                    required
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    {currentLang === 'FR' ? 'Entreprise / Structure' : 'Company / Organization'}
                  </label>
                  <input
                    value={formState.company}
                    onChange={(e) => setFormState((prev) => ({ ...prev, company: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0f4c81] focus:bg-white focus:ring-2 focus:ring-[#0f4c81]/10"
                    placeholder={currentLang === 'FR' ? 'Nom de votre entreprise' : 'Your company name'}
                    required
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    {currentLang === 'FR' ? 'Service concerné' : 'Service used'}
                  </label>
                  <input
                    value={formState.service}
                    onChange={(e) => setFormState((prev) => ({ ...prev, service: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0f4c81] focus:bg-white focus:ring-2 focus:ring-[#0f4c81]/10"
                    placeholder={currentLang === 'FR' ? 'Audit, fiscalité, paie...' : 'Audit, tax compliance, payroll...'}
                  />
                </div>

                <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    {currentLang === 'FR' ? 'Localisation' : 'Location'}
                  </label>
                  <input
                    value={formState.location}
                    onChange={(e) => setFormState((prev) => ({ ...prev, location: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0f4c81] focus:bg-white focus:ring-2 focus:ring-[#0f4c81]/10"
                    placeholder={currentLang === 'FR' ? 'Douala, Yaoundé...' : 'Douala, Yaoundé...'}
                  />
                </div>

                <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    {currentLang === 'FR' ? 'Votre note' : 'Your rating'}
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormState((prev) => ({ ...prev, rating: star }))}
                        className="rounded-full p-1 transition hover:scale-110"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          className={`h-6 w-6 ${star <= formState.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    {currentLang === 'FR' ? 'Témoignage' : 'Testimonial'}
                  </label>
                  <textarea
                    value={formState.quote}
                    onChange={(e) => setFormState((prev) => ({ ...prev, quote: e.target.value }))}
                    rows={5}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0f4c81] focus:bg-white focus:ring-2 focus:ring-[#0f4c81]/10"
                    placeholder={currentLang === 'FR' ? 'Partagez votre expérience...' : 'Tell us about your experience...'}
                    required
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0f4c81] to-[#173a5a] px-5 py-3 text-sm font-bold text-white shadow-[0_16px_32px_rgba(15,76,129,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(15,76,129,0.28)]"
                  >
                    <Send className="h-4 w-4" />
                    <span>{currentLang === 'FR' ? 'Soumettre pour validation' : 'Submit for review'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

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
