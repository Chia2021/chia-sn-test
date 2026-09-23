import type {
  Language,
  ServiceItem,
  CarouselSlide,
  TestimonialItem,
  OfficeLocation,
  TopBarSettings,
  LogoSettings,
} from '../../types';

// ---------- Storage keys ----------

export const STORAGE_KEY_AUTH = 'chia_sn_admin_logged_in';
export const STORAGE_KEY_CONTENT = 'chia_sn_cms_content_v1';
export const STORAGE_KEY_USERS = 'chia_sn_cms_users_v2';
export const STORAGE_KEY_ADMIN_PASS = 'chia_sn_admin_master_password_v2';
export const STORAGE_KEY_CURRENT_USER = 'chia_sn_current_user_v2';

// ---------- Safe storage helpers ----------

export const safeStorageGet = (key: string): string | null => {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  } catch (error) {
    console.warn(`Unable to read localStorage key: ${key}`, error);
    return null;
  }
};

export const safeStorageSet = (key: string, value: string): void => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn(`Unable to write localStorage key: ${key}`, error);
  }
};

export const safeStorageRemove = (key: string): void => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn(`Unable to remove localStorage key: ${key}`, error);
  }
};

// ---------- Defaults ----------

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

export const DEFAULT_LOGO_SETTINGS: LogoSettings = {
  logoUrl: null,
  brandName: 'Chia',
  brandNameHighlight: '-SN',
  subtitleFR: 'Compta & Conseil Fiscal',
  subtitleEN: 'Accounting & Tax Advisory',
  showSubtitle: true,
  logoSize: 'md',
};

// ---------- Normalizers ----------

export const normalizeTestimonialStatus = (item: TestimonialItem): TestimonialItem => {
  const safeStatus: TestimonialItem['status'] =
    item.status === 'pending' || item.status === 'rejected' || item.status === 'published'
      ? item.status
      : 'published';

  return { ...item, status: safeStatus };
};

export const normalizeTopBarSettings = (raw: any): TopBarSettings => ({
  emailAddress:
    typeof raw?.emailAddress === 'string'
      ? raw.emailAddress
      : DEFAULT_TOP_BAR_SETTINGS.emailAddress,
  phoneNumber:
    typeof raw?.phoneNumber === 'string' ? raw.phoneNumber : DEFAULT_TOP_BAR_SETTINGS.phoneNumber,
  linkedinUrl:
    typeof raw?.linkedinUrl === 'string' ? raw.linkedinUrl : DEFAULT_TOP_BAR_SETTINGS.linkedinUrl,
  facebookUrl:
    typeof raw?.facebookUrl === 'string' ? raw.facebookUrl : DEFAULT_TOP_BAR_SETTINGS.facebookUrl,
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
    typeof raw?.showHours === 'boolean' ? raw.showHours : DEFAULT_TOP_BAR_SETTINGS.showHours,
  showAdminButton:
    typeof raw?.showAdminButton === 'boolean'
      ? raw.showAdminButton
      : DEFAULT_TOP_BAR_SETTINGS.showAdminButton,
});

export const normalizeLogoSettings = (raw: any): LogoSettings => ({
  logoUrl: typeof raw?.logoUrl === 'string' && raw.logoUrl.length > 0 ? raw.logoUrl : null,
  brandName: typeof raw?.brandName === 'string' ? raw.brandName : DEFAULT_LOGO_SETTINGS.brandName,
  brandNameHighlight:
    typeof raw?.brandNameHighlight === 'string'
      ? raw.brandNameHighlight
      : DEFAULT_LOGO_SETTINGS.brandNameHighlight,
  subtitleFR:
    typeof raw?.subtitleFR === 'string' ? raw.subtitleFR : DEFAULT_LOGO_SETTINGS.subtitleFR,
  subtitleEN:
    typeof raw?.subtitleEN === 'string' ? raw.subtitleEN : DEFAULT_LOGO_SETTINGS.subtitleEN,
  showSubtitle:
    typeof raw?.showSubtitle === 'boolean' ? raw.showSubtitle : DEFAULT_LOGO_SETTINGS.showSubtitle,
  logoSize:
    raw?.logoSize === 'sm' || raw?.logoSize === 'md' || raw?.logoSize === 'lg'
      ? raw.logoSize
      : DEFAULT_LOGO_SETTINGS.logoSize,
});

// ---------- Shared types ----------

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
  logoSettings: LogoSettings;
}