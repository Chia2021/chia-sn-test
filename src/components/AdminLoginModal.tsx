import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, KeyRound, CheckCircle2, ShieldAlert, Sparkles, User, Eye, EyeOff, BarChart3, PanelTop } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { Language } from '../types';

interface AdminLoginModalProps {
  currentLang: Language;
}

export function AdminLoginModal({ currentLang }: AdminLoginModalProps) {
  const { isLoginModalOpen, setIsLoginModalOpen, loginAdminWithResult } = useCMS();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = await loginAdminWithResult(identifier, password);
    if (!result.success) {
      setErrorMessage(
        result.message ||
          (currentLang === 'FR'
            ? 'Identifiant ou mot de passe incorrect.'
            : 'Invalid username or password.')
      );
    } else {
      setPassword('');
      setErrorMessage(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsLoginModalOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 p-6 sm:p-8"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-[#0f4c81] text-white flex items-center justify-center shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {currentLang === 'FR' ? 'Accès Administrateur CMS' : 'Admin CMS Portal'}
              </h3>
              <p className="text-xs text-slate-500">
                {currentLang === 'FR'
                  ? 'Gestion intégrale des contenus & des utilisateurs'
                  : 'Full control over site content & user accounts'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username or Email */}
            <div>
              <label
                htmlFor="admin-identifier-input"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                {currentLang === 'FR' ? "Nom d'utilisateur ou E-mail" : 'Username or Email'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-identifier-input"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={currentLang === 'FR' ? 'admin ou email@chiasn.cm' : 'admin or email'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0f4c81] focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 text-sm transition-all bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-password-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  {currentLang === 'FR' ? 'Mot de passe' : 'Password'}
                </label>
                <span className="text-[11px] text-slate-400">
                  {currentLang === 'FR' ? 'Identifiants Supabase Auth' : 'Supabase Auth credentials'}
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={currentLang === 'FR' ? '••••••••••••' : 'Enter password...'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-[#0f4c81] focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 text-sm transition-all bg-slate-50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#0f4c81] hover:bg-[#1d70b8] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{currentLang === 'FR' ? 'Se connecter' : 'Log In'}</span>
            </button>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
