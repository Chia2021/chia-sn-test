import { useCallback, useEffect, useState } from 'react';
import { AdminUser } from '../../types';
import { supabase } from '../../lib/supabase';
import { mapAdminUserRow } from '../../lib/supabaseMappers';
import {
  STORAGE_KEY_ADMIN_PASS,
  STORAGE_KEY_AUTH,
  STORAGE_KEY_CURRENT_USER,
  STORAGE_KEY_USERS,
  safeStorageGet,
  safeStorageRemove,
  safeStorageSet,
} from './helpers';

export function useAuth() {
  const [masterPassword, setMasterPassword] = useState<string>(
    () => safeStorageGet(STORAGE_KEY_ADMIN_PASS) || ''
  );

  const [users, setUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = safeStorageGet(STORAGE_KEY_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved users:', e);
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const saved = safeStorageGet(STORAGE_KEY_CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse current user:', e);
    }
    return null;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const hasStoredAuth = safeStorageGet(STORAGE_KEY_AUTH) === 'true';
    const hasStoredCurrentUser = !!safeStorageGet(STORAGE_KEY_CURRENT_USER);
    return hasStoredAuth && hasStoredCurrentUser;
  });

  const saveUsers = useCallback((updatedUsers: AdminUser[]) => {
    setUsers(updatedUsers);
    try {
      safeStorageSet(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));
    } catch (err) {
      console.error('LocalStorage save error for users:', err);
    }
  }, []);

  const loadAdminUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const nextUsers = (data ?? []).map((row) => mapAdminUserRow(row));
      setUsers(nextUsers);
      safeStorageSet(STORAGE_KEY_USERS, JSON.stringify(nextUsers));

      setCurrentUser((prev) => {
        if (!prev) return prev;
        const refreshedCurrent = nextUsers.find((user) => user.id === prev.id) ?? prev;
        safeStorageSet(STORAGE_KEY_CURRENT_USER, JSON.stringify(refreshedCurrent));
        return refreshedCurrent;
      });
    } catch (error) {
      console.error('Failed to load users from Supabase admin_users:', error);
    }
  }, []);

  // ---- Session sync + auth listener ----

  useEffect(() => {
    let isMounted = true;

    const syncSupabaseSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (!session) {
          setCurrentUser(null);
          setIsAdmin(false);
          safeStorageRemove(STORAGE_KEY_AUTH);
          safeStorageRemove(STORAGE_KEY_CURRENT_USER);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (profileData) {
          const currentAdmin = mapAdminUserRow(profileData);
          setCurrentUser(currentAdmin);
          setIsAdmin(Boolean(currentAdmin.isActive));
          safeStorageSet(STORAGE_KEY_AUTH, 'true');
          safeStorageSet(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentAdmin));
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
          safeStorageRemove(STORAGE_KEY_AUTH);
          safeStorageRemove(STORAGE_KEY_CURRENT_USER);
        }
      } catch (error) {
        console.error('Supabase auth session sync failed:', error);
      }
    };

    void syncSupabaseSession();
    void loadAdminUsers();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setCurrentUser(null);
        setIsAdmin(false);
        safeStorageRemove(STORAGE_KEY_AUTH);
        safeStorageRemove(STORAGE_KEY_CURRENT_USER);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Supabase admin profile lookup failed after auth change:', profileError);
        return;
      }

      if (profileData) {
        const nextUser = mapAdminUserRow(profileData);
        setCurrentUser(nextUser);
        setIsAdmin(Boolean(nextUser.isActive));
        safeStorageSet(STORAGE_KEY_AUTH, 'true');
        safeStorageSet(STORAGE_KEY_CURRENT_USER, JSON.stringify(nextUser));
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
        safeStorageRemove(STORAGE_KEY_AUTH);
        safeStorageRemove(STORAGE_KEY_CURRENT_USER);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [loadAdminUsers]);

  // ---- Mutators ----

  const updateMasterAdminPassword = useCallback(
    (currentPass: string, newPass: string): { success: boolean; message: string } => {
      if (currentPass.trim() !== masterPassword.trim()) {
        return { success: false, message: 'Le mot de passe administrateur actuel est incorrect.' };
      }
      if (!newPass || newPass.trim().length < 6) {
        return {
          success: false,
          message: 'Le nouveau mot de passe doit comporter au moins 6 caractères.',
        };
      }

      const cleanNewPass = newPass.trim();
      setMasterPassword(cleanNewPass);
      try {
        safeStorageSet(STORAGE_KEY_ADMIN_PASS, cleanNewPass);
      } catch (err) {
        console.error('Failed to save master admin password:', err);
      }

      setUsers((prev) => {
        const updated = prev.map((u) => {
          if (u.username === 'admin' || u.id === 'user-admin-master') {
            return { ...u, password: cleanNewPass };
          }
          return u;
        });
        try {
          safeStorageSet(STORAGE_KEY_USERS, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      return { success: true, message: 'Mot de passe administrateur mis à jour avec succès !' };
    },
    [masterPassword]
  );

  const loginAdminWithResult = useCallback(
    async (
      identifierOrPassword: string,
      optionalPassword?: string
    ): Promise<{ success: boolean; message?: string; user?: AdminUser }> => {
      const isTwoParams = typeof optionalPassword === 'string' && optionalPassword.length > 0;
      const identifier = isTwoParams ? identifierOrPassword.trim().toLowerCase() : '';
      const password = isTwoParams ? optionalPassword.trim() : identifierOrPassword.trim();

      if (!password) {
        return { success: false, message: 'Veuillez saisir votre mot de passe.' };
      }

      try {
        const lookupValue = (isTwoParams ? identifier : identifierOrPassword.trim().toLowerCase()) || '';
        let emailToLogin = lookupValue;

        if (lookupValue) {
          const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .or(`username.eq.${lookupValue},email.eq.${lookupValue}`)
            .limit(1);

          if (!error && data && data[0]) {
            emailToLogin = data[0].email;
          }
        }

        if (!emailToLogin.includes('@')) {
          const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', lookupValue || 'admin')
            .limit(1);

          if (error) throw error;
          if (!data || data.length === 0) {
            return { success: false, message: 'Identifiant ou mot de passe incorrect.' };
          }
          emailToLogin = data[0].email;
        }

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: emailToLogin,
          password,
        });

        if (authError || !authData.user) {
          return { success: false, message: 'Identifiant ou mot de passe incorrect.' };
        }

        const { data: profileData, error: profileError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profileError || !profileData) {
          return { success: false, message: 'Profil administrateur introuvable dans Supabase.' };
        }

        const loggedUser = mapAdminUserRow(profileData);

        if (!loggedUser.isActive) {
          return { success: false, message: 'Ce compte utilisateur est actuellement désactivé.' };
        }

        const updatedUser: AdminUser = {
          ...loggedUser,
          lastLogin: new Date().toISOString(),
        };

        await supabase
          .from('admin_users')
          .update({ last_login: updatedUser.lastLogin })
          .eq('id', updatedUser.id);

        setUsers((prev) => {
          const nextUsers = prev.map((user) => (user.id === updatedUser.id ? updatedUser : user));
          safeStorageSet(STORAGE_KEY_USERS, JSON.stringify(nextUsers));
          return nextUsers;
        });

        setIsAdmin(true);
        setCurrentUser(updatedUser);
        safeStorageSet(STORAGE_KEY_AUTH, 'true');
        safeStorageSet(STORAGE_KEY_CURRENT_USER, JSON.stringify(updatedUser));

        return { success: true, user: updatedUser };
      } catch (error) {
        console.error('Supabase admin login failed:', error);
        return {
          success: false,
          message: 'La connexion Supabase a échoué. Vérifiez vos identifiants.',
        };
      }
    },
    []
  );

  const loginAdmin = useCallback(
    async (identifierOrPassword: string, optionalPassword?: string): Promise<boolean> => {
      const result = await loginAdminWithResult(identifierOrPassword, optionalPassword);
      return result.success;
    },
    [loginAdminWithResult]
  );

  const logoutAdmin = useCallback(async () => {
    setIsAdmin(false);
    setCurrentUser(null);
    safeStorageRemove(STORAGE_KEY_AUTH);
    safeStorageRemove(STORAGE_KEY_CURRENT_USER);

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Supabase sign-out failed:', error);
    }
  }, []);

  const addUser = useCallback(
    async (
      userData: Omit<AdminUser, 'id' | 'createdAt'>
    ): Promise<{ success: boolean; message: string }> => {
      const usernameClean = userData.username.trim().toLowerCase();
      const emailClean = userData.email.trim().toLowerCase();

      if (users.some((u) => u.username.toLowerCase() === usernameClean)) {
        return { success: false, message: "Ce nom d'utilisateur est déjà utilisé." };
      }
      if (users.some((u) => u.email.toLowerCase() === emailClean)) {
        return { success: false, message: 'Cette adresse e-mail est déjà attribuée.' };
      }
      if (!userData.password || userData.password.trim().length < 6) {
        return {
          success: false,
          message: 'Le mot de passe initial doit contenir au moins 6 caractères.',
        };
      }

      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: emailClean,
          password: userData.password.trim(),
          options: {
            data: {
              full_name: userData.fullName.trim(),
              username: usernameClean,
              role: userData.role,
            },
          },
        });

        if (authError) throw authError;

        const userId = authData.user?.id ?? `user-${Date.now()}`;
        const userRow = {
          id: userId,
          username: usernameClean,
          full_name: userData.fullName.trim(),
          email: emailClean,
          role: userData.role,
          phone: userData.phone ?? null,
          is_active: userData.isActive,
          last_login: null,
          created_at: new Date().toISOString(),
        };

        const { error: profileError } = await supabase
          .from('admin_users')
          .upsert(userRow, { onConflict: 'id' });

        if (profileError) throw profileError;

        await loadAdminUsers();

        return { success: true, message: 'Utilisateur ajouté avec succès !' };
      } catch (error) {
        console.error('Failed to create Supabase admin user:', error);
        return { success: false, message: 'Impossible de créer l’utilisateur dans Supabase Auth.' };
      }
    },
    [loadAdminUsers, users]
  );

  const updateUser = useCallback(
    async (
      userId: string,
      updates: Partial<AdminUser>
    ): Promise<{ success: boolean; message: string }> => {
      const target = users.find((u) => u.id === userId);
      if (!target) return { success: false, message: 'Utilisateur introuvable.' };

      if (updates.username && updates.username.toLowerCase() !== target.username.toLowerCase()) {
        const usernameClean = updates.username.trim().toLowerCase();
        if (users.some((u) => u.id !== userId && u.username.toLowerCase() === usernameClean)) {
          return { success: false, message: "Ce nom d'utilisateur est déjà pris." };
        }
      }

      if (updates.email && updates.email.toLowerCase() !== target.email.toLowerCase()) {
        const emailClean = updates.email.trim().toLowerCase();
        if (users.some((u) => u.id !== userId && u.email.toLowerCase() === emailClean)) {
          return { success: false, message: 'Cette adresse e-mail est déjà utilisée.' };
        }
      }

      if (
        (target.id === 'user-admin-master' || target.username === 'admin') &&
        updates.isActive === false
      ) {
        return {
          success: false,
          message: "Le compte administrateur principal ne peut pas être désactivé.",
        };
      }

      try {
        const rowUpdate: Record<string, string | boolean | null> = {
          username: updates.username?.trim().toLowerCase() ?? target.username,
          full_name: updates.fullName?.trim() ?? target.fullName,
          email: updates.email?.trim().toLowerCase() ?? target.email,
          role: updates.role ?? target.role,
          is_active: updates.isActive ?? target.isActive,
          phone: updates.phone ?? null,
        };

        const { error } = await supabase.from('admin_users').update(rowUpdate).eq('id', userId);
        if (error) throw error;

        const updatedUsers = users.map((u) => (u.id === userId ? { ...u, ...updates } : u));
        saveUsers(updatedUsers);

        if (currentUser && currentUser.id === userId) {
          const updatedCurrent = { ...currentUser, ...updates };
          setCurrentUser(updatedCurrent);
          try {
            safeStorageSet(STORAGE_KEY_CURRENT_USER, JSON.stringify(updatedCurrent));
          } catch (e) {}
        }

        return { success: true, message: 'Informations utilisateur mises à jour.' };
      } catch (error) {
        console.error('Failed to update admin_users profile:', error);
        return {
          success: false,
          message: 'Impossible de mettre à jour le profil admin dans Supabase.',
        };
      }
    },
    [users, currentUser, saveUsers]
  );

  const deleteUser = useCallback(
    async (userId: string): Promise<{ success: boolean; message: string }> => {
      const target = users.find((u) => u.id === userId);
      if (!target) return { success: false, message: 'Utilisateur introuvable.' };

      if (target.id === 'user-admin-master' || target.username === 'admin') {
        return {
          success: false,
          message: "Le compte administrateur principal ne peut pas être supprimé.",
        };
      }

      if (currentUser && currentUser.id === userId) {
        return {
          success: false,
          message: 'Vous ne pouvez pas supprimer votre propre compte actuellement connecté.',
        };
      }

      try {
        const { error } = await supabase.from('admin_users').delete().eq('id', userId);
        if (error) throw error;

        const updated = users.filter((u) => u.id !== userId);
        saveUsers(updated);
        return { success: true, message: 'Compte utilisateur supprimé avec succès.' };
      } catch (error) {
        console.error('Failed to delete admin_users row:', error);
        return {
          success: false,
          message: 'Impossible de supprimer le profil admin depuis Supabase.',
        };
      }
    },
    [users, currentUser, saveUsers]
  );

  const resetUserPassword = useCallback(
    async (userId: string, newPass: string): Promise<{ success: boolean; message: string }> => {
      if (!newPass || newPass.trim().length < 6) {
        return {
          success: false,
          message: 'Le nouveau mot de passe doit comporter au moins 6 caractères.',
        };
      }

      const cleanPass = newPass.trim();
      const target = users.find((u) => u.id === userId);
      if (!target) return { success: false, message: 'Utilisateur introuvable.' };

      try {
        const currentAuthUser = currentUser?.id === userId ? await supabase.auth.getUser() : null;

        if (
          currentAuthUser &&
          currentAuthUser.data.user &&
          currentAuthUser.data.user.id === userId
        ) {
          const { error } = await supabase.auth.updateUser({ password: cleanPass });
          if (error) throw error;
        } else {
          return {
            success: false,
            message:
              'La réinitialisation de mot de passe pour un autre compte nécessite un accès serveur Supabase Auth.',
          };
        }

        return { success: true, message: 'Mot de passe réinitialisé avec succès.' };
      } catch (error) {
        console.error('Failed to reset Supabase password:', error);
        return { success: false, message: 'Impossible de réinitialiser le mot de passe Supabase.' };
      }
    },
    [currentUser, users]
  );

  return {
    // State
    isAdmin,
    adminPassword: masterPassword,
    users,
    currentUser,

    // Auth
    loginAdmin,
    loginAdminWithResult,
    logoutAdmin,
    updateMasterAdminPassword,

    // Users
    addUser,
    updateUser,
    deleteUser,
    resetUserPassword,
  };
}