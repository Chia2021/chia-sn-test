import { motion } from 'motion/react';
import {
  Sliders,
  Edit,
  Eye,
  Download,
  LogOut,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { Language } from '../types';

interface AdminFloatingBarProps {
  currentLang: Language;
}

export function AdminFloatingBar({ currentLang }: AdminFloatingBarProps) {
  const {
    isAdmin,
    currentUser,
    logoutAdmin,
    isInlineEditActive,
    setIsInlineEditActive,
    setIsAdminPanelOpen,
    exportBackup,
    resetToDefaults,
    hasCustomEdits,
  } = useCMS();

  if (!isAdmin) return null;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-4xl bg-slate-900/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3"
    >
      {/* Left: Status & Current User */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="truncate max-w-[130px] sm:max-w-[180px]">
            {currentUser?.fullName || (currentLang === 'FR' ? 'Admin Connecté' : 'Admin Active')}
          </span>
        </div>

        {hasCustomEdits && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
            <Sparkles className="w-3 h-3" />
            <span>{currentLang === 'FR' ? 'Modifications enregistrées' : 'Custom edits saved'}</span>
          </span>
        )}
      </div>

      {/* Center & Right: Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Toggle In-Line Edit Mode */}
        <button
          type="button"
          onClick={() => setIsInlineEditActive(!isInlineEditActive)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            isInlineEditActive
              ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title={
            isInlineEditActive
              ? 'Désactiver le mode clic-pour-modifier'
              : 'Activer le clic direct sur les textes pour modifier'
          }
        >
          {isInlineEditActive ? (
            <>
              <Edit className="w-3.5 h-3.5" />
              <span>{currentLang === 'FR' ? 'Édition Directe : Active' : 'Direct Edit : ON'}</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentLang === 'FR' ? 'Édition Directe' : 'Direct Edit'}</span>
            </>
          )}
        </button>

        {/* Full CMS Modal trigger */}
        <button
          type="button"
          onClick={() => setIsAdminPanelOpen(true)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#0f4c81] hover:bg-[#1d70b8] text-white flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{currentLang === 'FR' ? 'Panneau CMS Total' : 'Total CMS Panel'}</span>
        </button>

        {/* Quick Export backup */}
        <button
          type="button"
          onClick={exportBackup}
          className="hidden sm:inline-flex px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 items-center gap-1.5 transition-colors cursor-pointer"
          title="Télécharger une sauvegarde JSON de vos modifications"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export JSON</span>
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={logoutAdmin}
          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
          title={currentLang === 'FR' ? 'Quitter le mode admin' : 'Exit admin mode'}
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
