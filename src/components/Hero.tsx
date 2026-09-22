import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Award,
  Clock,
  Camera,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { Language } from '../types';
import { useCMS, DEFAULT_HERO_SLIDES } from '../context/CMSContext';
import { EditableText } from './EditableText';

interface HeroProps {
  currentLang: Language;
}

export function Hero({ currentLang }: HeroProps) {
  const { getTranslations, heroBg, heroImages, isAdmin, setIsAdminPanelOpen } = useCMS();
  const t = getTranslations(currentLang);

  // Combine heroBg and heroImages to ensure all slides are available
  const activeImages = useMemo(() => {
    const list =
      heroImages && heroImages.length > 0
        ? heroImages
        : [heroBg, ...DEFAULT_HERO_SLIDES.slice(1)];
    if (heroBg && !list.includes(heroBg)) {
      return [heroBg, ...list];
    }
    return list;
  }, [heroImages, heroBg]);

  const [[currentSlide, direction], setSlide] = useState<[number, number]>([0, 0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const slideCaptions = useMemo(
    () => [
      {
        FR: 'Audit Légal & Commissariat',
        EN: 'Statutory Audit & Certification'
      },
      {
        FR: 'Conseil Fiscal & OHADA',
        EN: 'Tax Advisory & OHADA Compliance'
      },
      {
        FR: 'Tenue & Révision Comptable',
        EN: 'Accounting & Balance Sheets'
      },
      {
        FR: 'Stratégie & Gouvernance',
        EN: 'Corporate Strategy & Advisory'
      }
    ],
    []
  );

  const paginate = useCallback(
    (newDirection: number) => {
      setSlide(([prev]) => {
        const nextIndex = (prev + newDirection + activeImages.length) % activeImages.length;
        return [nextIndex, newDirection];
      });
    },
    [activeImages.length]
  );

  const goToSlide = useCallback((index: number) => {
    setSlide(([prev]) => [index, index > prev ? 1 : -1]);
  }, []);

  // Automatic slide transition timer
  useEffect(() => {
    if (!isPlaying || activeImages.length <= 1) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying, activeImages.length, paginate]);

  // Framer Motion slide variants for background images
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.08
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 240, damping: 28, mass: 1 },
        opacity: { duration: 0.75, ease: 'easeInOut' as const },
        scale: { duration: 6.5, ease: [0.22, 1, 0.36, 1] }
      }
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.03,
      transition: {
        x: { type: 'spring', stiffness: 240, damping: 28, mass: 1 },
        opacity: { duration: 0.75, ease: 'easeInOut' as const }
      }
    })
  };

  const stats = [
    { label: t['stat-compliance'], value: t['stat-compliance-val'], key: 'stat-compliance-val', icon: ShieldCheck },
    { label: t['stat-experience'], value: t['stat-experience-val'], key: 'stat-experience-val', icon: Award },
    { label: t['stat-clients'], value: t['stat-clients-val'], key: 'stat-clients-val', icon: CheckCircle2 },
    { label: t['stat-speed'], value: t['stat-speed-val'], key: 'stat-speed-val', icon: Clock }
  ];

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-white via-sky-50/30 to-slate-50 text-slate-900 min-h-[720px] lg:min-h-[780px] flex items-center border-b border-slate-200/80">
      {/* BACKGROUND SLIDER: Animated with Framer Motion with clear photographic visibility */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <motion.img
              src={activeImages[currentSlide % activeImages.length]}
              alt={`Chia-SN Slide ${(currentSlide % activeImages.length) + 1}`}
              className="w-full h-full object-cover object-center brightness-[0.82] contrast-[1.08] saturate-[1.1]"
              initial={{ scale: 1.02 }}
              animate={{ scale: 1.10 }}
              transition={{ duration: 7, ease: 'linear' }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Keep the photo visible while preserving readability of the hero content */}
        <div className="absolute inset-0 z-[2] bg-white/10" />
        <div className="absolute inset-0 z-[3] bg-gradient-to-b from-white/35 via-white/10 to-white/60" />
        <div className="absolute inset-0 z-[4] bg-gradient-to-r from-slate-100/20 via-transparent to-slate-100/20" />
      </div>

      {/* Admin quick image button */}
      {isAdmin && (
        <button
          type="button"
          onClick={() => setIsAdminPanelOpen(true)}
          className="absolute top-4 right-4 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white backdrop-blur-md text-[#0f4c81] border border-slate-200 text-xs font-semibold shadow-md transition-all cursor-pointer"
          title="Gérer les images de fond du Hero"
        >
          <Camera className="w-4 h-4 text-amber-500" />
          <span>{currentLang === 'FR' ? 'Images Hero CMS' : 'Hero CMS Images'}</span>
        </button>
      )}

      {/* FOREGROUND: Text displays firmly in front with crisp Framer Motion animations */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-20 w-full">
        <div className="mb-6 flex justify-center">
          <div className="group relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/60 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_rgba(15,76,129,0.18)_40%,_rgba(11,53,87,0.82)_100%)] shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-all duration-500 ease-out hover:shadow-[0_34px_90px_rgba(15,23,42,0.42)]">
            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/30 text-[#fef3c7] shadow-inner shadow-white/10">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-100/85">
                    {t['hero-badge']}
                  </p>
                  <p className="truncate text-sm font-semibold text-white sm:text-base">
                    {currentLang === 'FR' ? 'Expertise comptable & conseil fiscal' : 'Accounting & tax advisory'}
                  </p>
                </div>
              </div>

              <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] sm:inline-flex">
                <span>{currentLang === 'FR' ? 'Découvrir plus' : 'Discover more'}</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-300" />
              </div>
            </div>

            <div className="grid max-h-0 grid-rows-[0fr] translate-y-2 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-h-[420px] group-hover:grid-rows-[1fr] group-hover:translate-y-0 group-hover:opacity-100">
              <div className="overflow-hidden border-t border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] backdrop-blur-xl">
                <div className="px-5 py-5 text-left text-slate-100 sm:px-7">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {[
                      { icon: CheckCircle2, label: currentLang === 'FR' ? 'SYSCOHADA & OHADA' : 'SYSCOHADA & OHADA' },
                      { icon: Award, label: currentLang === 'FR' ? 'Conseil stratégique' : 'Strategic guidance' },
                      { icon: Clock, label: currentLang === 'FR' ? 'Réponse rapide' : 'Fast response' }
                    ].map(({ icon: Icon, label }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-50/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                      >
                        <Icon className="h-3.5 w-3.5 text-amber-300" />
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="mb-4">
                    <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                      <EditableText translationKey="hero-title-prefix" label="Titre : Préfixe">
                        <span>{t['hero-title-prefix']}</span>
                      </EditableText>{' '}
                      <span className="text-[#f0f7ff] underline decoration-amber-400/80 decoration-wavy decoration-2 underline-offset-8">
                        <EditableText translationKey="hero-title-highlight" label="Titre : Mot clé">
                          <span>{t['hero-title-highlight']}</span>
                        </EditableText>
                      </span>{' '}
                      <EditableText translationKey="hero-title-suffix" label="Titre : Suffixe">
                        <span>{t['hero-title-suffix']}</span>
                      </EditableText>
                    </h1>
                  </div>

                  <p className="max-w-3xl text-sm leading-relaxed text-slate-100/90 sm:text-base">
                    <EditableText translationKey="hero-desc" label="Description Hero" as="p">
                      {t['hero-desc']}
                    </EditableText>
                  </p>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <motion.a
                      href="#contact"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0f4c81] via-[#114d86] to-[#175b99] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_30px_rgba(15,76,129,0.35)] transition-all hover:brightness-110"
                    >
                      <EditableText translationKey="hero-cta-primary" label="Bouton Primaire">
                        <span>{t['hero-cta-primary']}</span>
                      </EditableText>
                      <ArrowRight className="h-4 w-4 text-amber-300" />
                    </motion.a>

                    <motion.a
                      href="#services"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all hover:bg-white/12"
                    >
                      <EditableText translationKey="hero-cta-secondary" label="Bouton Secondaire">
                        <span>{t['hero-cta-secondary']}</span>
                      </EditableText>
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Key Metrics / Trust Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="flex flex-col items-center text-center p-3.5 sm:p-4 rounded-xl bg-white/90 hover:bg-white backdrop-blur-md border border-slate-200/90 hover:border-blue-200 transition-all shadow-xs hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0f4c81] flex items-center justify-center mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <EditableText translationKey={stat.key} label={`Stat ${idx + 1}`}>
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                    {stat.value}
                  </span>
                </EditableText>
                <span className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-snug">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* SLIDER CONTROLLER: Interactive background slide indicator and navigation */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-xs text-slate-600">
          {/* Active theme caption */}
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-700 font-semibold">
              {slideCaptions[currentSlide % slideCaptions.length]?.[currentLang] || (currentLang === 'FR' ? 'Expertise Agréée' : 'Advisory')}
            </span>
          </div>

          {/* Slide Navigation Controls */}
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => paginate(-1)}
              className="p-1 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title={currentLang === 'FR' ? 'Image précédente' : 'Previous slide'}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Slide Indicators with Framer Motion layoutId */}
            <div className="flex items-center gap-1.5">
              {activeImages.map((_, idx) => {
                const isActive = (currentSlide % activeImages.length) === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className="relative p-1 cursor-pointer"
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isActive ? 'w-6 bg-[#0f4c81]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => paginate(1)}
              className="p-1 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title={currentLang === 'FR' ? 'Image suivante' : 'Next slide'}
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-slate-300">|</span>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="p-1 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title={isPlaying ? (currentLang === 'FR' ? 'Mettre en pause' : 'Pause') : (currentLang === 'FR' ? 'Reprendre' : 'Play')}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Counter */}
            <span className="font-mono text-[11px] text-slate-500 pl-1">
              0{(currentSlide % activeImages.length) + 1} / 0{activeImages.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}


