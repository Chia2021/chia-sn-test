import { useState, useMemo, useEffect } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  BookOpen,
  Calendar,
  ShieldAlert,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { supabase } from '../lib/supabase';
import type { FAQCategory, FAQItem } from '../data/faqData';

interface FAQSectionProps {
  currentLang: Language;
}

export function FAQSection({ currentLang }: FAQSectionProps) {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [faqCategories, setFaqCategories] = useState<FAQCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-dsf-deadline');

  useEffect(() => {
    const loadFaqData = async () => {
      const [{ data: itemsData }, { data: categoriesData }] = await Promise.all([
        supabase.from('faq_items').select('*').order('sort_order', { ascending: true }),
        supabase.from('faq_categories').select('*').order('sort_order', { ascending: true }),
      ]);

      if (itemsData) {
        setFaqItems(
          itemsData.map((row) => ({
            id: row.id,
            category: row.category,
            badge: { FR: row.badge_fr, EN: row.badge_en },
            question: { FR: row.question_fr, EN: row.question_en },
            answer: { FR: row.answer_fr, EN: row.answer_en },
            keyTakeaway: row.takeaway_fr || row.takeaway_en
              ? { FR: row.takeaway_fr ?? '', EN: row.takeaway_en ?? '' }
              : undefined,
            reference: row.reference ?? undefined,
          }))
        );
      }

      if (categoriesData) {
        setFaqCategories(
          categoriesData.map((row) => ({
            id: row.id,
            label: { FR: row.label_fr, EN: row.label_en },
          }))
        );
      }
    };

    void loadFaqData();
  }, []);

  const filteredItems = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      const questionText = item.question[currentLang].toLowerCase();
      const answerText = item.answer[currentLang].toLowerCase();
      const badgeText = item.badge[currentLang].toLowerCase();
      const refText = (item.reference || '').toLowerCase();

      return (
        questionText.includes(query) ||
        answerText.includes(query) ||
        badgeText.includes(query) ||
        refText.includes(query)
      );
    });
  }, [activeCategory, searchQuery, currentLang]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const expandAll = () => {
    // If one is expanded, expand none or keep track of all
    if (filteredItems.length > 0) {
      setExpandedId(filteredItems[0].id);
    }
  };

  return (
    <section id="faq" className="py-20 sm:py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      {/* Subtle geometric background decoration */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs sm:text-sm font-bold text-[#0f4c81] mb-4">
            <HelpCircle className="w-4 h-4 text-[#0f4c81]" />
            <span>
              {currentLang === 'FR'
                ? 'Foire Aux Questions & Réglementation'
                : 'Frequently Asked Questions & Regulations'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {currentLang === 'FR' ? (
              <>
                Vos Questions sur la <span className="text-[#0f4c81]">Fiscalité</span> et la{' '}
                <span className="text-[#c0392b]">Comptabilité</span> au Cameroun
              </>
            ) : (
              <>
                Common Questions on <span className="text-[#0f4c81]">Taxation</span> &{' '}
                <span className="text-[#c0392b]">Accounting</span> in Cameroon
              </>
            )}
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {currentLang === 'FR'
              ? 'Comprenez vos obligations selon le Code Général des Impôts (CGI), le SYSCOHADA Révisé et les délais légaux de la Direction Générale des Impôts (DGI).'
              : 'Master your statutory duties under the Cameroon Tax Code (CGI), Revised SYSCOHADA standards, and DGI administrative guidelines.'}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="faq-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLang === 'FR'
                  ? 'Rechercher une question (ex: DSF, 15 mars, taux IS, CNPS, audit...)'
                  : 'Search a question (e.g. DSF, March 15, CIT rates, CNPS, audit...)'
              }
              className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-2xl bg-white border border-slate-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors"
              >
                {currentLang === 'FR' ? 'Effacer' : 'Clear'}
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {faqCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`faq-tab-${cat.id}`}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0f4c81] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.label[currentLang]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-800">
                {currentLang === 'FR'
                  ? 'Aucune réponse ne correspond à votre recherche.'
                  : 'No questions matched your search criteria.'}
              </p>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                {currentLang === 'FR'
                  ? 'Essayez avec un autre mot-clé ou contactez nos experts pour une réponse immédiate et confidentielle.'
                  : 'Try adjusting your keywords or reach out directly to our consultants for personalized advice.'}
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[#0f4c81] text-white text-xs sm:text-sm font-semibold hover:bg-[#1d70b8] transition-colors"
              >
                <span>{currentLang === 'FR' ? 'Consulter un expert' : 'Ask an Expert'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isOpen = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  id={`faq-item-${item.id}`}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                    isOpen
                      ? 'border-[#0f4c81]/40 ring-1 ring-[#0f4c81]/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Question Header / Accordion Trigger */}
                  <button
                    id={`faq-header-${item.id}`}
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-body-${item.id}`}
                    className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-start justify-between gap-4 text-left cursor-pointer select-none"
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0f4c81] border border-blue-100">
                          {item.badge[currentLang]}
                        </span>
                        {item.reference && (
                          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                            <Scale className="w-3 h-3 text-slate-400" />
                            {item.reference}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {item.question[currentLang]}
                      </h3>
                    </div>

                    <div
                      className={`shrink-0 mt-1 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                        isOpen
                          ? 'bg-[#0f4c81] text-white rotate-180'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Content with Framer Motion */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-body-${item.id}`}
                        role="region"
                        aria-labelledby={`faq-header-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-slate-100 text-slate-700 space-y-4">
                          {/* Main answer text formatted */}
                          <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-slate-600">
                            {item.answer[currentLang]}
                          </div>

                          {/* Key Takeaway / Chia-SN Advice Box */}
                          {item.keyTakeaway && (
                            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                              <div className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                                <span className="font-bold text-amber-800">
                                  {currentLang === 'FR' ? 'Point d’attention clé : ' : 'Key Takeaway: '}
                                </span>
                                {item.keyTakeaway[currentLang]}
                              </div>
                            </div>
                          )}

                          {/* Action footer inside question */}
                          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                            <span className="font-mono text-[11px] text-slate-400">
                              Cabinet Chia-SN • Expertise Agréée
                            </span>
                            <a
                              href="#contact"
                              className="font-semibold text-[#0f4c81] hover:text-[#1d70b8] hover:underline inline-flex items-center gap-1"
                            >
                              <span>{currentLang === 'FR' ? 'Poser une question spécifique' : 'Ask about your case'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Help Banner linking to Contact */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#051c34] via-[#0f4c81] to-[#155e75] text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {currentLang === 'FR' ? 'Assistance Fiscale Personnalisée' : 'Tailored Advisory Support'}
            </span>
            <h4 className="text-xl sm:text-2xl font-black tracking-tight">
              {currentLang === 'FR'
                ? 'Une question non traitée ou un dossier urgent ?'
                : 'Have an unlisted question or an urgent tax matter?'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              {currentLang === 'FR'
                ? 'Nos experts-comptables agréés à Douala et Yaoundé réalisent un audit préliminaire confidentiel de votre situation.'
                : 'Our accredited chartered accountants in Douala and Yaoundé provide a confidential preliminary assessment of your files.'}
            </p>
          </div>

          <a
            id="faq-cta-contact"
            href="#contact"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-bold shadow-lg hover:shadow-amber-400/20 transition-all cursor-pointer"
          >
            <span>{currentLang === 'FR' ? 'Contacter un Associé' : 'Consult a Partner'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
