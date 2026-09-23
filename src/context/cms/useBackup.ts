import { useCallback } from 'react';
import { ServiceItem, CarouselSlide, TestimonialItem, OfficeLocation } from '../../types';
import {
  servicesData as defaultServices,
  carouselSlides as defaultSlides,
  testimonialsData as defaultTestimonials,
  officeLocations as defaultOffices,
} from '../../data/content';
import {
  DEFAULT_HERO_BG,
  DEFAULT_HERO_SLIDES,
  DEFAULT_TOP_BAR_SETTINGS,
  DEFAULT_LOGO_SETTINGS,
  CMSContentData,
  normalizeLogoSettings,
  normalizeTestimonialStatus,
  normalizeTopBarSettings,
} from './helpers';

interface UseBackupArgs {
  content: CMSContentData;
  saveContent: (updated: CMSContentData) => void;
}

export function useBackup({ content, saveContent }: UseBackupArgs) {
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
          logoSettings: normalizeLogoSettings(parsed.logoSettings),
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
      logoSettings: DEFAULT_LOGO_SETTINGS,
    };
    saveContent(emptyDefaults);
  }, [saveContent]);

  return { exportBackup, importBackup, resetToDefaults };
}