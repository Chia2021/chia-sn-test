export type Language = 'FR' | 'EN';

export interface ServiceItem {
  id: string;
  iconName: 'calculator' | 'file-spreadsheet' | 'shield-check' | 'trending-up' | 'book-open' | 'award';
  title: Record<Language, string>;
  description: Record<Language, string>;
  deliverables: Record<Language, string[]>;
  badge?: Record<Language, string>;
}

export interface CarouselSlide {
  id: string;
  image: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  tag: Record<Language, string>;
}

export interface ContactFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
}



export interface OfficeLocation {
  city: Record<Language, string>;
  address: string;
  phone: string;
  email: string;
  schedule: Record<Language, string>;
}

export interface TestimonialItem {
  id: string;
  author: string;
  email?: string;
  role: Record<Language, string>;
  company: string;
  industry: Record<Language, string>;
  location: string;
  rating: number;
  quote: Record<Language, string>;
  highlightMetric?: {
    value: string;
    label: Record<Language, string>;
  };
  serviceUsed: Record<Language, string>;
  avatarInitials: string;
  badge?: Record<Language, string>;
  status?: 'published' | 'pending' | 'rejected';
  submittedAt?: string;
}

export type SearchCategory = 'all' | 'services' | 'compliance' | 'locations' | 'testimonials';

export interface SearchItem {
  id: string;
  category: 'services' | 'compliance' | 'locations' | 'testimonials';
  title: Record<Language, string>;
  description: Record<Language, string>;
  badge?: Record<Language, string>;
  tags: string[];
  targetSection: string;
  serviceId?: string;
  actionType: 'open-service' | 'scroll-section';
}

export type UserRole = 'super_admin' | 'admin' | 'tax_consultant' | 'auditor' | 'editor';

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  password?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  phone?: string;
}

export interface TopBarSettings {
  emailAddress: string;
  phoneNumber: string;
  linkedinUrl: string;
  facebookUrl: string;
  whatsappNumber: string;
  showLinkedin: boolean;
  showFacebook: boolean;
  showWhatsapp: boolean;
  showHours: boolean;
  showAdminButton: boolean;
}

export interface LogoSettings {
  logoUrl: string | null;
  brandName: string;
  brandNameHighlight: string;
  subtitleFR: string;
  subtitleEN: string;
  showSubtitle: boolean;
  logoSize: 'sm' | 'md' | 'lg';
}

export type ContactMessageStatus = 'new' | 'read' | 'replied' | 'archived';

export interface ContactMessage {
  id: string;
  createdAt: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
  trackingRef?:string;
  status: ContactMessageStatus;
  readAt?: string;
  repliedAt?: string;
  adminNotes?: string;
  
}