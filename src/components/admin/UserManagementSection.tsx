import React, { useState, useMemo } from 'react';
import {
  Users,
  KeyRound,
  Shield,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  UserCheck,
  UserX,
  X,
  Edit2,
  Calendar,
  Clock,
  Sparkles,
  Phone,
  Mail,
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { AdminUser, Language, UserRole } from '../../types';

interface UserManagementSectionProps {
  currentLang: Language;
}

export function UserManagementSection({ currentLang }: UserManagementSectionProps) {
  const {
    adminPassword,
    users,
    currentUser,
    updateMasterAdminPassword,
    addUser,
    updateUser,
    deleteUser,
    resetUserPassword,
  } = useCMS();

  // Password modification state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  // User management state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [userActionNotice, setUserActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [resettingUser, setResettingUser] = useState<AdminUser | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AdminUser | null>(null);

  // Add user form state
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('admin');
  const [newPass, setNewPass] = useState('');
  const [newIsActive, setNewIsActive] = useState(true);
  const [showNewUserPass, setShowNewUserPass] = useState(false);

  // Edit user form state
  const [editFullName, setEditFullName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('admin');
  const [editIsActive, setEditIsActive] = useState(true);

  // Reset password form state
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmPass, setResetConfirmPass] = useState('');
  const [showResetPass, setShowResetPass] = useState(false);

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone && u.phone.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Handle master password submit
  const handleUpdateMasterPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);

    if (!currentPasswordInput) {
      setPasswordNotice({
        type: 'error',
        message: currentLang === 'FR' ? 'Veuillez saisir votre mot de passe actuel.' : 'Please enter your current password.',
      });
      return;
    }

    if (newPasswordInput.length < 6) {
      setPasswordNotice({
        type: 'error',
        message: currentLang === 'FR' ? 'Le nouveau mot de passe doit comporter au moins 6 caractères.' : 'New password must have at least 6 characters.',
      });
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordNotice({
        type: 'error',
        message: currentLang === 'FR' ? 'Les nouveaux mots de passe ne correspondent pas.' : 'New passwords do not match.',
      });
      return;
    }

    setIsUpdatingPass(true);
    const result = updateMasterAdminPassword(currentPasswordInput, newPasswordInput);
    setIsUpdatingPass(false);

    if (result.success) {
      setPasswordNotice({ type: 'success', message: result.message });
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setTimeout(() => setPasswordNotice(null), 6000);
    } else {
      setPasswordNotice({ type: 'error', message: result.message });
    }
  };

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!newPasswordInput) return 0;
    let score = 0;
    if (newPasswordInput.length >= 6) score += 1;
    if (newPasswordInput.length >= 8) score += 1;
    if (/[A-Z]/.test(newPasswordInput)) score += 1;
    if (/[0-9]/.test(newPasswordInput)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPasswordInput)) score += 1;
    return score;
  }, [newPasswordInput]);

  // Handle add user submit
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserActionNotice(null);

    if (!newFullName.trim() || !newUsername.trim() || !newEmail.trim() || !newPass.trim()) {
      setUserActionNotice({
        type: 'error',
        message: currentLang === 'FR' ? 'Veuillez remplir tous les champs obligatoires.' : 'Please fill all required fields.',
      });
      return;
    }

    const result = await addUser({
      fullName: newFullName.trim(),
      username: newUsername.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      role: newRole,
      password: newPass.trim(),
      isActive: newIsActive,
    });

    if (result.success) {
      setUserActionNotice({ type: 'success', message: result.message });
      setIsAddModalOpen(false);
      // Reset form
      setNewFullName('');
      setNewUsername('');
      setNewEmail('');
      setNewPhone('');
      setNewRole('admin');
      setNewPass('');
      setNewIsActive(true);
      setTimeout(() => setUserActionNotice(null), 5000);
    } else {
      setUserActionNotice({ type: 'error', message: result.message });
    }
  };

  // Open edit modal
  const handleOpenEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setEditFullName(user.fullName);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditRole(user.role);
    setEditIsActive(user.isActive);
  };

  // Handle save edit submit
  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUserActionNotice(null);

    const result = await updateUser(editingUser.id, {
      fullName: editFullName.trim(),
      username: editUsername.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      role: editRole,
      isActive: editIsActive,
    });

    if (result.success) {
      setUserActionNotice({ type: 'success', message: result.message });
      setEditingUser(null);
      setTimeout(() => setUserActionNotice(null), 5000);
    } else {
      setUserActionNotice({ type: 'error', message: result.message });
    }
  };

  // Handle reset password submit
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser) return;
    setUserActionNotice(null);

    if (resetNewPass.length < 6) {
      setUserActionNotice({
        type: 'error',
        message: currentLang === 'FR' ? 'Le mot de passe doit comporter au moins 6 caractères.' : 'Password must be at least 6 characters.',
      });
      return;
    }

    if (resetNewPass !== resetConfirmPass) {
      setUserActionNotice({
        type: 'error',
        message: currentLang === 'FR' ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.',
      });
      return;
    }

    const result = await resetUserPassword(resettingUser.id, resetNewPass);
    if (result.success) {
      setUserActionNotice({
        type: 'success',
        message:
          currentLang === 'FR'
            ? `Mot de passe pour ${resettingUser.fullName} mis à jour avec succès.`
            : `Password for ${resettingUser.fullName} updated successfully.`,
      });
      setResettingUser(null);
      setResetNewPass('');
      setResetConfirmPass('');
      setTimeout(() => setUserActionNotice(null), 5000);
    } else {
      setUserActionNotice({ type: 'error', message: result.message });
    }
  };

  // Handle delete user
  const handleDeleteUser = async (user: AdminUser) => {
    setUserActionNotice(null);
    const result = await deleteUser(user.id);
    setDeleteConfirmUser(null);
    if (result.success) {
      setUserActionNotice({
        type: 'success',
        message:
          currentLang === 'FR'
            ? `Le compte de ${user.fullName} a été supprimé.`
            : `Account for ${user.fullName} has been removed.`,
      });
      setTimeout(() => setUserActionNotice(null), 5000);
    } else {
      setUserActionNotice({ type: 'error', message: result.message });
    }
  };

  // Toggle user active status
  const handleToggleStatus = async (user: AdminUser) => {
    if (user.id === 'user-admin-master' || user.username === 'admin') {
      setUserActionNotice({
        type: 'error',
        message: currentLang === 'FR' ? "Impossible de désactiver l'administrateur principal." : 'Cannot disable primary master admin.',
      });
      setTimeout(() => setUserActionNotice(null), 4000);
      return;
    }

    const result = await updateUser(user.id, { isActive: !user.isActive });
    if (result.success) {
      setUserActionNotice({
        type: 'success',
        message:
          currentLang === 'FR'
            ? `Statut de ${user.fullName} mis à jour : ${!user.isActive ? 'Actif' : 'Inactif'}`
            : `Status for ${user.fullName} updated to ${!user.isActive ? 'Active' : 'Inactive'}`,
      });
      setTimeout(() => setUserActionNotice(null), 4000);
    }
  };

  // Helper for role badges
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return {
          label: currentLang === 'FR' ? 'Super Admin' : 'Super Admin',
          bg: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-600',
        };
      case 'admin':
        return {
          label: currentLang === 'FR' ? 'Administrateur' : 'Administrator',
          bg: 'bg-blue-500/10 text-blue-700 border-blue-200',
          dot: 'bg-blue-600',
        };
      case 'tax_consultant':
        return {
          label: currentLang === 'FR' ? 'Fiscaliste Conseil' : 'Tax Consultant',
          bg: 'bg-amber-500/10 text-amber-800 border-amber-200',
          dot: 'bg-amber-600',
        };
      case 'auditor':
        return {
          label: currentLang === 'FR' ? 'Auditeur / CAC' : 'Auditor / CAC',
          bg: 'bg-emerald-500/10 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
        };
      case 'editor':
        return {
          label: currentLang === 'FR' ? 'Éditeur Contenu' : 'Content Editor',
          bg: 'bg-slate-500/10 text-slate-700 border-slate-200',
          dot: 'bg-slate-600',
        };
      default:
        return {
          label: role,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  // Initials generator
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Top Banner & Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0f4c81] to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-700/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs border border-white/20">
              <Shield className="w-3.5 h-3.5 text-blue-300" />
              <span>{currentLang === 'FR' ? 'Sécurité & Contrôle des Accès' : 'Security & Access Control'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {currentLang === 'FR' ? 'Gestion des Utilisateurs & Mot de Passe' : 'User Management & Admin Credentials'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              {currentLang === 'FR'
                ? "Gérez les collaborateurs ayant accès aux modifications du cabinet, personnalisez le mot de passe administrateur par défaut et contrôlez les privilèges de chaque rôle."
                : 'Manage team members authorized to edit firm content, customize the default master admin password, and assign roles.'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold border border-blue-400/30">
              {currentUser ? getInitials(currentUser.fullName) : 'AD'}
            </div>
            <div className="text-left text-xs">
              <div className="text-slate-300">{currentLang === 'FR' ? 'Connecté en tant que' : 'Logged in as'}</div>
              <div className="font-bold text-white truncate max-w-[140px]">
                {currentUser?.fullName || 'Master Admin'}
              </div>
              <div className="text-[11px] text-blue-300 font-medium capitalize">
                {currentUser?.role ? currentUser.role.replace('_', ' ') : 'Super Admin'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="bg-black/20 rounded-xl p-3">
            <div className="text-slate-300 text-xs">{currentLang === 'FR' ? 'Utilisateurs' : 'Total Users'}</div>
            <div className="text-xl font-bold text-white mt-0.5">{users.length}</div>
          </div>
          <div className="bg-black/20 rounded-xl p-3">
            <div className="text-slate-300 text-xs">{currentLang === 'FR' ? 'Comptes Actifs' : 'Active Accounts'}</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              {users.filter((u) => u.isActive).length}
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3">
            <div className="text-slate-300 text-xs">{currentLang === 'FR' ? 'Super Admins' : 'Super Admins'}</div>
            <div className="text-xl font-bold text-blue-300 mt-0.5">
              {users.filter((u) => u.role === 'super_admin').length}
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3">
            <div className="text-slate-300 text-xs">{currentLang === 'FR' ? 'Mot de passe' : 'Admin Password'}</div>
            <div className="text-xs font-semibold text-amber-300 mt-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>{currentLang === 'FR' ? 'Supabase Auth' : 'Supabase Auth'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global User Action Notification */}
      {userActionNotice && (
        <div
          className={`p-4 rounded-xl text-sm flex items-start gap-3 border ${
            userActionNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          {userActionNotice.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 font-medium">{userActionNotice.message}</div>
          <button
            type="button"
            onClick={() => setUserActionNotice(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION 1: Modify Admin Default Password */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {currentLang === 'FR'
                  ? 'Modifier le Mot de Passe Administrateur'
                  : 'Modify Default Admin Password'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              {currentLang === 'FR'
                ? 'Le mot de passe administrateur est géré via Supabase Auth et le profil admin associé. Ne conservez pas de mot de passe local en dur dans le frontend.'
                : 'Admin passwords are managed via Supabase Auth and the linked admin profile. Do not keep a hardcoded local password in the frontend.'}
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end text-xs">
            <span className="text-slate-400">{currentLang === 'FR' ? 'Compte Maître' : 'Master Account'}</span>
            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded mt-0.5">
              admin
            </span>
          </div>
        </div>

        {/* Password Notice Banner */}
        {passwordNotice && (
          <div
            className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 border ${
              passwordNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {passwordNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-medium">{passwordNotice.message}</div>
          </div>
        )}

        <form onSubmit={handleUpdateMasterPassword} className="space-y-4 max-w-2xl">
          {/* Current Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {currentLang === 'FR' ? 'Mot de passe actuel' : 'Current Password'}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPass ? 'text' : 'password'}
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                placeholder={currentLang === 'FR' ? 'Saisissez votre mot de passe actuel' : 'Enter your current password'}
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f4c81] focus:bg-white focus:outline-hidden transition-all text-slate-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showCurrentPass ? 'Masquer' : 'Afficher'}
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {currentLang === 'FR'
                ? 'Le système utilise Supabase Auth pour les véritables identifiants administrateurs.'
                : 'The system uses Supabase Auth for real admin credentials.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {currentLang === 'FR' ? 'Nouveau mot de passe' : 'New Password'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f4c81] focus:bg-white focus:outline-hidden transition-all text-slate-900"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPasswordInput && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-1.5 flex-1 rounded-full ${
                        passwordStrength >= 1 ? 'bg-amber-400' : 'bg-slate-200'
                      }`}
                    />
                    <div
                      className={`h-1.5 flex-1 rounded-full ${
                        passwordStrength >= 3 ? 'bg-emerald-400' : 'bg-slate-200'
                      }`}
                    />
                    <div
                      className={`h-1.5 flex-1 rounded-full ${
                        passwordStrength >= 4 ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>{currentLang === 'FR' ? 'Force :' : 'Strength:'}</span>
                    <span className="font-semibold">
                      {passwordStrength < 2
                        ? currentLang === 'FR'
                          ? 'Faible (min. 6 car.)'
                          : 'Weak (min. 6 chars)'
                        : passwordStrength < 4
                        ? currentLang === 'FR'
                          ? 'Moyen'
                          : 'Medium'
                        : currentLang === 'FR'
                        ? 'Robuste'
                        : 'Strong'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {currentLang === 'FR' ? 'Confirmer le mot de passe' : 'Confirm New Password'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type={showNewPass ? 'text' : 'password'}
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f4c81] focus:bg-white focus:outline-hidden transition-all text-slate-900"
                minLength={6}
                required
              />
              {confirmPasswordInput && newPasswordInput !== confirmPasswordInput && (
                <p className="text-[11px] text-red-500 mt-1">
                  {currentLang === 'FR'
                    ? 'Les mots de passe ne correspondent pas'
                    : 'Passwords do not match'}
                </p>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isUpdatingPass}
              className="px-5 py-2.5 bg-[#0f4c81] hover:bg-[#1d70b8] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {isUpdatingPass
                  ? currentLang === 'FR'
                    ? 'Mise à jour...'
                    : 'Updating...'
                  : currentLang === 'FR'
                  ? 'Mettre à jour le mot de passe admin'
                  : 'Save New Admin Password'}
              </span>
            </button>

            {adminPassword && (
              <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {currentLang === 'FR'
                    ? 'Mot de passe sécurisé et personnalisé actif'
                    : 'Custom secure password active'}
                </span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* SECTION 2: User Management Table & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-[#0f4c81] border border-blue-200/60">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {currentLang === 'FR' ? 'Gestion des Utilisateurs' : 'User Accounts & Roles'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {currentLang === 'FR'
                ? 'Consultez, ajoutez et gérez les comptes des membres du cabinet avec leurs permissions respectives.'
                : 'View, add, and manage team member accounts and their respective permissions.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#0f4c81] hover:bg-[#1d70b8] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>{currentLang === 'FR' ? 'Ajouter un utilisateur' : 'Add New User'}</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLang === 'FR'
                  ? 'Rechercher par nom, nom d’utilisateur, e-mail...'
                  : 'Search by name, username, email...'
              }
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0f4c81] focus:bg-white text-slate-800"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: currentLang === 'FR' ? 'Tous' : 'All' },
              { id: 'super_admin', label: 'Super Admin' },
              { id: 'admin', label: 'Admin' },
              { id: 'tax_consultant', label: currentLang === 'FR' ? 'Fiscaliste' : 'Tax' },
              { id: 'auditor', label: currentLang === 'FR' ? 'Auditeur' : 'Auditor' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  roleFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3">{currentLang === 'FR' ? 'Utilisateur' : 'User'}</th>
                <th className="px-4 py-3">{currentLang === 'FR' ? 'Rôle' : 'Role'}</th>
                <th className="px-4 py-3">{currentLang === 'FR' ? 'Statut' : 'Status'}</th>
                <th className="px-4 py-3 hidden md:table-cell">{currentLang === 'FR' ? 'Dernière Connexion' : 'Last Login'}</th>
                <th className="px-4 py-3 text-right">{currentLang === 'FR' ? 'Actions' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <div>{currentLang === 'FR' ? 'Aucun utilisateur trouvé.' : 'No users found.'}</div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  const isMasterAdmin = user.id === 'user-admin-master' || user.username === 'admin';
                  const isCurrent = currentUser?.id === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Identity */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase text-white shadow-xs ${
                              isMasterAdmin
                                ? 'bg-indigo-600'
                                : user.role === 'admin'
                                ? 'bg-[#0f4c81]'
                                : user.role === 'tax_consultant'
                                ? 'bg-amber-600'
                                : 'bg-emerald-600'
                            }`}
                          >
                            {getInitials(user.fullName)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-2">
                              <span>{user.fullName}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                                  {currentLang === 'FR' ? 'Vous' : 'You'}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 text-xs flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-slate-600 font-medium">@{user.username}</span>
                              <span>•</span>
                              <span className="text-slate-500">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleBadge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${roleBadge.dot}`} />
                          <span>{roleBadge.label}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          disabled={isMasterAdmin}
                          title={
                            isMasterAdmin
                              ? "L'administrateur maître doit rester actif"
                              : user.isActive
                              ? 'Cliquer pour désactiver'
                              : 'Cliquer pour activer'
                          }
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                            user.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 cursor-pointer'
                          } ${isMasterAdmin ? 'cursor-not-allowed opacity-90' : ''}`}
                        >
                          {user.isActive ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{currentLang === 'FR' ? 'Actif' : 'Active'}</span>
                            </>
                          ) : (
                            <>
                              <UserX className="w-3.5 h-3.5 text-slate-400" />
                              <span>{currentLang === 'FR' ? 'Inactif' : 'Inactive'}</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Last Login */}
                      <td className="px-4 py-3.5 hidden md:table-cell text-slate-500 text-xs">
                        {user.lastLogin ? (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {new Date(user.lastLogin).toLocaleDateString(
                                currentLang === 'FR' ? 'fr-FR' : 'en-US',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">
                            {currentLang === 'FR' ? 'Jamais connecté' : 'Never logged in'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit info */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0f4c81] hover:bg-blue-50 transition-colors cursor-pointer"
                            title={currentLang === 'FR' ? 'Modifier profil' : 'Edit profile'}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Reset password */}
                          <button
                            type="button"
                            onClick={() => {
                              setResettingUser(user);
                              setResetNewPass('');
                              setResetConfirmPass('');
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                            title={
                              currentLang === 'FR'
                                ? 'Réinitialiser mot de passe'
                                : 'Reset password'
                            }
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            disabled={isMasterAdmin || isCurrent}
                            onClick={() => setDeleteConfirmUser(user)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isMasterAdmin || isCurrent
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer'
                            }`}
                            title={
                              isMasterAdmin
                                ? currentLang === 'FR'
                                  ? 'Compte maître protégé'
                                  : 'Protected master account'
                                : isCurrent
                                ? currentLang === 'FR'
                                  ? 'Votre compte actuel'
                                  : 'Your current account'
                                : currentLang === 'FR'
                                ? 'Supprimer utilisateur'
                                : 'Delete user'
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Add User */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg">
                <UserPlus className="w-5 h-5 text-[#0f4c81]" />
                <span>{currentLang === 'FR' ? 'Ajouter un Nouvel Utilisateur' : 'Add New User'}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'FR' ? 'Nom et Prénom' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ex: Flore Ebouélé"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f4c81] focus:bg-white text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'FR' ? "Nom d'utilisateur" : 'Username'} *
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                    placeholder="febouele"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#0f4c81] focus:bg-white text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'FR' ? 'Rôle & Permissions' : 'Role'} *
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f4c81] focus:bg-white text-slate-900"
                  >
                    <option value="admin">{currentLang === 'FR' ? 'Administrateur' : 'Administrator'}</option>
                    <option value="tax_consultant">{currentLang === 'FR' ? 'Fiscaliste Conseil' : 'Tax Consultant'}</option>
                    <option value="auditor">{currentLang === 'FR' ? 'Auditeur / CAC' : 'Auditor / CAC'}</option>
                    <option value="editor">{currentLang === 'FR' ? 'Éditeur Contenu' : 'Content Editor'}</option>
                    <option value="super_admin">{currentLang === 'FR' ? 'Super Administrateur' : 'Super Administrator'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'FR' ? 'Adresse E-mail' : 'Email Address'} *
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="f.ebouele@chiasn.cm"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f4c81] focus:bg-white text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'FR' ? 'Numéro de Téléphone' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+237 699 00 00 00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f4c81] focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'FR' ? 'Mot de passe temporaire' : 'Temporary Password'} *
                </label>
                <div className="relative">
                  <input
                    type={showNewUserPass ? 'text' : 'password'}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Min. 6 caractères"
                    minLength={6}
                    className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f4c81] focus:bg-white text-slate-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewUserPass(!showNewUserPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewUserPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="newUserActive"
                  checked={newIsActive}
                  onChange={(e) => setNewIsActive(e.target.checked)}
                  className="rounded text-[#0f4c81] focus:ring-[#0f4c81] h-4 w-4"
                />
                <label htmlFor="newUserActive" className="text-xs font-medium text-slate-700 cursor-pointer">
                  {currentLang === 'FR' ? 'Compte actif immédiatement' : 'Activate account immediately'}
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {currentLang === 'FR' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  {currentLang === 'FR' ? 'Créer le compte' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit User */}
      {editingUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg">
                <Edit2 className="w-5 h-5 text-[#0f4c81]" />
                <span>{currentLang === 'FR' ? "Modifier l'Utilisateur" : 'Edit User Profile'}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'FR' ? 'Nom et Prénom' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f4c81] focus:bg-white text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'FR' ? "Nom d'utilisateur" : 'Username'} *
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    disabled={editingUser.id === 'user-admin-master' || editingUser.username === 'admin'}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#0f4c81] focus:bg-white text-slate-900 disabled:opacity-60"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'FR' ? 'Rôle & Permissions' : 'Role'} *
                  </label>
                  <select
                    value={editRole}
                    disabled={editingUser.id === 'user-admin-master'}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f4c81] focus:bg-white text-slate-900 disabled:opacity-60"
                  >
                    <option value="super_admin">{currentLang === 'FR' ? 'Super Administrateur' : 'Super Administrator'}</option>
                    <option value="admin">{currentLang === 'FR' ? 'Administrateur' : 'Administrator'}</option>
                    <option value="tax_consultant">{currentLang === 'FR' ? 'Fiscaliste Conseil' : 'Tax Consultant'}</option>
                    <option value="auditor">{currentLang === 'FR' ? 'Auditeur / CAC' : 'Auditor / CAC'}</option>
                    <option value="editor">{currentLang === 'FR' ? 'Éditeur Contenu' : 'Content Editor'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'FR' ? 'Adresse E-mail' : 'Email Address'} *
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f4c81] focus:bg-white text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {currentLang === 'FR' ? 'Numéro de Téléphone' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f4c81] focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              {editingUser.id !== 'user-admin-master' && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="editUserActive"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="rounded text-[#0f4c81] focus:ring-[#0f4c81] h-4 w-4"
                  />
                  <label htmlFor="editUserActive" className="text-xs font-medium text-slate-700 cursor-pointer">
                    {currentLang === 'FR' ? 'Compte actif' : 'Account active'}
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {currentLang === 'FR' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  {currentLang === 'FR' ? 'Enregistrer les modifications' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Reset Password for a User */}
      {resettingUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <span>
                  {currentLang === 'FR'
                    ? `Réinitialiser : ${resettingUser.fullName}`
                    : `Reset Password : ${resettingUser.fullName}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setResettingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
              <p className="text-xs text-slate-500">
                {currentLang === 'FR'
                  ? `Définissez un nouveau mot de passe pour le compte @${resettingUser.username}.`
                  : `Enter a new password for user account @${resettingUser.username}.`}
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'FR' ? 'Nouveau mot de passe' : 'New Password'} *
                </label>
                <div className="relative">
                  <input
                    type={showResetPass ? 'text' : 'password'}
                    value={resetNewPass}
                    onChange={(e) => setResetNewPass(e.target.value)}
                    placeholder="Min. 6 caractères"
                    minLength={6}
                    className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f4c81] focus:bg-white text-slate-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPass(!showResetPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showResetPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLang === 'FR' ? 'Confirmer le mot de passe' : 'Confirm Password'} *
                </label>
                <input
                  type={showResetPass ? 'text' : 'password'}
                  value={resetConfirmPass}
                  onChange={(e) => setResetConfirmPass(e.target.value)}
                  placeholder="Min. 6 caractères"
                  minLength={6}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f4c81] focus:bg-white text-slate-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {currentLang === 'FR' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  {currentLang === 'FR' ? 'Enregistrer le mot de passe' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Delete Confirmation */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-base">
                {currentLang === 'FR' ? 'Supprimer cet utilisateur ?' : 'Delete this user?'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {currentLang === 'FR'
                  ? `Voulez-vous vraiment supprimer le compte de ${deleteConfirmUser.fullName} (@${deleteConfirmUser.username}) ? Cette action est irréversible.`
                  : `Are you sure you want to delete ${deleteConfirmUser.fullName} (@${deleteConfirmUser.username})? This action cannot be undone.`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {currentLang === 'FR' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteUser(deleteConfirmUser)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
              >
                {currentLang === 'FR' ? 'Confirmer la suppression' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
