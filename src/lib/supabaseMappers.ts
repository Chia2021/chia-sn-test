import type { Language, ServiceItem, CarouselSlide, OfficeLocation, TestimonialItem, AdminUser, ContactMessage } from '../types';
import type { FAQCategory, FAQItem } from '../data/faqData';



export const mapServiceRow = (row: Record<string, any>): ServiceItem => ({
  id: row.id,
  iconName: row.icon_name,
  badge: {
    FR: row.badge_fr ?? '',
    EN: row.badge_en ?? '',
  },
  title: {
    FR: row.title_fr ?? '',
    EN: row.title_en ?? '',
  },
  description: {
    FR: row.description_fr ?? '',
    EN: row.description_en ?? '',
  },
  deliverables: {
    FR: Array.isArray(row.deliverables_fr) ? row.deliverables_fr : [],
    EN: Array.isArray(row.deliverables_en) ? row.deliverables_en : [],
  },
});

export const mapServiceToRow = (service: ServiceItem) => ({
  id: service.id,
  icon_name: service.iconName,
  badge_fr: service.badge?.FR ?? '',
  badge_en: service.badge?.EN ?? '',
  title_fr: service.title.FR,
  title_en: service.title.EN,
  description_fr: service.description.FR,
  description_en: service.description.EN,
  deliverables_fr: service.deliverables.FR,
  deliverables_en: service.deliverables.EN,
});

export const mapCarouselRow = (row: Record<string, any>): CarouselSlide => ({
  id: row.id,
  image: row.image_url,
  title: {
    FR: row.title_fr ?? '',
    EN: row.title_en ?? '',
  },
  description: {
    FR: row.description_fr ?? '',
    EN: row.description_en ?? '',
  },
  tag: {
    FR: row.tag_fr ?? '',
    EN: row.tag_en ?? '',
  },
});

export const mapCarouselToRow = (slide: CarouselSlide) => ({
  id: slide.id,
  image_url: slide.image,
  title_fr: slide.title.FR,
  title_en: slide.title.EN,
  description_fr: slide.description.FR,
  description_en: slide.description.EN,
  tag_fr: slide.tag.FR,
  tag_en: slide.tag.EN,
});

export const mapOfficeLocationRow = (row: Record<string, any>): OfficeLocation => ({
  city: {
    FR: row.city_fr ?? '',
    EN: row.city_en ?? '',
  },
  address: row.address ?? '',
  phone: row.phone ?? '',
  email: row.email ?? '',
  schedule: {
    FR: row.schedule_fr ?? '',
    EN: row.schedule_en ?? '',
  },
});

export const mapOfficeLocationToRow = (location: OfficeLocation) => ({
  city_fr: location.city.FR,
  city_en: location.city.EN,
  address: location.address,
  phone: location.phone,
  email: location.email,
  schedule_fr: location.schedule.FR,
  schedule_en: location.schedule.EN,
});

export const mapTestimonialRow = (row: Record<string, any>): TestimonialItem => ({
  id: row.id,
  author: row.author ?? '',
  email: row.email ?? undefined,
  role: {
    FR: row.role_fr ?? '',
    EN: row.role_en ?? '',
  },
  company: row.company ?? '',
  industry: {
    FR: row.industry_fr ?? '',
    EN: row.industry_en ?? '',
  },
  location: row.location ?? '',
  rating: Number(row.rating ?? 5),
  quote: {
    FR: row.quote_fr ?? '',
    EN: row.quote_en ?? '',
  },
  highlightMetric: row.highlight_value
    ? {
        value: row.highlight_value ?? '',
        label: {
          FR: row.highlight_label_fr ?? '',
          EN: row.highlight_label_en ?? '',
        },
      }
    : undefined,
  serviceUsed: {
    FR: row.service_used_fr ?? '',
    EN: row.service_used_en ?? '',
  },
  avatarInitials: row.avatar_initials ?? '',
  badge: row.badge_fr || row.badge_en
    ? {
        FR: row.badge_fr ?? '',
        EN: row.badge_en ?? '',
      }
    : undefined,
  status: row.status ?? 'published',
  submittedAt: row.submitted_at ?? row.submittedAt ?? undefined,
});

export const mapTestimonialToRow = (item: TestimonialItem) => ({
  id: item.id,
  author: item.author,
  email: item.email ?? null,
  role_fr: item.role.FR,
  role_en: item.role.EN,
  company: item.company,
  industry_fr: item.industry.FR,
  industry_en: item.industry.EN,
  location: item.location,
  rating: item.rating,
  quote_fr: item.quote.FR,
  quote_en: item.quote.EN,
  highlight_value: item.highlightMetric?.value ?? null,
  highlight_label_fr: item.highlightMetric?.label.FR ?? null,
  highlight_label_en: item.highlightMetric?.label.EN ?? null,
  service_used_fr: item.serviceUsed.FR,
  service_used_en: item.serviceUsed.EN,
  avatar_initials: item.avatarInitials,
  badge_fr: item.badge?.FR ?? null,
  badge_en: item.badge?.EN ?? null,
  status: item.status ?? 'published',
  submitted_at: item.submittedAt ?? null,
});

export const mapFaqCategoryRow = (row: Record<string, any>): FAQCategory => ({
  id: row.id,
  label: {
    FR: row.label_fr ?? '',
    EN: row.label_en ?? '',
  },
});

export const mapFaqCategoryToRow = (category: FAQCategory) => ({
  id: category.id,
  label_fr: category.label.FR,
  label_en: category.label.EN,
});

export const mapFaqItemRow = (row: Record<string, any>): FAQItem => ({
  id: row.id,
  category: row.category,
  badge: {
    FR: row.badge_fr ?? '',
    EN: row.badge_en ?? '',
  },
  question: {
    FR: row.question_fr ?? '',
    EN: row.question_en ?? '',
  },
  answer: {
    FR: row.answer_fr ?? '',
    EN: row.answer_en ?? '',
  },
  keyTakeaway: row.takeaway_fr || row.takeaway_en
    ? {
        FR: row.takeaway_fr ?? '',
        EN: row.takeaway_en ?? '',
      }
    : undefined,
  reference: row.reference ?? undefined,
});

export const mapFaqItemToRow = (item: FAQItem) => ({
  id: item.id,
  category: item.category,
  badge_fr: item.badge.FR,
  badge_en: item.badge.EN,
  question_fr: item.question.FR,
  question_en: item.question.EN,
  answer_fr: item.answer.FR,
  answer_en: item.answer.EN,
  takeaway_fr: item.keyTakeaway?.FR ?? null,
  takeaway_en: item.keyTakeaway?.EN ?? null,
  reference: item.reference ?? null,
});

export const mapTranslationRowsToObject = (
  rows: Record<string, any>[] = [],
  lang: Language
): Record<string, string> => {
  const entries = rows
    .filter((row) => row.locale === lang)
    .map((row) => [String(row.key), String(row.value)] as const);

  return Object.fromEntries(entries);
};

export const mapAdminUserRow = (row: Record<string, any>): AdminUser => ({
  id: row.id,
  username: row.username,
  fullName: row.full_name,
  email: row.email,
  role: row.role,
  password: row.password_hash ? 'hidden' : undefined,
  isActive: Boolean(row.is_active),
  createdAt: row.created_at ?? new Date().toISOString(),
  phone: row.phone ?? undefined,
  lastLogin: row.last_login ?? undefined,
});

export const mapAdminUserToRow = (user: AdminUser) => ({
  username: user.username,
  full_name: user.fullName,
  email: user.email,
  role: user.role,
  password_hash: user.password ?? '',
  is_active: user.isActive,
  phone: user.phone ?? null,
  last_login: user.lastLogin ?? null,
});



export const mapTopBarSettingsRow = (
  row: Record<string, any> | null | undefined
): Record<string, any> | null => {
  if (!row || typeof row.value !== 'object' || row.value === null) return null;
  return row.value as Record<string, any>;
};


export const mapContactMessageRow = (row: Record<string, any>): ContactMessage => ({
  id: String(row.id),
  createdAt: row.created_at ?? new Date().toISOString(),
  companyName: row.company_name ?? '',
  contactPerson: row.contact_person ?? '',
  email: row.email ?? '',
  phone: row.phone ?? '',
  serviceType: row.service_type ?? '',
  message: row.message ?? '',
  status:
    row.status === 'new' || row.status === 'read' || row.status === 'replied' || row.status === 'archived'
      ? row.status
      : 'new',
  readAt: row.read_at ?? undefined,
  repliedAt: row.replied_at ?? undefined,
  adminNotes: row.admin_notes ?? undefined,
});

export const mapContactMessageToRow = (msg: ContactMessage) => ({
  company_name: msg.companyName,
  contact_person: msg.contactPerson,
  email: msg.email,
  phone: msg.phone,
  service_type: msg.serviceType,
  message: msg.message,
});



export const mapConsultationRequestRow = (row: Record<string, any>): ContactMessage => ({
  id: String(row.id),
  createdAt: row.created_at ?? new Date().toISOString(),
  companyName: row.company_name ?? '',
  contactPerson: row.contact_person ?? '',
  email: row.email ?? '',
  phone: row.phone ?? '',
  serviceType: row.service_type ?? '',
  message: row.message ?? '',
  trackingRef: row.tracking_ref ?? undefined,
  status:
    row.status === 'new' ||
    row.status === 'read' ||
    row.status === 'replied' ||
    row.status === 'archived'
      ? row.status
      : 'new',
  readAt: row.read_at ?? undefined,
  repliedAt: row.replied_at ?? undefined,
  adminNotes: row.admin_notes ?? undefined,
});