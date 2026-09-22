import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Language,
  ServiceItem,
  CarouselSlide,
  TestimonialItem,
  OfficeLocation,
  AdminUser,
  UserRole,
  TopBarSettings,
} from '../types';
import { translations as defaultTranslations } from '../data/translations';
import {
  servicesData as defaultServices,
  carouselSlides as defaultSlides,
  testimonialsData as defaultTestimonials,
  officeLocations as defaultOffices,
} from '../data/content';
import { supabase } from '../lib/supabase';
import {
  mapAdminUserRow,
  mapCarouselRow,
  mapOfficeLocationRow,
  mapServiceRow,
  mapTestimonialRow,
  mapTranslationRowsToObject,
  mapTopBarSettingsRow,
} from '../lib/supabaseMappers';

const STORAGE_KEY_AUTH = 'chia_sn_admin_logged_in';
const STORAGE_KEY_CONTENT = 'chia_sn_cms_content_v1';
const STORAGE_KEY_USERS = 'chia_sn_cms_users_v2';
const STORAGE_KEY_ADMIN_PASS = 'chia_sn_admin_master_password_v2';
const STORAGE_KEY_CURRENT_USER = 'chia_sn_current_user_v2';

const safeStorageGet = (key: string) => {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  } catch (error) {
    console.warn(`Unable to read localStorage key: ${key}`, error);
    return null;
  }
};

const safeStorageSet = (key: string, value: string) => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn(`Unable to write localStorage key: ${key}`, error);
  }
};

const safeStorageRemove = (key: string) => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn(`Unable to remove localStorage key: ${key}`, error);
  }
};

const normalizeTestimonialStatus = (item: TestimonialItem): TestimonialItem => {
  const safeStatus: TestimonialItem['status'] =
    item.status === 'pending' || item.status === 'rejected' || item.status === 'published'
      ? item.status
      : 'published';

  return {
    ...item,
    status: safeStatus,
  };
};

export const DEFAULT_HERO_BG =
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80';

export const DEFAULT_HERO_SLIDES: string[] = [
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2000&q=80',
];

export const DEFAULT_TOP_BAR_SETTINGS: TopBarSettings = {
  emailAddress: 'contact@chia-sn.cm',
  phoneNumber: '+237670123456',
  linkedinUrl: 'https://linkedin.com',
  facebookUrl: 'https://facebook.com',
  whatsappNumber: '237670123456',
  showLinkedin: true,
  showFacebook: true,
  showWhatsapp: true,
  showHours: true,
  showAdminButton: true,
};

const normalizeTopBarSettings = (raw: any): TopBarSettings => ({
  emailAddress:
    typeof raw?.emailAddress === 'string'
      ? raw.emailAddress
      : DEFAULT_TOP_BAR_SETTINGS.emailAddress,
  phoneNumber:
    typeof raw?.phoneNumber === 'string'
      ? raw.phoneNumber
      : DEFAULT_TOP_BAR_SETTINGS.phoneNumber,
  linkedinUrl:
    typeof raw?.linkedinUrl === 'string'
      ? raw.linkedinUrl
      : DEFAULT_TOP_BAR_SETTINGS.linkedinUrl,
  facebookUrl:
    typeof raw?.facebookUrl === 'string'
      ? raw.facebookUrl
      : DEFAULT_TOP_BAR_SETTINGS.facebookUrl,
  whatsappNumber:
    typeof raw?.whatsappNumber === 'string'
      ? raw.whatsappNumber
      : DEFAULT_TOP_BAR_SETTINGS.whatsappNumber,
  showLinkedin:
    typeof raw?.showLinkedin === 'boolean'
      ? raw.showLinkedin
      : DEFAULT_TOP_BAR_SETTINGS.showLinkedin,
  showFacebook:
    typeof raw?.showFacebook === 'boolean'
      ? raw.showFacebook
      : DEFAULT_TOP_BAR_SETTINGS.showFacebook,
  showWhatsapp:
    typeof raw?.showWhatsapp === 'boolean'
      ? raw.showWhatsapp
      : DEFAULT_TOP_BAR_SETTINGS.showWhatsapp,
  showHours:
    typeof raw?.showHours === 'boolean'
      ? raw.showHours
      : DEFAULT_TOP_BAR_SETTINGS.showHours,
  showAdminButton:
    typeof raw?.showAdminButton === 'boolean'
      ? raw.showAdminButton
      : DEFAULT_TOP_BAR_SETTINGS.showAdminButton,
});

export interface QuickEditItem {
  key: string;
  label: string;
  currentFR: string;
  currentEN: string;
}

export interface CMSContentData {
  translationsOverride: {
    FR: Record<string, string>;
    EN: Record<string, string>;
  };
  services: ServiceItem[];
  carouselSlides: CarouselSlide[];
  testimonials: TestimonialItem[];
  officeLocations: OfficeLocation[];
  heroBg: string;
  heroImages?: string[];
  topBarSettings: TopBarSettings;
}

interface CMSContextType {
  isAdmin: boolean;
  adminPassword: string;
  users: AdminUser[];
  currentUser: AdminUser | null;
  loginAdmin: (identifierOrPassword: string, optionalPassword?: string) => Promise<boolean>;
  loginAdminWithResult: (
    identifierOrPassword: string,
    optionalPassword?: string
  ) => Promise<{ success: boolean; message?: string; user?: AdminUser }>;
  logoutAdmin: () => void;
  updateMasterAdminPassword: (
    currentPass: string,
    newPass: string
  ) => { success: boolean; message: string };
  addUser: (
    userData: Omit<AdminUser, 'id' | 'createdAt'>
  ) => Promise<{ success: boolean; message: string }>;
  updateUser: (
    userId: string,
    updates: Partial<AdminUser>
  ) => Promise<{ success: boolean; message: string }>;
  deleteUser: (userId: string) => Promise<{ success: boolean; message: string }>;
  resetUserPassword: (
    userId: string,
    newPass: string
  ) => Promise<{ success: boolean; message: string }>;

  isAdminPanelOpen: boolean;
  setIsAdminPanelOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isInlineEditActive: boolean;
  setIsInlineEditActive: (active: boolean) => void;
  quickEditTarget: QuickEditItem | null;
  setQuickEditTarget: (target: QuickEditItem | null) => void;
  triggerQuickEdit: (key: string, label?: string) => void;

  getTranslations: (lang: Language) => Record<string, string>;
  services: ServiceItem[];
  carouselSlides: CarouselSlide[];
  testimonials: TestimonialItem[];
  officeLocations: OfficeLocation[];
  heroBg: string;
  heroImages: string[];
  topBarSettings: TopBarSettings;

  updateText: (key: string, lang: Language, value: string) => void;
  updateTextBilingual: (key: string, frValue: string, enValue: string) => void;
  updateHeroBg: (newBg: string) => void;
  updateHeroImages: (images: string[]) => void;
  addHeroImage: (image: string) => void;
  removeHeroImage: (index: number) => void;
  updateService: (service: ServiceItem) => void;
  addService: (service: ServiceItem) => void;
  deleteService: (serviceId: string) => void;
  updateCarouselSlide: (slide: CarouselSlide) => void;
  addCarouselSlide: (slide: CarouselSlide) => void;
  deleteCarouselSlide: (slideId: string) => void;
  updateTestimonial: (testi: TestimonialItem) => void;
  addTestimonial: (testi: TestimonialItem) => void;
  approveTestimonial: (testiId: string) => void;
  rejectTestimonial: (testiId: string) => void;
  submitClientTestimonial: (
    draft: Omit<TestimonialItem, 'id' | 'status' | 'submittedAt'> & {
      id?: string;
      status?: 'pending';
      submittedAt?: string;
    }
  ) => void;
  deleteTestimonial: (testiId: string) => void;
  updateOfficeLocation: (index: number, location: OfficeLocation) => void;
  updateTopBarSettings: (updates: Partial<TopBarSettings>) => void;

  exportBackup: () => void;
  importBackup: (jsonData: string) => boolean;
  resetToDefaults: () => void;
  hasCustomEdits: boolean;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [masterPassword, setMasterPassword] = useState<string>(() => {
    return safeStorageGet(STORAGE_KEY_ADMIN_PASS) || '';
  });

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

  // Track whether a TopBar upsert is in flight so remote loads don't clobber it
  const topBarUpsertInFlightRef = useRef(false);

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

  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isInlineEditActive, setIsInlineEditActive] = useState(false);
  const [quickEditTarget, setQuickEditTarget] = useState<QuickEditItem | null>(null);

  const [content, setContent] = useState<CMSContentData>(() => {
    try {
      const saved = safeStorageGet(STORAGE_KEY_CONTENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        const heroBgVal = parsed.heroBg || DEFAULT_HERO_BG;
        const heroImgs =
          Array.isArray(parsed.heroImages) && parsed.heroImages.length > 0
            ? parsed.heroImages
            : [heroBgVal, ...DEFAULT_HERO_SLIDES.slice(1)];
        return {
          translationsOverride: {
            FR: parsed.translationsOverride?.FR || {},
            EN: parsed.translationsOverride?.EN || {},
          },
          services: parsed.services?.length ? parsed.services : defaultServices,
          carouselSlides: parsed.carouselSlides?.length ? parsed.carouselSlides : defaultSlides,
          testimonials: parsed.testimonials?.length
            ? (parsed.testimonials as TestimonialItem[]).map(normalizeTestimonialStatus)
            : defaultTestimonials.map(normalizeTestimonialStatus),
          officeLocations: parsed.officeLocations?.length ? parsed.officeLocations : defaultOffices,
          heroBg: heroBgVal,
          heroImages: heroImgs,
          topBarSettings: normalizeTopBarSettings(parsed.topBarSettings),
        };
      }
    } catch (e) {
      console.error('Failed to parse saved CMS content:', e);
    }
    return {
      translationsOverride: { FR: {}, EN: {} },
      services: defaultServices,
      carouselSlides: defaultSlides,
      testimonials: defaultTestimonials.map(normalizeTestimonialStatus),
      officeLocations: defaultOffices,
      heroBg: DEFAULT_HERO_BG,
      heroImages: DEFAULT_HERO_SLIDES,
      topBarSettings: DEFAULT_TOP_BAR_SETTINGS,
    };
  });

  const loadSupabaseContent = useCallback(async () => {
    try {
      const [
        servicesResult,
        slidesResult,
        testimonialsResult,
        officesResult,
        translationsResult,
        topBarResult,
      ] = await Promise.all([
        supabase.from('services').select('*').order('sort_order', { ascending: true }),
        supabase.from('carousel_slides').select('*').order('sort_order', { ascending: true }),
        supabase.from('testimonials').select('*').order('sort_order', { ascending: true }),
        supabase.from('office_locations').select('*').order('sort_order', { ascending: true }),
        supabase.from('page_translations').select('*'),
        supabase.from('site_settings').select('*').eq('id', 'top_bar').maybeSingle(),
      ]);

      if (topBarResult.error) {
        console.warn(
          'site_settings fetch failed (did you create the table?):',
          topBarResult.error.message
        );
      }

      const remoteTopBar = mapTopBarSettingsRow(topBarResult.data);

      // IMPORTANT: if the admin just made an edit and the upsert is still in flight,
      // do NOT overwrite local state with stale remote data on this cycle.
      const upsertInFlight = topBarUpsertInFlightRef.current;

      const hasSupabaseData =
        (servicesResult.data && servicesResult.data.length > 0) ||
        (slidesResult.data && slidesResult.data.length > 0) ||
        (testimonialsResult.data && testimonialsResult.data.length > 0) ||
        (officesResult.data && officesResult.data.length > 0) ||
        (translationsResult.data && translationsResult.data.length > 0) ||
        !!remoteTopBar;

      if (!hasSupabaseData) return;

      setContent((prevContent) => {
        const nextContent: CMSContentData = {
          translationsOverride: {
            FR: translationsResult.data
              ? mapTranslationRowsToObject(translationsResult.data, 'FR')
              : prevContent.translationsOverride.FR,
            EN: translationsResult.data
              ? mapTranslationRowsToObject(translationsResult.data, 'EN')
              : prevContent.translationsOverride.EN,
          },
          services: servicesResult.data?.length
            ? servicesResult.data.map(mapServiceRow)
            : prevContent.services,
          carouselSlides: slidesResult.data?.length
            ? slidesResult.data.map(mapCarouselRow)
            : prevContent.carouselSlides,
          testimonials: testimonialsResult.data?.length
            ? testimonialsResult.data.map(mapTestimonialRow).map(normalizeTestimonialStatus)
            : prevContent.testimonials,
          officeLocations: officesResult.data?.length
            ? officesResult.data.map(mapOfficeLocationRow)
            : prevContent.officeLocations,
          heroBg: prevContent.heroBg || DEFAULT_HERO_BG,
          heroImages:
            prevContent.heroImages && prevContent.heroImages.length > 0
              ? prevContent.heroImages
              : DEFAULT_HERO_SLIDES,
          topBarSettings:
            remoteTopBar && !upsertInFlight
              ? normalizeTopBarSettings(remoteTopBar)
              : prevContent.topBarSettings,
        };

        try {
          safeStorageSet(STORAGE_KEY_CONTENT, JSON.stringify(nextContent));
        } catch (error) {
          console.error('Failed to persist Supabase CMS content locally:', error);
        }

        return nextContent;
      });
    } catch (error) {
      console.error('Failed to load CMS content from Supabase:', error);
    }
  }, []);

  useEffect(() => {
    void loadSupabaseContent();
  }, [loadSupabaseContent]);

  const saveContent = useCallback((updated: CMSContentData) => {
    const normalized: CMSContentData = {
      ...updated,
      testimonials: updated.testimonials.map(normalizeTestimonialStatus),
      topBarSettings: normalizeTopBarSettings(updated.topBarSettings),
    };
    setContent(normalized);
    try {
      safeStorageSet(STORAGE_KEY_CONTENT, JSON.stringify(normalized));
    } catch (err) {
      console.error('LocalStorage save error:', err);
    }
  }, []);

  const saveUsers = useCallback((updatedUsers: AdminUser[]) => {
    setUsers(updatedUsers);
    try {
      safeStorageSet(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));
    } catch (err) {
      console.error('LocalStorage save error for users:', err);
    }
  }, []);

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

      return {
        success: true,
        message: 'Mot de passe administrateur mis à jour avec succès !',
      };
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
        setIsLoginModalOpen(false);

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
    setIsInlineEditActive(false);
    setIsAdminPanelOpen(false);
    setIsLoginModalOpen(false);
    setQuickEditTarget(null);
    safeStorageRemove(STORAGE_KEY_AUTH);
    safeStorageRemove(STORAGE_KEY_CURRENT_USER);

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Supabase sign-out failed:', error);
    }

    if (typeof window !== 'undefined') {
      window.location.reload();
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
        return {
          success: false,
          message: 'Impossible de créer l’utilisateur dans Supabase Auth.',
        };
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

  const getTranslations = useCallback(
    (lang: Language) => {
      const defaults = defaultTranslations[lang] || {};
      const overrides = content.translationsOverride[lang] || {};
      return { ...defaults, ...overrides };
    },
    [content.translationsOverride]
  );

  const updateText = useCallback(
    (key: string, lang: Language, value: string) => {
      const updated: CMSContentData = {
        ...content,
        translationsOverride: {
          ...content.translationsOverride,
          [lang]: {
            ...content.translationsOverride[lang],
            [key]: value,
          },
        },
      };
      saveContent(updated);
    },
    [content, saveContent]
  );

  const updateTextBilingual = useCallback(
    (key: string, frValue: string, enValue: string) => {
      const updated: CMSContentData = {
        ...content,
        translationsOverride: {
          FR: {
            ...content.translationsOverride.FR,
            [key]: frValue,
          },
          EN: {
            ...content.translationsOverride.EN,
            [key]: enValue,
          },
        },
      };
      saveContent(updated);

      // Persist bilingual translation to Supabase page_translations (best effort)
      void (async () => {
        try {
          const rows = [
            { key, locale: 'FR', value: frValue },
            { key, locale: 'EN', value: enValue },
          ];
          const { error } = await supabase
            .from('page_translations')
            .upsert(rows, { onConflict: 'key,locale' });
          if (error) {
            console.warn('page_translations upsert failed:', error.message);
          }
        } catch (err) {
          console.warn('page_translations upsert threw:', err);
        }
      })();
    },
    [content, saveContent]
  );

  const triggerQuickEdit = useCallback(
    (key: string, label?: string) => {
      const fr = content.translationsOverride.FR[key] ?? defaultTranslations.FR[key] ?? '';
      const en = content.translationsOverride.EN[key] ?? defaultTranslations.EN[key] ?? '';
      setQuickEditTarget({
        key,
        label: label || key,
        currentFR: fr,
        currentEN: en,
      });
    },
    [content.translationsOverride]
  );

  const updateHeroBg = useCallback(
    (newBg: string) => {
      const currentList =
        content.heroImages && content.heroImages.length > 0
          ? content.heroImages
          : DEFAULT_HERO_SLIDES;
      const updatedList = [newBg, ...currentList.filter((img) => img !== newBg)];
      saveContent({ ...content, heroBg: newBg, heroImages: updatedList });
    },
    [content, saveContent]
  );

  const updateHeroImages = useCallback(
    (images: string[]) => {
      if (!images.length) return;
      saveContent({
        ...content,
        heroImages: images,
        heroBg: images[0] || content.heroBg,
      });
    },
    [content, saveContent]
  );

  const addHeroImage = useCallback(
    (image: string) => {
      const current =
        content.heroImages && content.heroImages.length > 0
          ? content.heroImages
          : DEFAULT_HERO_SLIDES;
      const updated = [...current, image];
      saveContent({ ...content, heroImages: updated });
    },
    [content, saveContent]
  );

  const removeHeroImage = useCallback(
    (index: number) => {
      const current =
        content.heroImages && content.heroImages.length > 0
          ? content.heroImages
          : DEFAULT_HERO_SLIDES;
      if (current.length <= 1) return;
      const updated = current.filter((_, i) => i !== index);
      saveContent({
        ...content,
        heroImages: updated,
        heroBg: updated[0] || content.heroBg,
      });
    },
    [content, saveContent]
  );

  const updateService = useCallback(
    (updatedService: ServiceItem) => {
      const index = content.services.findIndex((s) => s.id === updatedService.id);
      let newServices: ServiceItem[];
      if (index >= 0) {
        newServices = [...content.services];
        newServices[index] = updatedService;
      } else {
        newServices = [...content.services, updatedService];
      }
      saveContent({ ...content, services: newServices });
    },
    [content, saveContent]
  );

  const addService = useCallback(
    (newService: ServiceItem) => {
      saveContent({ ...content, services: [...content.services, newService] });
    },
    [content, saveContent]
  );

  const deleteService = useCallback(
    (serviceId: string) => {
      const filtered = content.services.filter((s) => s.id !== serviceId);
      saveContent({ ...content, services: filtered });
    },
    [content, saveContent]
  );

  const updateCarouselSlide = useCallback(
    (slide: CarouselSlide) => {
      const index = content.carouselSlides.findIndex((s) => s.id === slide.id);
      let newSlides: CarouselSlide[];
      if (index >= 0) {
        newSlides = [...content.carouselSlides];
        newSlides[index] = slide;
      } else {
        newSlides = [...content.carouselSlides, slide];
      }
      saveContent({ ...content, carouselSlides: newSlides });
    },
    [content, saveContent]
  );

  const addCarouselSlide = useCallback(
    (slide: CarouselSlide) => {
      saveContent({ ...content, carouselSlides: [...content.carouselSlides, slide] });
    },
    [content, saveContent]
  );

  const deleteCarouselSlide = useCallback(
    (slideId: string) => {
      const filtered = content.carouselSlides.filter((s) => s.id !== slideId);
      saveContent({ ...content, carouselSlides: filtered });
    },
    [content, saveContent]
  );

  const updateTestimonial = useCallback(
    (testi: TestimonialItem) => {
      const index = content.testimonials.findIndex((t) => t.id === testi.id);
      let newTestis: TestimonialItem[];
      if (index >= 0) {
        newTestis = [...content.testimonials];
        newTestis[index] = testi;
      } else {
        newTestis = [...content.testimonials, testi];
      }
      saveContent({ ...content, testimonials: newTestis });
    },
    [content, saveContent]
  );

  const addTestimonial = useCallback(
    (testi: TestimonialItem) => {
      saveContent({ ...content, testimonials: [...content.testimonials, testi] });
    },
    [content, saveContent]
  );

  const approveTestimonial = useCallback(
    (testiId: string) => {
      const updated = content.testimonials.map((t) =>
        t.id === testiId
          ? {
              ...t,
              status: 'published' as const,
              submittedAt: t.submittedAt || new Date().toISOString(),
            }
          : t
      );
      saveContent({ ...content, testimonials: updated });
    },
    [content, saveContent]
  );

  const rejectTestimonial = useCallback(
    (testiId: string) => {
      const updated = content.testimonials.map((t) =>
        t.id === testiId
          ? {
              ...t,
              status: 'rejected' as const,
              submittedAt: t.submittedAt || new Date().toISOString(),
            }
          : t
      );
      saveContent({ ...content, testimonials: updated });
    },
    [content, saveContent]
  );

  const submitClientTestimonial = useCallback(
    (
      draft: Omit<TestimonialItem, 'id' | 'status' | 'submittedAt'> & {
        id?: string;
        status?: 'pending';
        submittedAt?: string;
      }
    ) => {
      const newTestimonial: TestimonialItem = {
        ...draft,
        id: draft.id || `pending-${Date.now()}`,
        status: 'pending',
        submittedAt: draft.submittedAt || new Date().toISOString(),
      };
      saveContent({ ...content, testimonials: [...content.testimonials, newTestimonial] });
    },
    [content, saveContent]
  );

  const deleteTestimonial = useCallback(
    (testiId: string) => {
      const filtered = content.testimonials.filter((t) => t.id !== testiId);
      saveContent({ ...content, testimonials: filtered });
    },
    [content, saveContent]
  );

  const updateOfficeLocation = useCallback(
    (index: number, location: OfficeLocation) => {
      const updated = [...content.officeLocations];
      updated[index] = location;
      saveContent({ ...content, officeLocations: updated });
    },
    [content, saveContent]
  );

  const updateTopBarSettings = useCallback(
    (updates: Partial<TopBarSettings>) => {
      const nextSettings = normalizeTopBarSettings({
        ...content.topBarSettings,
        ...updates,
      });

      // 1) Update local state immediately (optimistic)
      saveContent({
        ...content,
        topBarSettings: nextSettings,
      });

      // 2) Push to Supabase in the background
      topBarUpsertInFlightRef.current = true;
      void (async () => {
        try {
          const { error } = await supabase
            .from('site_settings')
            .upsert(
              {
                id: 'top_bar',
                value: nextSettings,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'id' }
            );

          if (error) {
            console.error(
              'Failed to upsert site_settings.top_bar:',
              error.message,
              '— did you create the site_settings table and RLS policies?'
            );
          }
        } catch (err) {
          console.error('Failed to persist TopBar settings to Supabase:', err);
        } finally {
          topBarUpsertInFlightRef.current = false;
        }
      })();
    },
    [content, saveContent]
  );

  const exportBackup = useCallback(() => {
    const jsonStr = JSON.stringify(content, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chia-sn-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content]);

  const importBackup = useCallback(
    (jsonData: string): boolean => {
      try {
        const parsed = JSON.parse(jsonData);
        if (!parsed) return false;
        const heroBgVal = parsed.heroBg || DEFAULT_HERO_BG;
        const heroImgs =
          Array.isArray(parsed.heroImages) && parsed.heroImages.length > 0
            ? parsed.heroImages
            : [heroBgVal, ...DEFAULT_HERO_SLIDES.slice(1)];
        const validContent: CMSContentData = {
          translationsOverride: {
            FR: parsed.translationsOverride?.FR || {},
            EN: parsed.translationsOverride?.EN || {},
          },
          services: parsed.services?.length ? (parsed.services as ServiceItem[]) : defaultServices,
          carouselSlides: parsed.carouselSlides?.length
            ? (parsed.carouselSlides as CarouselSlide[])
            : defaultSlides,
          testimonials: parsed.testimonials?.length
            ? (parsed.testimonials as TestimonialItem[]).map(normalizeTestimonialStatus)
            : defaultTestimonials.map(normalizeTestimonialStatus),
          officeLocations: parsed.officeLocations?.length
            ? (parsed.officeLocations as OfficeLocation[])
            : defaultOffices,
          heroBg: heroBgVal,
          heroImages: heroImgs,
          topBarSettings: normalizeTopBarSettings(parsed.topBarSettings),
        };
        saveContent(validContent);
        return true;
      } catch (err) {
        console.error('Import backup error:', err);
        return false;
      }
    },
    [saveContent]
  );

  const resetToDefaults = useCallback(() => {
    const emptyDefaults: CMSContentData = {
      translationsOverride: { FR: {}, EN: {} },
      services: defaultServices,
      carouselSlides: defaultSlides,
      testimonials: defaultTestimonials.map(normalizeTestimonialStatus),
      officeLocations: defaultOffices,
      heroBg: DEFAULT_HERO_BG,
      heroImages: DEFAULT_HERO_SLIDES,
      topBarSettings: DEFAULT_TOP_BAR_SETTINGS,
    };
    saveContent(emptyDefaults);
  }, [saveContent]);

  const hasCustomEdits = useMemo(() => {
    const hasOverrides =
      Object.keys(content.translationsOverride.FR).length > 0 ||
      Object.keys(content.translationsOverride.EN).length > 0;
    const customHero = content.heroBg !== DEFAULT_HERO_BG;
    return hasOverrides || customHero;
  }, [content]);

  return (
    <CMSContext.Provider
      value={{
        isAdmin,
        adminPassword: masterPassword,
        users,
        currentUser,
        loginAdmin,
        loginAdminWithResult,
        logoutAdmin,
        updateMasterAdminPassword,
        addUser,
        updateUser,
        deleteUser,
        resetUserPassword,
        isAdminPanelOpen,
        setIsAdminPanelOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isInlineEditActive,
        setIsInlineEditActive,
        quickEditTarget,
        setQuickEditTarget,
        triggerQuickEdit,
        getTranslations,
        services: content.services,
        carouselSlides: content.carouselSlides,
        testimonials: content.testimonials,
        officeLocations: content.officeLocations,
        heroBg: content.heroBg,
        heroImages:
          content.heroImages && content.heroImages.length > 0
            ? content.heroImages
            : DEFAULT_HERO_SLIDES,
        topBarSettings: content.topBarSettings,
        updateText,
        updateTextBilingual,
        updateHeroBg,
        updateHeroImages,
        addHeroImage,
        removeHeroImage,
        updateService,
        addService,
        deleteService,
        updateCarouselSlide,
        addCarouselSlide,
        deleteCarouselSlide,
        updateTestimonial,
        addTestimonial,
        approveTestimonial,
        rejectTestimonial,
        submitClientTestimonial,
        deleteTestimonial,
        updateOfficeLocation,
        updateTopBarSettings,
        exportBackup,
        importBackup,
        resetToDefaults,
        hasCustomEdits,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}