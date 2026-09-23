import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Language,
  ServiceItem,
  CarouselSlide,
  TestimonialItem,
  OfficeLocation,
  AdminUser,
  TopBarSettings,
  LogoSettings,
} from '../types';

import {
  CMSContentData,
  QuickEditItem,
  DEFAULT_HERO_SLIDES,
} from './cms/helpers';
import { useAuth } from './cms/useAuth';
import { useContactCounts } from './cms/useContactCounts';
import { useContent } from './cms/useContent';
import { useBackup } from './cms/useBackup';

export { DEFAULT_HERO_BG, DEFAULT_HERO_SLIDES } from './cms/helpers';

interface CMSContextType {
  // Auth
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

  // UI
  isAdminPanelOpen: boolean;
  setIsAdminPanelOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isInlineEditActive: boolean;
  setIsInlineEditActive: (active: boolean) => void;
  quickEditTarget: QuickEditItem | null;
  setQuickEditTarget: (target: QuickEditItem | null) => void;
  triggerQuickEdit: (key: string, label?: string) => void;

  // Content
  getTranslations: (lang: Language) => Record<string, string>;
  services: ServiceItem[];
  carouselSlides: CarouselSlide[];
  testimonials: TestimonialItem[];
  officeLocations: OfficeLocation[];
  heroBg: string;
  heroImages: string[];
  topBarSettings: TopBarSettings;
  logoSettings: LogoSettings;
  unreadContactMessagesCount: number;
  refreshUnreadContactMessages: () => Promise<void>;

  // Mutators
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
  updateLogoSettings: (updates: Partial<LogoSettings>) => void;

  // Persistence
  exportBackup: () => void;
  importBackup: (jsonData: string) => boolean;
  resetToDefaults: () => void;
  hasCustomEdits: boolean;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  // -------- Sub-hooks --------
  const auth = useAuth();
  const contactCounts = useContactCounts(auth.isAdmin);
  const content = useContent();
  const backup = useBackup({
    content: content.content,
    saveContent: content.saveContent,
  });

  // -------- UI state (kept at provider level — belongs to no specific domain) --------
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isInlineEditActive, setIsInlineEditActive] = useState(false);

  // -------- Logout wrapper: awaits pending writes then delegates --------
  const logoutAdmin = useCallback(async () => {
    await content.awaitPendingWrites();
    await auth.logoutAdmin();
    setIsInlineEditActive(false);
    setIsAdminPanelOpen(false);
    setIsLoginModalOpen(false);
    content.setQuickEditTarget(null);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }, 250);
  }, [auth, content]);

  // -------- Assemble the context value --------
  const value: CMSContextType = {
    // Auth
    isAdmin: auth.isAdmin,
    adminPassword: auth.adminPassword,
    users: auth.users,
    currentUser: auth.currentUser,
    loginAdmin: auth.loginAdmin,
    loginAdminWithResult: auth.loginAdminWithResult,
    logoutAdmin,
    updateMasterAdminPassword: auth.updateMasterAdminPassword,
    addUser: auth.addUser,
    updateUser: auth.updateUser,
    deleteUser: auth.deleteUser,
    resetUserPassword: auth.resetUserPassword,

    // UI
    isAdminPanelOpen,
    setIsAdminPanelOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isInlineEditActive,
    setIsInlineEditActive,
    quickEditTarget: content.quickEditTarget,
    setQuickEditTarget: content.setQuickEditTarget,
    triggerQuickEdit: content.triggerQuickEdit,

    // Content
    getTranslations: content.getTranslations,
    services: content.content.services,
    carouselSlides: content.content.carouselSlides,
    testimonials: content.content.testimonials,
    officeLocations: content.content.officeLocations,
    heroBg: content.content.heroBg,
    heroImages:
      content.content.heroImages && content.content.heroImages.length > 0
        ? content.content.heroImages
        : DEFAULT_HERO_SLIDES,
    topBarSettings: content.content.topBarSettings,
    logoSettings: content.content.logoSettings,
    unreadContactMessagesCount: contactCounts.unreadContactMessagesCount,
    refreshUnreadContactMessages: contactCounts.refreshUnreadContactMessages,

    // Mutators
    updateText: content.updateText,
    updateTextBilingual: content.updateTextBilingual,
    updateHeroBg: content.updateHeroBg,
    updateHeroImages: content.updateHeroImages,
    addHeroImage: content.addHeroImage,
    removeHeroImage: content.removeHeroImage,
    updateService: content.updateService,
    addService: content.addService,
    deleteService: content.deleteService,
    updateCarouselSlide: content.updateCarouselSlide,
    addCarouselSlide: content.addCarouselSlide,
    deleteCarouselSlide: content.deleteCarouselSlide,
    updateTestimonial: content.updateTestimonial,
    addTestimonial: content.addTestimonial,
    approveTestimonial: content.approveTestimonial,
    rejectTestimonial: content.rejectTestimonial,
    submitClientTestimonial: content.submitClientTestimonial,
    deleteTestimonial: content.deleteTestimonial,
    updateOfficeLocation: content.updateOfficeLocation,
    updateTopBarSettings: content.updateTopBarSettings,
    updateLogoSettings: content.updateLogoSettings,

    // Persistence
    exportBackup: backup.exportBackup,
    importBackup: backup.importBackup,
    resetToDefaults: backup.resetToDefaults,
    hasCustomEdits: content.hasCustomEdits,
  };

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}