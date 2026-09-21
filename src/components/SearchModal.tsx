import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Calculator,
  ShieldCheck,
  Building2,
  Award,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CornerDownLeft,
  ChevronRight,
  FileSpreadsheet,
  BookOpen
} from 'lucide-react';
import { Language, SearchCategory, SearchItem } from '../types';
import { useCMS } from '../context/CMSContext';
import { searchIndexData, popularSearchQueries } from '../data/searchData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onSelectServiceModal: (serviceId: string) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  currentLang,
  onSelectServiceModal
}: SearchModalProps) {
  const { getTranslations } = useCMS();
  const t = getTranslations(currentLang);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedCategory('all');
      setActiveIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Accent-insensitive normalization helper
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // Filtered results
  const results = useMemo(() => {
    const cleanQuery = normalize(query.trim());

    return searchIndexData.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // If no query, show all items in this category
      if (!cleanQuery) return true;

      const titleMatch = normalize(item.title[currentLang] || '').includes(cleanQuery);
      const descMatch = normalize(item.description[currentLang] || '').includes(cleanQuery);
      const tagMatch = item.tags.some((tag) => normalize(tag).includes(cleanQuery));
      const badgeMatch = item.badge
        ? normalize(item.badge[currentLang] || '').includes(cleanQuery)
        : false;

      // Also search opposite language as helpful fallback
      const otherLang: Language = currentLang === 'FR' ? 'EN' : 'FR';
      const altTitleMatch = normalize(item.title[otherLang] || '').includes(cleanQuery);

      return titleMatch || descMatch || tagMatch || badgeMatch || altTitleMatch;
    });
  }, [query, selectedCategory, currentLang]);

  // Reset activeIndex when query or category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query, selectedCategory]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(
        `[data-search-index="${activeIndex}"]`
      ) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeIndex]);

  // Handle item selection
  const handleItemSelect = (item: SearchItem) => {
    onClose();

    setTimeout(() => {
      if (item.actionType === 'open-service' && item.serviceId) {
        onSelectServiceModal(item.serviceId);
      } else if (item.targetSection === '#terms') {
        window.location.hash = '#terms';
      } else {
        const targetEl = document.querySelector(item.targetSection);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[activeIndex]) {
        handleItemSelect(results[activeIndex]);
      }
    }
  };

  const getCategoryIcon = (category: SearchItem['category']) => {
    switch (category) {
      case 'services':
        return Calculator;
      case 'compliance':
        return ShieldCheck;
      case 'locations':
        return Building2;
      case 'testimonials':
        return Award;
      default:
        return FileSpreadsheet;
    }
  };

  const getCategoryBadgeColor = (category: SearchItem['category']) => {
    switch (category) {
      case 'services':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'compliance':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'locations':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'testimonials':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const categoryTabs: { id: SearchCategory; label: string }[] = [
    { id: 'all', label: t['search-cat-all'] },
    { id: 'services', label: t['search-cat-services'] },
    { id: 'compliance', label: t['search-cat-compliance'] },
    { id: 'locations', label: t['search-cat-locations'] },
    { id: 'testimonials', label: t['search-cat-testimonials'] }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="search-modal-portal"
        className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8 sm:my-12 flex flex-col max-h-[85vh]"
          onKeyDown={handleKeyDown}
        >
          {/* Top Search Bar */}
          <div className="relative p-4 sm:p-5 border-b border-slate-200 bg-white">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-[#0f4c81] absolute left-3.5 pointer-events-none" />
              <input
                ref={inputRef}
                id="search-modal-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t['search-placeholder']}
                className="w-full pl-11 pr-20 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 text-sm sm:text-base rounded-xl border border-slate-200 focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/20 outline-none transition-all placeholder:text-slate-400"
              />

              <div className="absolute right-3 flex items-center gap-1.5">
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                    aria-label="Effacer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 border border-slate-200 rounded-md transition-colors"
                  aria-label={t['search-press-esc']}
                >
                  ESC
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-3 scrollbar-none pb-0.5">
              {categoryTabs.map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`search-filter-${tab.id}`}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0f4c81] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Suggestions (Shown when query is empty) */}
          {!query && (
            <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {t['search-popular-title']}:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {popularSearchQueries.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(item.query);
                      inputRef.current?.focus();
                    }}
                    className="text-xs font-medium px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:text-[#0f4c81] hover:border-blue-300 hover:bg-blue-50/40 transition-colors shadow-2xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          <div
            ref={resultsContainerRef}
            className="overflow-y-auto p-3 sm:p-4 space-y-2 flex-1 scrollbar-thin scrollbar-thumb-slate-200"
          >
            {results.length > 0 ? (
              results.map((item, index) => {
                const isSelected = index === activeIndex;
                const Icon = getCategoryIcon(item.category);
                const badgeColor = getCategoryBadgeColor(item.category);

                return (
                  <div
                    key={item.id}
                    data-search-index={index}
                    id={`search-result-${item.id}`}
                    onClick={() => handleItemSelect(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                      isSelected
                        ? 'bg-blue-50/70 border-[#0f4c81] ring-1 ring-[#0f4c81]/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div
                        className={`p-2.5 rounded-lg border shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                            : 'bg-slate-100 text-[#0f4c81] border-slate-200'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4
                            className={`text-sm sm:text-base font-bold leading-tight ${
                              isSelected ? 'text-[#0f4c81]' : 'text-slate-900'
                            }`}
                          >
                            {item.title[currentLang]}
                          </h4>

                          {item.badge && (
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor}`}
                            >
                              {item.badge[currentLang]}
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {item.description[currentLang]}
                        </p>
                      </div>
                    </div>

                    {/* Action Shortcut / Icon */}
                    <div className="shrink-0 flex items-center gap-1 self-center pl-2">
                      <span
                        className={`hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                          isSelected
                            ? 'bg-[#0f4c81] text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}
                      >
                        <span>
                          {item.actionType === 'open-service'
                            ? t['search-action-open']
                            : t['search-action-view']}
                        </span>
                        {item.actionType === 'open-service' ? (
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5" />
                        )}
                      </span>

                      <span className="sm:hidden text-slate-400 group-hover:text-[#0f4c81]">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              /* No Results State */
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-1">
                  {t['search-no-results']} "{query}"
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                  {t['search-no-results-hint']}
                </p>

                <button
                  type="button"
                  id="search-no-results-contact-btn"
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      const contactEl = document.getElementById('contact');
                      if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-[#0f4c81] text-white hover:bg-[#1d70b8] transition-colors shadow-xs"
                >
                  <span>{t['search-consult-cta']}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Footer Keyboard Hints */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 shadow-2xs font-mono font-bold">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 shadow-2xs font-mono font-bold">
                  ↓
                </kbd>
                <span className="hidden sm:inline">naviguer</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 shadow-2xs font-mono font-bold">
                  ↵
                </kbd>
                <span className="hidden sm:inline">{t['search-press-enter']}</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 shadow-2xs font-mono font-bold">
                  ESC
                </kbd>
                <span className="hidden sm:inline">{t['search-press-esc']}</span>
              </span>
            </div>

            <div className="font-semibold text-slate-600">
              {results.length} {t['search-results-count']}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
