import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles, Sliders, ImagePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { useCMS } from '../context/CMSContext';
import { EditableText } from './EditableText';

interface CarouselSectionProps {
  currentLang: Language;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.35 },
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: 'spring' as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 },
    },
  }),
};

export function CarouselSection({ currentLang }: CarouselSectionProps) {
  const { getTranslations, carouselSlides, isAdmin, setIsAdminPanelOpen } = useCMS();
  const t = getTranslations(currentLang);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Safe fallback if slides are modified
  const safeIndex = currentIndex >= carouselSlides.length ? 0 : currentIndex;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % (carouselSlides.length || 1));
  }, [carouselSlides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + (carouselSlides.length || 1)) % (carouselSlides.length || 1));
  }, [carouselSlides.length]);

  const goToSlide = (index: number) => {
    setDirection(index > safeIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-play timer
  useEffect(() => {
    if (isPaused || carouselSlides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, carouselSlides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const carouselEl = document.getElementById('carousel-section');
      if (!carouselEl) return;
      const rect = carouselEl.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  const activeSlide = carouselSlides[safeIndex] || carouselSlides[0];

  return (
    <section
      id="carousel-section"
      className="py-20 lg:py-28 bg-slate-100/70 border-b border-slate-200"
      aria-roledescription="carousel"
      aria-label={t['carousel-title']}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 relative">
          {isAdmin && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setIsAdminPanelOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                <span>{currentLang === 'FR' ? 'Gérer les photos du carrousel' : 'Manage carousel slides'}</span>
              </button>
            </div>
          )}

          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0f4c81] bg-blue-100/60 px-3.5 py-1 rounded-full inline-block mb-3">
            <EditableText translationKey="carousel-tag" label="Tag Carrousel">
              <span>{t['carousel-tag']}</span>
            </EditableText>
          </span>
          <h2 id="carousel-title" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            <EditableText translationKey="carousel-title" label="Titre Carrousel">
              <span>{t['carousel-title']}</span>
            </EditableText>
          </h2>
          <div className="w-16 h-1 bg-[#e67e22] mx-auto rounded-full mb-6" />
          <EditableText translationKey="carousel-subtitle" label="Sous-titre Carrousel" as="p" className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {t['carousel-subtitle']}
          </EditableText>
        </div>

        {/* Carousel Visual Frame */}
        <div className="relative max-w-4xl mx-auto bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200/80">
          <div className="relative h-[380px] sm:h-[460px] md:h-[500px] w-full overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={activeSlide.image}
                  alt={activeSlide.title[currentLang]}
                  className="w-full h-full object-cover object-center"
                />

                {/* Dark gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

                {/* Slide Content Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white z-10">
                  <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider mb-3">
                      <Sparkles className="w-3 h-3" />
                      <span>{activeSlide.tag[currentLang]}</span>
                    </span>

                    <h4 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
                      {activeSlide.title[currentLang]}
                    </h4>

                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                      {activeSlide.description[currentLang]}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls: Previous / Next Buttons */}
          <button
            type="button"
            id="carousel-prev-btn"
            onClick={prevSlide}
            aria-label={t['carousel-prev']}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            id="carousel-next-btn"
            onClick={nextSlide}
            aria-label={t['carousel-next']}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Bottom Utility Bar: Play/Pause and Indicators */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="px-2.5 py-1 rounded-full bg-black/40 hover:bg-black/70 text-white text-xs font-medium backdrop-blur-sm border border-white/20 flex items-center gap-1.5 transition-colors"
              title={isPaused ? t['carousel-play'] : t['carousel-pause']}
            >
              {isPaused ? (
                <>
                  <Play className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">Auto</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Slide Indicators / Thumbnails */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {carouselSlides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 h-2.5 bg-[#0f4c81]'
                  : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
