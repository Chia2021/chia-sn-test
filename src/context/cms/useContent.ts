import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Language,
  ServiceItem,
  CarouselSlide,
  TestimonialItem,
  OfficeLocation,
  TopBarSettings,
  LogoSettings,
} from '../../types';
import { translations as defaultTranslations } from '../../data/translations';
import {
  servicesData as defaultServices,
  carouselSlides as defaultSlides,
  testimonialsData as defaultTestimonials,
  officeLocations as defaultOffices,
} from '../../data/content';
import { supabase } from '../../lib/supabase';
import {
  mapCarouselRow,
  mapOfficeLocationRow,
  mapServiceRow,
  mapTestimonialRow,
  mapTranslationRowsToObject,
  mapTopBarSettingsRow,
  mapServiceToRow,
  mapCarouselToRow,
  mapOfficeLocationToRow,
  mapTestimonialToRow,
} from '../../lib/supabaseMappers';

import {
  STORAGE_KEY_CONTENT,
  DEFAULT_HERO_BG,
  DEFAULT_HERO_SLIDES,
  DEFAULT_TOP_BAR_SETTINGS,
  DEFAULT_LOGO_SETTINGS,
  CMSContentData,
  QuickEditItem,
  normalizeLogoSettings,
  normalizeTestimonialStatus,
  normalizeTopBarSettings,
  safeStorageGet,
  safeStorageSet,
} from './helpers';

export function useContent() {
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
          logoSettings: normalizeLogoSettings(parsed.logoSettings),
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
      logoSettings: DEFAULT_LOGO_SETTINGS,
    };
  });

  const [quickEditTarget, setQuickEditTarget] = useState<QuickEditItem | null>(null);

  // -------- Pending writes tracker --------
  const pendingWritesRef = useRef<Promise<unknown>[]>([]);

  const trackWrite = useCallback(<T,>(thenable: PromiseLike<T>): Promise<T> => {
    const promise = Promise.resolve(thenable);
    pendingWritesRef.current.push(promise);
    promise.finally(() => {
      pendingWritesRef.current = pendingWritesRef.current.filter((p) => p !== promise);
    });
    return promise;
  }, []);

  const awaitPendingWrites = useCallback(async () => {
    if (pendingWritesRef.current.length === 0) return;
    try {
      await Promise.allSettled(pendingWritesRef.current);
    } catch (e) {
      console.warn('Some pending writes failed before logout:', e);
    }
  }, []);

  // -------- Persist to localStorage + state --------
  const saveContent = useCallback((updated: CMSContentData) => {
    const normalized: CMSContentData = {
      ...updated,
      testimonials: updated.testimonials.map(normalizeTestimonialStatus),
      topBarSettings: normalizeTopBarSettings(updated.topBarSettings),
      logoSettings: normalizeLogoSettings(updated.logoSettings),
    };
    setContent(normalized);
    try {
      safeStorageSet(STORAGE_KEY_CONTENT, JSON.stringify(normalized));
    } catch (err) {
      console.error('LocalStorage save error:', err);
    }
  }, []);

  // -------- Load from Supabase --------
  const loadSupabaseContent = useCallback(async () => {
    const safe = async <T,>(
      label: string,
      builder: PromiseLike<{ data: T | null; error: { message: string } | null }>
    ): Promise<T | null> => {
      try {
        const result = await builder;
        if (result.error) {
          console.warn(`[CMS] ${label} query error:`, result.error.message);
          return null;
        }
        return result.data ?? null;
      } catch (err) {
        console.warn(`[CMS] ${label} query threw:`, err);
        return null;
      }
    };

    try {
      const [
        servicesData,
        slidesData,
        testimonialsData,
        officesData,
        translationsData,
        topBarRow,
        heroRow,
        logoRow,
      ] = await Promise.all([
        safe('services', supabase.from('services').select('*').order('sort_order', { ascending: true })),
        safe(
          'carousel_slides',
          supabase.from('carousel_slides').select('*').order('sort_order', { ascending: true })
        ),
        safe(
          'testimonials',
          supabase.from('testimonials').select('*').order('sort_order', { ascending: true })
        ),
        safe(
          'office_locations',
          supabase.from('office_locations').select('*').order('sort_order', { ascending: true })
        ),
        safe('page_translations', supabase.from('page_translations').select('*')),
        safe(
          'site_settings.top_bar',
          supabase.from('site_settings').select('*').eq('id', 'top_bar').maybeSingle()
        ),
        safe(
          'site_settings.hero',
          supabase.from('site_settings').select('*').eq('id', 'hero').maybeSingle()
        ),
        safe(
          'site_settings.logo',
          supabase.from('site_settings').select('*').eq('id', 'logo').maybeSingle()
        ),
      ]);

      const remoteTopBar = mapTopBarSettingsRow(topBarRow as Record<string, any> | null);
      const remoteHero = mapTopBarSettingsRow(heroRow as Record<string, any> | null);
      const remoteLogo = mapTopBarSettingsRow(logoRow as Record<string, any> | null);

      const hasSupabaseData =
        (servicesData && Array.isArray(servicesData) && servicesData.length > 0) ||
        (slidesData && Array.isArray(slidesData) && slidesData.length > 0) ||
        (testimonialsData && Array.isArray(testimonialsData) && testimonialsData.length > 0) ||
        (officesData && Array.isArray(officesData) && officesData.length > 0) ||
        (translationsData && Array.isArray(translationsData) && translationsData.length > 0) ||
        !!remoteTopBar ||
        !!remoteHero ||
        !!remoteLogo;

      if (!hasSupabaseData) return;

      setContent((prevContent) => {
        const heroBgFromRemote =
          remoteHero && typeof (remoteHero as any).heroBg === 'string'
            ? (remoteHero as any).heroBg
            : null;
        const heroImagesFromRemote =
          remoteHero &&
          Array.isArray((remoteHero as any).heroImages) &&
          (remoteHero as any).heroImages.length > 0
            ? ((remoteHero as any).heroImages as string[])
            : null;

        const nextContent: CMSContentData = {
          translationsOverride: {
            FR: Array.isArray(translationsData)
              ? mapTranslationRowsToObject(translationsData as any[], 'FR')
              : prevContent.translationsOverride.FR,
            EN: Array.isArray(translationsData)
              ? mapTranslationRowsToObject(translationsData as any[], 'EN')
              : prevContent.translationsOverride.EN,
          },
          services:
            Array.isArray(servicesData) && servicesData.length > 0
              ? servicesData.map(mapServiceRow)
              : prevContent.services,
          carouselSlides:
            Array.isArray(slidesData) && slidesData.length > 0
              ? slidesData.map(mapCarouselRow)
              : prevContent.carouselSlides,
          testimonials:
            Array.isArray(testimonialsData) && testimonialsData.length > 0
              ? testimonialsData.map(mapTestimonialRow).map(normalizeTestimonialStatus)
              : prevContent.testimonials,
          officeLocations:
            Array.isArray(officesData) && officesData.length > 0
              ? officesData.map(mapOfficeLocationRow)
              : prevContent.officeLocations,
          heroBg: heroBgFromRemote || prevContent.heroBg || DEFAULT_HERO_BG,
          heroImages:
            heroImagesFromRemote ||
            (prevContent.heroImages && prevContent.heroImages.length > 0
              ? prevContent.heroImages
              : DEFAULT_HERO_SLIDES),
          topBarSettings: remoteTopBar
            ? normalizeTopBarSettings(remoteTopBar)
            : prevContent.topBarSettings,
          logoSettings: remoteLogo
            ? normalizeLogoSettings(remoteLogo)
            : prevContent.logoSettings,
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

  // -------- Translations --------
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
          [lang]: { ...content.translationsOverride[lang], [key]: value },
        },
      };
      saveContent(updated);
      trackWrite(
        supabase
          .from('page_translations')
          .upsert({ key, locale: lang, value }, { onConflict: 'key,locale' })
          .then(({ error }) => {
            if (error) console.error('page_translations upsert error:', error.message);
          })
      );
    },
    [content, saveContent, trackWrite]
  );

  const updateTextBilingual = useCallback(
    (key: string, frValue: string, enValue: string) => {
      const updated: CMSContentData = {
        ...content,
        translationsOverride: {
          FR: { ...content.translationsOverride.FR, [key]: frValue },
          EN: { ...content.translationsOverride.EN, [key]: enValue },
        },
      };
      saveContent(updated);
      const rows = [
        { key, locale: 'FR', value: frValue },
        { key, locale: 'EN', value: enValue },
      ];
      trackWrite(
        supabase
          .from('page_translations')
          .upsert(rows, { onConflict: 'key,locale' })
          .then(({ error }) => {
            if (error) console.error('page_translations upsert error:', error.message);
          })
      );
    },
    [content, saveContent, trackWrite]
  );

  const triggerQuickEdit = useCallback(
    (key: string, label?: string) => {
      const fr = content.translationsOverride.FR[key] ?? defaultTranslations.FR[key] ?? '';
      const en = content.translationsOverride.EN[key] ?? defaultTranslations.EN[key] ?? '';
      setQuickEditTarget({ key, label: label || key, currentFR: fr, currentEN: en });
    },
    [content.translationsOverride]
  );

  // -------- Hero --------
  const persistHeroSettings = useCallback(
    (heroBg: string, heroImages: string[]) => {
      trackWrite(
        supabase
          .from('site_settings')
          .upsert(
            { id: 'hero', value: { heroBg, heroImages }, updated_at: new Date().toISOString() },
            { onConflict: 'id' }
          )
          .then(({ error }) => {
            if (error) console.error('site_settings.hero upsert error:', error.message);
          })
      );
    },
    [trackWrite]
  );

  const updateHeroBg = useCallback(
    (newBg: string) => {
      const currentList =
        content.heroImages && content.heroImages.length > 0 ? content.heroImages : DEFAULT_HERO_SLIDES;
      const updatedList = [newBg, ...currentList.filter((img) => img !== newBg)];
      saveContent({ ...content, heroBg: newBg, heroImages: updatedList });
      persistHeroSettings(newBg, updatedList);
    },
    [content, saveContent, persistHeroSettings]
  );

  const updateHeroImages = useCallback(
    (images: string[]) => {
      if (!images.length) return;
      const newBg = images[0] || content.heroBg;
      saveContent({ ...content, heroImages: images, heroBg: newBg });
      persistHeroSettings(newBg, images);
    },
    [content, saveContent, persistHeroSettings]
  );

  const addHeroImage = useCallback(
    (image: string) => {
      const current =
        content.heroImages && content.heroImages.length > 0 ? content.heroImages : DEFAULT_HERO_SLIDES;
      const updated = [...current, image];
      saveContent({ ...content, heroImages: updated });
      persistHeroSettings(content.heroBg, updated);
    },
    [content, saveContent, persistHeroSettings]
  );

  const removeHeroImage = useCallback(
    (index: number) => {
      const current =
        content.heroImages && content.heroImages.length > 0 ? content.heroImages : DEFAULT_HERO_SLIDES;
      if (current.length <= 1) return;
      const updated = current.filter((_, i) => i !== index);
      const newBg = updated[0] || content.heroBg;
      saveContent({ ...content, heroImages: updated, heroBg: newBg });
      persistHeroSettings(newBg, updated);
    },
    [content, saveContent, persistHeroSettings]
  );

  // -------- Services --------
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
      trackWrite(
        supabase
          .from('services')
          .upsert(mapServiceToRow(updatedService), { onConflict: 'id' })
          .then(({ error }) => {
            if (error) console.error('services upsert error:', error.message);
          })
      );
    },
    [content, saveContent, trackWrite]
  );

  const addService = useCallback(
    (newService: ServiceItem) => {
      saveContent({ ...content, services: [...content.services, newService] });
      trackWrite(
        supabase
          .from('services')
          .upsert(mapServiceToRow(newService), { onConflict: 'id' })
          .then(({ error }) => {
            if (error) console.error('services upsert error:', error.message);
          })
      );
    },
    [content, saveContent, trackWrite]
  );

  const deleteService = useCallback(
    (serviceId: string) => {
      const filtered = content.services.filter((s) => s.id !== serviceId);
      saveContent({ ...content, services: filtered });
      trackWrite(
        supabase
          .from('services')
          .delete()
          .eq('id', serviceId)
          .then(({ error }) => {
            if (error) console.error('services delete error:', error.message);
          })
      );
    },
    [content, saveContent, trackWrite]
  );

  // -------- Carousel --------
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
      trackWrite(
        supabase
          .from('carousel_slides')
          .upsert(
            { ...mapCarouselToRow(slide), sort_order: index >= 0 ? index : newSlides.length - 1 },
            { onConflict: 'id' }
          )
          .then(({ error }) => {
            if (error) console.error('carousel_slides upsert error:', error.message);
          })
      );
    },
    [content, saveContent, trackWrite]
  );

  const addCarouselSlide = useCallback(
    (slide: CarouselSlide) => {
      const newSlides = [...content.carouselSlides, slide];
      saveContent({ ...content, carouselSlides: newSlides });
      trackWrite(
        supabase
          .from('carousel_slides')
          .upsert(
            { ...mapCarouselToRow(slide), sort_order: newSlides.length - 1 },
            { onConflict: 'id' }
          )
          .then(({ error }) => {
            if (error) console.error('carousel_slides upsert error:', error.message);
          })
      );
    },
    [content, saveContent, trackWrite]
  );

  const deleteCarouselSlide = useCallback(
    (slideId: string) => {
      const filtered = content.carouselSlides.filter((s) => s.id !== slideId);
      saveContent({ ...content, carouselSlides: filtered });
      trackWrite(
        supabase
          .from('carousel_slides')
          .delete()
          .eq('id', slideId)
          .then(({ error }) => {
            if (error) console.error('carousel_slides delete error:', error.message);
          })
      );
      trackWrite(
        (async () => {
          try {
            const { error } = await supabase.storage
              .from('cms-assets')
              .remove([`carousel/${slideId}.jpg`, `carousel/${slideId}.png`]);
            if (error) console.warn('carousel storage cleanup warning:', error.message);
          } catch (e) {
            console.warn('Could not remove carousel storage object:', e);
          }
        })()
      );
    },
    [content, saveContent, trackWrite]
  );

  // -------- Testimonials --------
  const persistTestimonial = useCallback(
    (testi: TestimonialItem, index: number) => {
      trackWrite(
        supabase
          .from('testimonials')
          .upsert(
            { ...mapTestimonialToRow(testi), sort_order: index >= 0 ? index : 0 },
            { onConflict: 'id' }
          )
          .then(({ error }) => {
            if (error) console.error('testimonials upsert error:', error.message);
          })
      );
    },
    [trackWrite]
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
      persistTestimonial(testi, index);
    },
    [content, saveContent, persistTestimonial]
  );

  const addTestimonial = useCallback(
    (testi: TestimonialItem) => {
      const newTestis = [...content.testimonials, testi];
      saveContent({ ...content, testimonials: newTestis });
      persistTestimonial(testi, newTestis.length - 1);
    },
    [content, saveContent, persistTestimonial]
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
      const updatedItem = updated.find((t) => t.id === testiId);
      if (updatedItem) {
        const idx = updated.findIndex((t) => t.id === testiId);
        persistTestimonial(updatedItem, idx);
      }
    },
    [content, saveContent, persistTestimonial]
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
      const updatedItem = updated.find((t) => t.id === testiId);
      if (updatedItem) {
        const idx = updated.findIndex((t) => t.id === testiId);
        persistTestimonial(updatedItem, idx);
      }
    },
    [content, saveContent, persistTestimonial]
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
      const newTestis = [...content.testimonials, newTestimonial];
      saveContent({ ...content, testimonials: newTestis });
      persistTestimonial(newTestimonial, newTestis.length - 1);
    },
    [content, saveContent, persistTestimonial]
  );

  const deleteTestimonial = useCallback(
    (testiId: string) => {
      const filtered = content.testimonials.filter((t) => t.id !== testiId);
      saveContent({ ...content, testimonials: filtered });
      trackWrite(
        supabase
          .from('testimonials')
          .delete()
          .eq('id', testiId)
          .then(({ error }) => {
            if (error) console.error('testimonials delete error:', error.message);
          })
      );
    },
    [content, saveContent, trackWrite]
  );

  // -------- Offices --------
  const updateOfficeLocation = useCallback(
    (index: number, location: OfficeLocation) => {
      const updated = [...content.officeLocations];
      updated[index] = location;
      saveContent({ ...content, officeLocations: updated });
      const rowId = location.city.FR || `office-${index}`;
      trackWrite(
        supabase
          .from('office_locations')
          .upsert(
            { ...mapOfficeLocationToRow(location), id: rowId, sort_order: index },
            { onConflict: 'id' }
          )
          .then(({ error }) => {
            if (error) console.error('office_locations upsert error:', error.message);
          })
      );
    },
    [content, saveContent, trackWrite]
  );

  // -------- Top bar --------
  const updateTopBarSettings = useCallback(
    (updates: Partial<TopBarSettings>) => {
      const nextSettings = normalizeTopBarSettings({ ...content.topBarSettings, ...updates });
      saveContent({ ...content, topBarSettings: nextSettings });
      trackWrite(
        supabase
          .from('site_settings')
          .upsert(
            { id: 'top_bar', value: nextSettings, updated_at: new Date().toISOString() },
            { onConflict: 'id' }
          )
          .then(({ error }) => {
            if (error) console.error('site_settings.top_bar upsert error:', error.message);
          })
      );
    },
    [content, saveContent, trackWrite]
  );

  // -------- Logo --------
  const updateLogoSettings = useCallback(
    (updates: Partial<LogoSettings>) => {
      const nextSettings = normalizeLogoSettings({ ...content.logoSettings, ...updates });
      saveContent({ ...content, logoSettings: nextSettings });
      trackWrite(
        supabase
          .from('site_settings')
          .upsert(
            { id: 'logo', value: nextSettings, updated_at: new Date().toISOString() },
            { onConflict: 'id' }
          )
          .then(({ error }) => {
            if (error) console.error('site_settings.logo upsert error:', error.message);
          })
      );
    },
    [content, saveContent, trackWrite]
  );

  // -------- Custom edit flag --------
  const hasCustomEdits =
    Object.keys(content.translationsOverride.FR).length > 0 ||
    Object.keys(content.translationsOverride.EN).length > 0 ||
    content.heroBg !== DEFAULT_HERO_BG;

  return {
    // state
    content,
    quickEditTarget,
    setQuickEditTarget,

    // pending writes (used by useBackup and CMSContext logout)
    awaitPendingWrites,

    // translations
    getTranslations,
    updateText,
    updateTextBilingual,
    triggerQuickEdit,

    // hero
    updateHeroBg,
    updateHeroImages,
    addHeroImage,
    removeHeroImage,

    // services
    updateService,
    addService,
    deleteService,

    // carousel
    updateCarouselSlide,
    addCarouselSlide,
    deleteCarouselSlide,

    // testimonials
    updateTestimonial,
    addTestimonial,
    approveTestimonial,
    rejectTestimonial,
    submitClientTestimonial,
    deleteTestimonial,

    // offices
    updateOfficeLocation,

    // topbar / logo
    updateTopBarSettings,
    updateLogoSettings,

    // helpers
    saveContent,
    hasCustomEdits,
  };
}