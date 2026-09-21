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
              className="w-full h-full object-cover object-center"
              initial={{ scale: 1.02 }}
              animate={{ scale: 1.10 }}
              transition={{ duration: 7, ease: 'linear' }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Soft, light atmospheric overlays that leave background photos clearly visible */}
        <div className="absolute inset-0 z-[2] bg-white/30 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 z-[3] bg-gradient-to-b from-white/80 via-transparent to-white/85" />
        <div className="absolute inset-0 z-[4] bg-gradient-to-r from-white/40 via-transparent to-white/40" />
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
        {/* Slightly transparent floating frosted glass card */}
        <div className="max-w-3xl mx-auto text-center bg-white/50 sm:bg-white/55 hover:bg-white/60 transition-colors backdrop-blur-md px-6 py-9 sm:px-10 sm:py-12 rounded-3xl border border-white/70 shadow-2xl shadow-slate-900/10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-xs sm:text-sm font-semibold text-[#0f4c81] mb-6 shadow-2xs backdrop-blur-xs"
          >
            <ShieldCheck className="w-4 h-4 text-[#0f4c81] shrink-0" />
            <EditableText translationKey="hero-badge" label="Badge Hero">
              <span>{t['hero-badge']}</span>
            </EditableText>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 opacity-90" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 mb-6 drop-shadow-2xs"
          >
            <EditableText translationKey="hero-title-prefix" label="Titre : Préfixe">
              <span>{t['hero-title-prefix']}</span>
            </EditableText>{' '}
            <span className="text-[#0f4c81] underline decoration-amber-500/60 decoration-wavy decoration-2 underline-offset-8">
              <EditableText translationKey="hero-title-highlight" label="Titre : Mot clé">
                <span>{t['hero-title-highlight']}</span>
              </EditableText>
            </span>{' '}
            <EditableText translationKey="hero-title-suffix" label="Titre : Suffixe">
              <span>{t['hero-title-suffix']}</span>
            </EditableText>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            id="hero-desc"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed mb-8 max-w-2xl mx-auto font-medium"
          >
            <EditableText translationKey="hero-desc" label="Description Hero" as="p">
              {t['hero-desc']}
            </EditableText>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              id="hero-cta-primary"
              href="#contact"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-[#0f4c81] hover:bg-[#0a375e] rounded-xl shadow-lg shadow-[#0f4c81]/25 hover:shadow-xl hover:shadow-[#0f4c81]/30 transition-all duration-200 cursor-pointer"
            >
              <EditableText translationKey="hero-cta-primary" label="Bouton Primaire">
                <span>{t['hero-cta-primary']}</span>
              </EditableText>
              <ArrowRight className="w-5 h-5 text-amber-300" />
            </motion.a>

            <motion.a
              id="hero-cta-secondary"
              href="#services"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold text-slate-800 hover:text-slate-950 bg-white/80 hover:bg-white rounded-xl border border-slate-300 hover:border-slate-400 shadow-sm transition-all duration-200 cursor-pointer backdrop-blur-sm"
            >
              <EditableText translationKey="hero-cta-secondary" label="Bouton Secondaire">
                <span>{t['hero-cta-secondary']}</span>
              </EditableText>
            </motion.a>
          </motion.div>
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


