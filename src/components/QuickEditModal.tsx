import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit3, X, Check, Globe } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { Language } from '../types';

interface QuickEditModalProps {
  currentLang: Language;
}

export function QuickEditModal({ currentLang }: QuickEditModalProps) {
  const { quickEditTarget, setQuickEditTarget, updateTextBilingual } = useCMS();
  const [valFR, setValFR] = useState('');
  const [valEN, setValEN] = useState('');

  useEffect(() => {
    if (quickEditTarget) {
      setValFR(quickEditTarget.currentFR || '');
      setValEN(quickEditTarget.currentEN || '');
    }
  }, [quickEditTarget]);

  if (!quickEditTarget) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTextBilingual(quickEditTarget.key, valFR, valEN);
    setQuickEditTarget(null);
  };

  const isMultiline = valFR.length > 60 || valEN.length > 60;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickEditTarget(null)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 p-6 sm:p-7"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setQuickEditTarget(null)}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0f4c81] flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {currentLang === 'FR' ? 'Modifier le texte' : 'Edit Text Content'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Clé: <span className="text-[#0f4c81] font-semibold">{quickEditTarget.label}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* French version */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#0f4c81]" />
                <span>Version Française (FR)</span>
              </label>
              {isMultiline ? (
                <textarea
                  rows={3}
                  value={valFR}
                  onChange={(e) => setValFR(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#0f4c81] focus:ring-2 focus:ring-blue-100 outline-none text-slate-900"
                />
              ) : (
                <input
                  type="text"
                  value={valFR}
                  onChange={(e) => setValFR(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#0f4c81] focus:ring-2 focus:ring-blue-100 outline-none text-slate-900"
                />
              )}
            </div>

            {/* English version */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>English Version (EN)</span>
              </label>
              {isMultiline ? (
                <textarea
                  rows={3}
                  value={valEN}
                  onChange={(e) => setValEN(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#0f4c81] focus:ring-2 focus:ring-blue-100 outline-none text-slate-900"
                />
              ) : (
                <input
                  type="text"
                  value={valEN}
                  onChange={(e) => setValEN(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#0f4c81] focus:ring-2 focus:ring-blue-100 outline-none text-slate-900"
                />
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuickEditTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                {currentLang === 'FR' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#0f4c81] hover:bg-[#1d70b8] rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{currentLang === 'FR' ? 'Enregistrer les modifications' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
