import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sliders,
  Image as ImageIcon,
  Palette,
  Type,
  Briefcase,
  Layers,
  Award,
  MapPin,
  Save,
  RotateCcw,
  Upload,
  Download,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  Link,
  Phone,
  Mail,
  ShieldCheck,
  Users,
  Globe,
  PanelTop,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { Language, ServiceItem, CarouselSlide, TestimonialItem, TopBarSettings, LogoSettings } from '../types';
import { compressImageFile } from '../utils/imageUtils';
import { UserManagementSection } from './admin/UserManagementSection';
import { SEOManagementSection } from './admin/SEOManagementSection';
import { uploadToCmsAssets } from '../lib/storage';


interface AdminPanelModalProps {
  currentLang: Language;
}

type TabType =
  | 'topbar'
  |  'logo'
  | 'hero'
  | 'services'
  | 'carousel'
  | 'compliance'
  | 'testimonials'
  | 'contact'
  | 'users'
  | 'seo'
  | 'backup';

export function AdminPanelModal({ currentLang }: AdminPanelModalProps) {
  const {
    isAdminPanelOpen,
    setIsAdminPanelOpen,
    logoutAdmin,
    getTranslations,
    updateTextBilingual,
    services,
    updateService,
    addService,
    deleteService,
    carouselSlides,
    updateCarouselSlide,
    addCarouselSlide,
    deleteCarouselSlide,
    testimonials,
    updateTestimonial,
    addTestimonial,
    approveTestimonial,
    rejectTestimonial,
    deleteTestimonial,
    officeLocations,
    updateOfficeLocation,
    heroBg,
    heroImages,
    updateHeroBg,
    updateHeroImages,
    addHeroImage,
    removeHeroImage,
    topBarSettings,
    updateTopBarSettings,
    logoSettings,
    updateLogoSettings,
    exportBackup,
    importBackup,
    resetToDefaults,
  } = useCMS();

  const [activeTab, setActiveTab] = useState<TabType>('topbar');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [customHeroUrl, setCustomHeroUrl] = useState('');
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'default';
  } | null>(null);
  const [noticeModal, setNoticeModal] = useState<{
    title: string;
    message: string;
    variant: 'success' | 'error' | 'info';
  } | null>(null);
  const [serviceDraft, setServiceDraft] = useState<ServiceItem>(() => ({
    id: `service-${Date.now()}`,
    iconName: 'calculator',
    badge: { FR: 'Nouveau Service', EN: 'New Service' },
    title: { FR: 'Nouveau Service Conseil', EN: 'New Advisory Service' },
    description: {
      FR: 'Description détaillée de la nouvelle prestation comptable ou fiscale.',
      EN: 'Detailed description of this new accounting or tax advisory offering.',
    },
    deliverables: {
      FR: ['Livrable 1 : Analyse préliminaire', 'Livrable 2 : Rapport exécutif'],
      EN: ['Deliverable 1: Preliminary analysis', 'Deliverable 2: Executive report'],
    },
  }));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const tFR = getTranslations('FR');
  const tEN = getTranslations('EN');
  const normalizedTestimonials = testimonials.map((item) => {
    const safeStatus =
      item.status === 'pending' || item.status === 'rejected' || item.status === 'published'
        ? item.status
        : 'published';

    return {
      ...item,
      status: safeStatus,
    };
  });
  const pendingTestimonials = normalizedTestimonials.filter((item) => item.status === 'pending');
  const approvedTestimonials = normalizedTestimonials.filter((item) => item.status === 'published');
  const rejectedTestimonials = normalizedTestimonials.filter((item) => item.status === 'rejected');

  if (!isAdminPanelOpen) return null;

  const showNotification = () => {
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    setIsUploading(true);
    const compressedDataUrl = await compressImageFile(file, 1920, 1080, 0.82);
    const res = await fetch(compressedDataUrl);
    const blob = await res.blob();

    const ext = blob.type === 'image/png' ? 'png' : 'jpg';
    const path = `hero/hero-${Date.now()}.${ext}`;

    const result = await uploadToCmsAssets(blob, path);
    if (!result.success) {
      showNotice(
        currentLang === 'FR' ? 'Échec du téléversement' : 'Upload failed',
        result.message,
        'error'
      );
      return;
    }

    addHeroImage(result.publicUrl);
    showNotification();
  } catch (err: any) {
    showNotice(
      currentLang === 'FR' ? 'Erreur d’image' : 'Image error',
      err.message ||
        (currentLang === 'FR'
          ? "Erreur lors du traitement de l'image."
          : 'Error while processing the image.'),
      'error'
    );
  } finally {
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
};

const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    setIsUploadingLogo(true);

    // 1) Compress to a reasonable size so we don't upload a 5 MB PNG
    const compressedDataUrl = await compressImageFile(file, 400, 400, 0.9);

    // 2) Convert the compressed data URL back to a Blob for Storage upload
    const res = await fetch(compressedDataUrl);
    const blob = await res.blob();

    // 3) Upload to Supabase Storage at a stable path so re-uploads overwrite
    const ext = blob.type === 'image/png' ? 'png' : 'jpg';
    const path = `logo/brand-logo.${ext}`;

    const { uploadToCmsAssets } = await import('../lib/storage');
    const result = await uploadToCmsAssets(blob, path);

    if (!result.success) {
      showNotice(
        currentLang === 'FR' ? 'Échec du téléversement' : 'Upload failed',
        result.message,
        'error'
      );
      return;
    }

    // 4) Persist only the public URL in site_settings — tiny payload, no HTTP/2 issue
    updateLogoSettings({ logoUrl: result.publicUrl });
    showNotification();
  } catch (err: any) {
    showNotice(
      currentLang === 'FR' ? 'Erreur d’image' : 'Image error',
      err.message ||
        (currentLang === 'FR'
          ? "Erreur lors du traitement de l'image."
          : 'Error while processing the image.'),
      'error'
    );
  } finally {
    setIsUploadingLogo(false);
    if (logoFileInputRef.current) logoFileInputRef.current.value = '';
  }
};

const handleSlideImageUpload = async (slide: CarouselSlide, file: File) => {
  try {
    setIsUploading(true);

    // 1) Compress to a reasonable carousel size (1280x720) before uploading
    const compressedDataUrl = await compressImageFile(file, 1280, 720, 0.82);

    // 2) Convert the compressed data URL back to a Blob for Storage upload
    const res = await fetch(compressedDataUrl);
    const blob = await res.blob();

    // 3) Build a stable, unique path per slide so re-uploads overwrite
    //    the same object rather than piling up orphaned files
    const ext = blob.type === 'image/png' ? 'png' : 'jpg';
    const path = `carousel/${slide.id}.${ext}`;

    // 4) Upload to Supabase Storage
    const result = await uploadToCmsAssets(blob, path);

    if (!result.success) {
      showNotice(
        currentLang === 'FR' ? 'Échec du téléversement' : 'Upload failed',
        result.message,
        'error'
      );
      return;
    }

    // 5) Persist only the public URL on the slide — tiny payload, no HTTP/2 issue
    updateCarouselSlide({ ...slide, image: result.publicUrl });
    showNotification();
  } catch (err: any) {
    showNotice(
      currentLang === 'FR' ? 'Erreur d’image' : 'Image error',
      err.message ||
        (currentLang === 'FR'
          ? "Erreur lors du traitement de l'image."
          : 'Error while processing the image.'),
      'error'
    );
  } finally {
    setIsUploading(false);
  }
};

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const ok = importBackup(content);
        if (ok) {
          showNotification();
          showNotice(
            currentLang === 'FR' ? 'Importation réussie' : 'Import successful',
            currentLang === 'FR'
              ? 'Contenu importé avec succès !'
              : 'Content imported successfully!',
            'success'
          );
        } else {
          showNotice(
            currentLang === 'FR' ? 'Fichier invalide' : 'Invalid file',
            currentLang === 'FR' ? 'Fichier JSON invalide.' : 'Invalid JSON file.',
            'error'
          );
        }
      }
    };
    reader.readAsText(file);
    if (backupFileInputRef.current) backupFileInputRef.current.value = '';
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    {
      id: 'topbar',
      label: currentLang === 'FR' ? 'Barre Supérieure' : 'Top Bar',
      icon: PanelTop,
    },
    {
      id: 'logo',
      label: currentLang === 'FR' ? 'Logo & Marque' : 'Logo & Branding',
      icon: Palette,
    },
    {
      id: 'hero',
      label: currentLang === 'FR' ? 'Hero & Textes Accueil' : 'Hero & Homepage',
      icon: Type,
    },
    {
      id: 'services',
      label: currentLang === 'FR' ? 'Services & Livrables' : 'Services & Offerings',
      icon: Briefcase,
    },
    {
      id: 'carousel',
      label: currentLang === 'FR' ? 'Carrousel & Photos' : 'Carousel & Media',
      icon: ImageIcon,
    },
    {
      id: 'compliance',
      label: currentLang === 'FR' ? 'Cadre Réglementaire' : 'Compliance & Norms',
      icon: ShieldCheck,
    },
    {
      id: 'testimonials',
      label: currentLang === 'FR' ? 'Avis Clients & Stats' : 'Testimonials & Reviews',
      icon: Award,
    },
    {
      id: 'contact',
      label: currentLang === 'FR' ? 'Bureaux & Contact' : 'Offices & Contact',
      icon: MapPin,
    },
    {
      id: 'users',
      label: currentLang === 'FR' ? 'Utilisateurs & Sécurité' : 'Users & Security',
      icon: Users,
    },
    {
      id: 'seo',
      label: currentLang === 'FR' ? 'Référencement & SEO' : 'SEO & Visibility',
      icon: Globe,
    },
    {
      id: 'backup',
      label: currentLang === 'FR' ? 'Sauvegarde & Import' : 'Backup & Restore',
      icon: Download,
    },
  ];

  const openNewServiceModal = () => {
    setServiceDraft({
      id: `service-${Date.now()}`,
      iconName: 'calculator',
      badge: { FR: 'Nouveau Service', EN: 'New Service' },
      title: { FR: 'Nouveau Service Conseil', EN: 'New Advisory Service' },
      description: {
        FR: 'Description détaillée de la nouvelle prestation comptable ou fiscale.',
        EN: 'Detailed description of this new accounting or tax advisory offering.',
      },
      deliverables: {
        FR: ['Livrable 1 : Analyse préliminaire', 'Livrable 2 : Rapport exécutif'],
        EN: ['Deliverable 1: Preliminary analysis', 'Deliverable 2: Executive report'],
      },
    });
    setIsAddServiceModalOpen(true);
  };

  const requestConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    variant: 'danger' | 'default' = 'default'
  ) => {
    setConfirmAction({ title, message, onConfirm, variant });
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;
    const { onConfirm } = confirmAction;
    setConfirmAction(null);
    onConfirm();
  };

  const showNotice = (
    title: string,
    message: string,
    variant: 'success' | 'error' | 'info' = 'success'
  ) => {
    setNoticeModal({ title, message, variant });
  };

  const saveNewService = () => {
    addService(serviceDraft);
    setIsAddServiceModalOpen(false);
    showNotification();
  };

  const handleTopBarToggle = (key: keyof TopBarSettings, value: boolean) => {
    updateTopBarSettings({ [key]: value } as Partial<TopBarSettings>);
    showNotification();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAdminPanelOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          className="relative w-full max-w-6xl bg-white/95 rounded-[28px] shadow-[0_30px_80px_rgba(15,23,42,0.22)] border border-slate-200/80 overflow-hidden z-10 my-6 flex flex-col max-h-[90vh] backdrop-blur-xl"
        >
          <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-950 via-[#0b3557] to-[#0f4c81] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-white/10 rounded-2xl text-white border border-white/10 shadow-inner shadow-white/5">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base sm:text-lg flex items-center flex-wrap gap-2">
                  <span>
                    {currentLang === 'FR'
                      ? 'Panneau Administrateur CMS'
                      : 'Admin CMS Control Center'}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    En direct
                  </span>
                </h3>
                <p className="text-xs text-slate-300 truncate">
                  {currentLang === 'FR'
                    ? 'Modifiez tous les textes, téléversez des images et gérez l\'intégralité du contenu.'
                    : 'Modify all site texts, upload images, and control all section content.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {saveSuccessNotice && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold animate-pulse shadow-sm shadow-emerald-600/40">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{currentLang === 'FR' ? 'Enregistré !' : 'Saved!'}</span>
                </div>
              )}
              <button
                type="button"
                onClick={logoutAdmin}
                className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-white hover:bg-red-500/20 hover:border-red-400/50 transition-colors"
              >
                {currentLang === 'FR' ? 'Déconnexion' : 'Logout'}
              </button>
              <button
                type="button"
                onClick={() => setIsAdminPanelOpen(false)}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
            <div className="w-full md:w-72 bg-slate-100/90 border-b md:border-b-0 md:border-r border-slate-200/90 p-3 shrink-0 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap md:whitespace-normal text-left cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0f4c81] to-[#1d70b8] text-white shadow-[0_12px_24px_rgba(15,76,129,0.22)]'
                        : 'text-slate-700 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_rgba(248,250,252,0.96))]">
              {/* TAB 0: TOP BAR */}
              {activeTab === 'topbar' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <PanelTop className="w-4 h-4 text-[#0f4c81]" />
                      <span>
                        {currentLang === 'FR'
                          ? 'Barre Supérieure (Contact & Réseaux)'
                          : 'Top Bar (Contact & Social)'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {currentLang === 'FR'
                        ? 'Modifiez les coordonnées, liens sociaux et la visibilité des éléments de la barre tout en haut du site.'
                        : 'Edit contact details, social links, and visibility of elements in the very top bar.'}
                    </p>
                  </div>

                  {/* Contact details */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)] space-y-3">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      {currentLang === 'FR' ? 'Coordonnées' : 'Contact Details'}
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {currentLang === 'FR'
                            ? 'Adresse email de contact'
                            : 'Contact email address'}
                        </label>
                        <input
                          type="email"
                          value={topBarSettings.emailAddress}
                          onChange={(e) => {
                            updateTopBarSettings({ emailAddress: e.target.value });
                            showNotification();
                          }}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                          placeholder="contact@chia-sn.cm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {currentLang === 'FR'
                            ? 'Numéro de téléphone (format affiché)'
                            : 'Phone number (displayed format)'}
                        </label>
                        <input
                          type="tel"
                          value={topBarSettings.phoneNumber}
                          onChange={(e) => {
                            updateTopBarSettings({ phoneNumber: e.target.value });
                            showNotification();
                          }}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                          placeholder="+237 670 12 34 56"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {currentLang === 'FR'
                            ? 'Numéro WhatsApp (chiffres uniquement)'
                            : 'WhatsApp number (digits only)'}
                        </label>
                        <input
                          type="tel"
                          value={topBarSettings.whatsappNumber}
                          onChange={(e) => {
                            updateTopBarSettings({ whatsappNumber: e.target.value });
                            showNotification();
                          }}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                          placeholder="237670123456"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social URLs */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)] space-y-3">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      {currentLang === 'FR' ? 'Liens des Réseaux Sociaux' : 'Social Media Links'}
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={topBarSettings.linkedinUrl}
                          onChange={(e) => {
                            updateTopBarSettings({ linkedinUrl: e.target.value });
                            showNotification();
                          }}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                          placeholder="https://linkedin.com/company/chia-sn"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Facebook URL
                        </label>
                        <input
                          type="url"
                          value={topBarSettings.facebookUrl}
                          onChange={(e) => {
                            updateTopBarSettings({ facebookUrl: e.target.value });
                            showNotification();
                          }}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                          placeholder="https://facebook.com/chiasn"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visibility toggles */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)] space-y-3">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      {currentLang === 'FR' ? 'Visibilité des éléments' : 'Element Visibility'}
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(
                        [
                          ['showLinkedin', currentLang === 'FR' ? 'Afficher LinkedIn' : 'Show LinkedIn'],
                          ['showFacebook', currentLang === 'FR' ? 'Afficher Facebook' : 'Show Facebook'],
                          ['showWhatsapp', currentLang === 'FR' ? 'Afficher WhatsApp' : 'Show WhatsApp'],
                          ['showHours', currentLang === 'FR' ? 'Afficher les horaires' : 'Show business hours'],
                          [
                            'showAdminButton',
                            currentLang === 'FR' ? 'Afficher le bouton Admin' : 'Show Admin button',
                          ],
                        ] as const
                      ).map(([key, label]) => (
                        <label
                          key={key}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-200 hover:border-[#0f4c81]/40 cursor-pointer bg-slate-50/60 hover:bg-white transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={topBarSettings[key]}
                            onChange={(e) => handleTopBarToggle(key, e.target.checked)}
                            className="w-4 h-4 accent-[#0f4c81] cursor-pointer"
                          />
                          <span className="text-xs font-semibold text-slate-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Editable labels via BilingualField */}
                  <div className="space-y-4">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 pt-2 border-t">
                      {currentLang === 'FR' ? 'Textes affichés dans la barre' : 'Displayed Labels'}
                    </h5>

                    <BilingualField
                      label={currentLang === 'FR' ? 'Email affiché' : 'Displayed email'}
                      valFR={tFR['top-email']}
                      valEN={tEN['top-email']}
                      onSave={(fr, en) => {
                        updateTextBilingual('top-email', fr, en);
                        showNotification();
                      }}
                    />

                    <BilingualField
                      label={currentLang === 'FR' ? 'Téléphone affiché' : 'Displayed phone'}
                      valFR={tFR['top-phone']}
                      valEN={tEN['top-phone']}
                      onSave={(fr, en) => {
                        updateTextBilingual('top-phone', fr, en);
                        showNotification();
                      }}
                    />

                    <BilingualField
                      label={currentLang === 'FR' ? 'Horaires affichés' : 'Displayed hours'}
                      valFR={tFR['top-hours']}
                      valEN={tEN['top-hours']}
                      onSave={(fr, en) => {
                        updateTextBilingual('top-hours', fr, en);
                        showNotification();
                      }}
                    />

                    <BilingualField
                      label={
                        currentLang === 'FR'
                          ? 'Libellé bouton Admin (déconnecté)'
                          : 'Admin button label (logged out)'
                      }
                      valFR={tFR['top-admin-btn-label'] ?? 'Admin'}
                      valEN={tEN['top-admin-btn-label'] ?? 'Admin'}
                      onSave={(fr, en) => {
                        updateTextBilingual('top-admin-btn-label', fr, en);
                        showNotification();
                      }}
                    />

                    <BilingualField
                      label={
                        currentLang === 'FR'
                          ? 'Libellé bouton Admin (connecté)'
                          : 'Admin button label (logged in)'
                      }
                      valFR={tFR['top-admin-btn-label-logged'] ?? 'Panneau CMS'}
                      valEN={tEN['top-admin-btn-label-logged'] ?? 'CMS Panel'}
                      onSave={(fr, en) => {
                        updateTextBilingual('top-admin-btn-label-logged', fr, en);
                        showNotification();
                      }}
                    />

                    <BilingualField
                      label={
                        currentLang === 'FR'
                          ? 'Infobulle bouton Admin (déconnecté)'
                          : 'Admin tooltip (logged out)'
                      }
                      valFR={tFR['top-admin-btn-tooltip'] ?? ''}
                      valEN={tEN['top-admin-btn-tooltip'] ?? ''}
                      onSave={(fr, en) => {
                        updateTextBilingual('top-admin-btn-tooltip', fr, en);
                        showNotification();
                      }}
                    />

                    <BilingualField
                      label={
                        currentLang === 'FR'
                          ? 'Infobulle bouton Admin (connecté)'
                          : 'Admin tooltip (logged in)'
                      }
                      valFR={tFR['top-admin-btn-tooltip-logged'] ?? ''}
                      valEN={tEN['top-admin-btn-tooltip-logged'] ?? ''}
                      onSave={(fr, en) => {
                        updateTextBilingual('top-admin-btn-tooltip-logged', fr, en);
                        showNotification();
                      }}
                    />

                    <BilingualField
                      label={currentLang === 'FR' ? 'Aria-label LinkedIn' : 'LinkedIn aria-label'}
                      valFR={tFR['top-aria-linkedin'] ?? ''}
                      valEN={tEN['top-aria-linkedin'] ?? ''}
                      onSave={(fr, en) => {
                        updateTextBilingual('top-aria-linkedin', fr, en);
                        showNotification();
                      }}
                    />

                    <BilingualField
                      label={currentLang === 'FR' ? 'Aria-label Facebook' : 'Facebook aria-label'}
                      valFR={tFR['top-aria-facebook'] ?? ''}
                      valEN={tEN['top-aria-facebook'] ?? ''}
                      onSave={(fr, en) => {
                        updateTextBilingual('top-aria-facebook', fr, en);
                        showNotification();
                      }}
                    />

                    <BilingualField
                      label={currentLang === 'FR' ? 'Aria-label WhatsApp' : 'WhatsApp aria-label'}
                      valFR={tFR['top-aria-whatsapp'] ?? ''}
                      valEN={tEN['top-aria-whatsapp'] ?? ''}
                      onSave={(fr, en) => {
                        updateTextBilingual('top-aria-whatsapp', fr, en);
                        showNotification();
                      }}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'logo' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#0f4c81]" />
                      <span>
                        {currentLang === 'FR' ? 'Logo & Identité de Marque' : 'Logo & Brand Identity'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {currentLang === 'FR'
                        ? 'Téléversez votre propre logo, ajustez le nom de marque et le sous-titre affichés dans l’en-tête.'
                        : 'Upload your own logo, adjust the brand name and the subtitle shown in the header.'}
                    </p>
                  </div>

                  {/* Live preview */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
                      {currentLang === 'FR' ? 'Aperçu en direct' : 'Live Preview'}
                    </h5>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div
                        className={`shrink-0 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 shadow-sm border border-slate-200/80 overflow-hidden ${
                          logoSettings.logoUrl ? 'p-0' : 'p-1'
                        } ${
                          logoSettings.logoSize === 'sm'
                            ? 'w-8 h-8'
                            : logoSettings.logoSize === 'lg'
                            ? 'w-12 h-12'
                            : 'w-10 h-10'
                        }`}
                      >
                        {logoSettings.logoUrl ? (
                          <img
                            src={logoSettings.logoUrl}
                            alt="Logo preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <circle cx="50" cy="50" r="45" fill="#f0f4f8" />
                            <path
                              d="M35,65 C35,45 45,35 65,35"
                              stroke="#0f4c81"
                              strokeWidth="8"
                              fill="none"
                              strokeLinecap="round"
                            />
                            <path
                              d="M45,65 C45,52 52,45 65,45"
                              stroke="#1d70b8"
                              strokeWidth="6"
                              fill="none"
                              strokeLinecap="round"
                            />
                            <circle cx="65" cy="35" r="7" fill="#e67e22" />
                          </svg>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold tracking-tight text-slate-900 text-xl md:text-2xl leading-none">
                          {logoSettings.brandName}
                          <span className="text-[#1d70b8]">{logoSettings.brandNameHighlight}</span>
                        </span>
                        {logoSettings.showSubtitle && (
                          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
                            {currentLang === 'FR' ? logoSettings.subtitleFR : logoSettings.subtitleEN}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Logo image upload */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)] space-y-3">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      {currentLang === 'FR' ? 'Image du logo' : 'Logo Image'}
                    </h5>

                    <p className="text-xs text-slate-600">
                      {currentLang === 'FR'
                        ? 'PNG transparent recommandé. Si aucune image n’est téléversée, le logo SVG par défaut sera utilisé.'
                        : 'Transparent PNG recommended. If no image is uploaded, the default SVG logo will be used.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={logoFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-file-upload"
                      />
                      <label
                        htmlFor="logo-file-upload"
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {isUploadingLogo
                            ? 'Compression...'
                            : logoSettings.logoUrl
                            ? currentLang === 'FR'
                              ? 'Remplacer le logo'
                              : 'Replace logo'
                            : currentLang === 'FR'
                            ? 'Téléverser un logo'
                            : 'Upload a logo'}
                        </span>
                      </label>

                      {logoSettings.logoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            updateLogoSettings({ logoUrl: null });
                            showNotification();
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>
                            {currentLang === 'FR' ? 'Revenir au logo par défaut' : 'Reset to default logo'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Brand name fields */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)] space-y-3">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      {currentLang === 'FR' ? 'Nom de marque' : 'Brand Name'}
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {currentLang === 'FR' ? 'Texte principal (noir)' : 'Main text (dark)'}
                        </label>
                        <input
                          type="text"
                          value={logoSettings.brandName}
                          onChange={(e) => {
                            updateLogoSettings({ brandName: e.target.value });
                            showNotification();
                          }}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                          placeholder="Chia"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {currentLang === 'FR' ? 'Suffixe coloré (bleu)' : 'Highlighted suffix (blue)'}
                        </label>
                        <input
                          type="text"
                          value={logoSettings.brandNameHighlight}
                          onChange={(e) => {
                            updateLogoSettings({ brandNameHighlight: e.target.value });
                            showNotification();
                          }}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                          placeholder="-SN"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subtitle fields */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)] space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                        {currentLang === 'FR' ? 'Sous-titre' : 'Subtitle'}
                      </h5>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={logoSettings.showSubtitle}
                          onChange={(e) => {
                            updateLogoSettings({ showSubtitle: e.target.checked });
                            showNotification();
                          }}
                          className="w-4 h-4 accent-[#0f4c81] cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-700">
                          {currentLang === 'FR' ? 'Afficher' : 'Show'}
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {currentLang === 'FR' ? 'Sous-titre (FR)' : 'Subtitle (FR)'}
                        </label>
                        <input
                          type="text"
                          value={logoSettings.subtitleFR}
                          onChange={(e) => {
                            updateLogoSettings({ subtitleFR: e.target.value });
                            showNotification();
                          }}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                          placeholder="Compta & Conseil Fiscal"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {currentLang === 'FR' ? 'Sous-titre (EN)' : 'Subtitle (EN)'}
                        </label>
                        <input
                          type="text"
                          value={logoSettings.subtitleEN}
                          onChange={(e) => {
                            updateLogoSettings({ subtitleEN: e.target.value });
                            showNotification();
                          }}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                          placeholder="Accounting & Tax Advisory"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Size selector */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)] space-y-3">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      {currentLang === 'FR' ? 'Taille par défaut' : 'Default Size'}
                    </h5>

                    <div className="flex flex-wrap gap-2">
                      {(['sm', 'md', 'lg'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            updateLogoSettings({ logoSize: s });
                            showNotification();
                          }}
                          className={`px-4 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                            logoSettings.logoSize === s
                              ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-[#0f4c81]'
                          }`}
                        >
                          {s === 'sm' ? 'Petit' : s === 'md' ? 'Moyen' : 'Grand'}
                          <span className="ml-1 opacity-60">({s})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: HERO & GENERAL */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#0f4c81]" />
                          <span>
                            {currentLang === 'FR'
                              ? "Diaporama d'Arrière-Plan Hero (Framer Motion)"
                              : 'Hero Background Slides (Framer Motion)'}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {currentLang === 'FR'
                            ? 'Les images glissent harmonieusement en arrière-plan pendant que les textes restent fixes et lisibles au premier plan.'
                            : 'Images slide seamlessly in the background while the text stays fixed and readable in front.'}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-[#0f4c81] font-semibold self-start sm:self-auto">
                        {heroImages.length} {currentLang === 'FR' ? 'diapositives' : 'slides'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {heroImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all group aspect-video bg-slate-900 ${
                            idx === 0
                              ? 'border-amber-400 ring-2 ring-amber-400/30'
                              : 'border-slate-300 hover:border-[#0f4c81]'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Slide ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-white">
                                {idx === 0
                                  ? currentLang === 'FR'
                                    ? '1 (Principal)'
                                    : '1 (Main)'
                                  : `#${idx + 1}`}
                              </span>
                              {heroImages.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    removeHeroImage(idx);
                                    showNotification();
                                  }}
                                  className="p-1 rounded-md bg-red-600/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  title={
                                    currentLang === 'FR'
                                      ? 'Supprimer cette image'
                                      : 'Remove image'
                                  }
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  updateHeroBg(imgUrl);
                                  showNotification();
                                }}
                                className="text-[10px] text-amber-300 hover:underline self-start bg-black/50 px-1 rounded cursor-pointer"
                              >
                                {currentLang === 'FR' ? 'Définir en 1er' : 'Set as 1st'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-200">
                      <div className="flex flex-wrap gap-2 items-center">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageUpload}
                          className="hidden"
                          id="hero-file-upload"
                        />
                        <label
                          htmlFor="hero-file-upload"
                          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {isUploading
                              ? 'Compression...'
                              : currentLang === 'FR'
                              ? 'Ajouter une photo locale'
                              : 'Upload local photo'}
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            updateHeroImages([
                              'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80',
                              'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
                              'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=2000&q=80',
                              'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2000&q=80',
                            ]);
                            showNotification();
                          }}
                          className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          {currentLang === 'FR'
                            ? 'Restaurer diapos par défaut'
                            : 'Reset default slides'}
                        </button>
                      </div>

                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="url"
                          placeholder={
                            currentLang === 'FR'
                              ? "Coller une URL d'image pour ajouter un slide..."
                              : 'Paste image URL to add slide...'
                          }
                          value={customHeroUrl}
                          onChange={(e) => setCustomHeroUrl(e.target.value)}
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#0f4c81] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customHeroUrl.trim()) {
                              addHeroImage(customHeroUrl.trim());
                              setCustomHeroUrl('');
                              showNotification();
                            }
                          }}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl cursor-pointer shrink-0"
                        >
                          {currentLang === 'FR' ? 'Ajouter Slide' : 'Add Slide'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b pb-2">
                      <Type className="w-4 h-4 text-[#0f4c81]" />
                      <span>
                        {currentLang === 'FR' ? 'Titres & Textes du Hero' : 'Hero Titles & Subtitles'}
                      </span>
                    </h4>

                    <BilingualField
                      label="Badge supérieur (Hero)"
                      valFR={tFR['hero-badge']}
                      valEN={tEN['hero-badge']}
                      onSave={(fr, en) => {
                        updateTextBilingual('hero-badge', fr, en);
                        showNotification();
                      }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <BilingualField
                        label="Titre : Préfixe"
                        valFR={tFR['hero-title-prefix']}
                        valEN={tEN['hero-title-prefix']}
                        onSave={(fr, en) => {
                          updateTextBilingual('hero-title-prefix', fr, en);
                          showNotification();
                        }}
                      />
                      <BilingualField
                        label="Titre : Mot Mis en Valeur"
                        valFR={tFR['hero-title-highlight']}
                        valEN={tEN['hero-title-highlight']}
                        onSave={(fr, en) => {
                          updateTextBilingual('hero-title-highlight', fr, en);
                          showNotification();
                        }}
                      />
                      <BilingualField
                        label="Titre : Suffixe"
                        valFR={tFR['hero-title-suffix']}
                        valEN={tEN['hero-title-suffix']}
                        onSave={(fr, en) => {
                          updateTextBilingual('hero-title-suffix', fr, en);
                          showNotification();
                        }}
                      />
                    </div>

                    <BilingualField
                      label="Description Principale (Sous-titre Hero)"
                      isTextarea
                      valFR={tFR['hero-desc']}
                      valEN={tEN['hero-desc']}
                      onSave={(fr, en) => {
                        updateTextBilingual('hero-desc', fr, en);
                        showNotification();
                      }}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <BilingualField
                        label="Bouton Principal (Jaune)"
                        valFR={tFR['hero-cta-primary']}
                        valEN={tEN['hero-cta-primary']}
                        onSave={(fr, en) => {
                          updateTextBilingual('hero-cta-primary', fr, en);
                          showNotification();
                        }}
                      />
                      <BilingualField
                        label="Bouton Secondaire (Contours)"
                        valFR={tFR['hero-cta-secondary']}
                        valEN={tEN['hero-cta-secondary']}
                        onSave={(fr, en) => {
                          updateTextBilingual('hero-cta-secondary', fr, en);
                          showNotification();
                        }}
                      />
                    </div>

                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 pt-3">
                      Statistiques Clés (Barre Hero)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <BilingualField
                        label="Stat 1 Valeur"
                        valFR={tFR['stat-compliance-val']}
                        valEN={tEN['stat-compliance-val']}
                        onSave={(fr, en) => {
                          updateTextBilingual('stat-compliance-val', fr, en);
                          showNotification();
                        }}
                      />
                      <BilingualField
                        label="Stat 2 Valeur"
                        valFR={tFR['stat-experience-val']}
                        valEN={tEN['stat-experience-val']}
                        onSave={(fr, en) => {
                          updateTextBilingual('stat-experience-val', fr, en);
                          showNotification();
                        }}
                      />
                      <BilingualField
                        label="Stat 3 Valeur"
                        valFR={tFR['stat-clients-val']}
                        valEN={tEN['stat-clients-val']}
                        onSave={(fr, en) => {
                          updateTextBilingual('stat-clients-val', fr, en);
                          showNotification();
                        }}
                      />
                      <BilingualField
                        label="Stat 4 Valeur"
                        valFR={tFR['stat-speed-val']}
                        valEN={tEN['stat-speed-val']}
                        onSave={(fr, en) => {
                          updateTextBilingual('stat-speed-val', fr, en);
                          showNotification();
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SERVICES */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {currentLang === 'FR'
                          ? 'Gestion des Services Stratégiques'
                          : 'Strategic Services Management'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {currentLang === 'FR'
                          ? 'Modifiez les fiches de service, badges et listes de livrables.'
                          : 'Edit service cards, badges and detailed deliverables.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={openNewServiceModal}
                      className="px-3.5 py-2 bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-[0_12px_30px_rgba(15,76,129,0.2)]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{currentLang === 'FR' ? 'Ajouter un service' : 'Add Service'}</span>
                    </button>
                  </div>

                  <div className="space-y-5">
                    {services.map((service, index) => (
                      <div
                        key={service.id}
                        className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-[0_10px_24px_rgba(15,23,42,0.04)] space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0f4c81] bg-blue-100 px-2.5 py-1 rounded-lg">
                            Service #{index + 1} ({service.id})
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              requestConfirm(
                                currentLang === 'FR'
                                  ? 'Supprimer ce service ?'
                                  : 'Delete this service?',
                                currentLang === 'FR'
                                  ? 'Cette action supprimera définitivement le service de la boutique en ligne. Continuer ?'
                                  : 'This action will permanently remove the service from the site. Continue?',
                                () => {
                                  deleteService(service.id);
                                  showNotification();
                                  setConfirmAction(null);
                                },
                                'danger'
                              )
                            }
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Supprimer ce service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Titre (FR)
                            </label>
                            <input
                              type="text"
                              value={service.title.FR}
                              onChange={(e) => {
                                updateService({
                                  ...service,
                                  title: { ...service.title, FR: e.target.value },
                                });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Title (EN)
                            </label>
                            <input
                              type="text"
                              value={service.title.EN}
                              onChange={(e) => {
                                updateService({
                                  ...service,
                                  title: { ...service.title, EN: e.target.value },
                                });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Badge / Tag (FR)
                            </label>
                            <input
                              type="text"
                              value={service.badge?.FR || ''}
                              onChange={(e) => {
                                updateService({
                                  ...service,
                                  badge: {
                                    FR: e.target.value,
                                    EN: service.badge?.EN || '',
                                  },
                                });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Badge / Tag (EN)
                            </label>
                            <input
                              type="text"
                              value={service.badge?.EN || ''}
                              onChange={(e) => {
                                updateService({
                                  ...service,
                                  badge: {
                                    FR: service.badge?.FR || '',
                                    EN: e.target.value,
                                  },
                                });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Description (FR)
                            </label>
                            <textarea
                              rows={2}
                              value={service.description.FR}
                              onChange={(e) => {
                                updateService({
                                  ...service,
                                  description: { ...service.description, FR: e.target.value },
                                });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Description (EN)
                            </label>
                            <textarea
                              rows={2}
                              value={service.description.EN}
                              onChange={(e) => {
                                updateService({
                                  ...service,
                                  description: { ...service.description, EN: e.target.value },
                                });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Livrables clés (1 par ligne - FR)
                          </label>
                          <textarea
                            rows={3}
                            value={(service.deliverables.FR || []).join('\n')}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n').filter(Boolean);
                              updateService({
                                ...service,
                                deliverables: { ...service.deliverables, FR: lines },
                              });
                              showNotification();
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CAROUSEL & IMAGES */}
              {activeTab === 'carousel' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {currentLang === 'FR'
                          ? 'Carrousel & Téléversement de Photos'
                          : 'Carousel & Photo Uploads'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {currentLang === 'FR'
                          ? 'Téléversez vos propres photos de missions, chantiers, usines ou bureaux.'
                          : 'Upload your own custom mission photos, field audits, or offices.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newId = `slide-${Date.now()}`;
                        addCarouselSlide({
                          id: newId,
                          image:
                            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
                          title: { FR: 'Nouvelle Réalisation', EN: 'New Landmark Project' },
                          description: {
                            FR: "Description de la mission d'audit ou d'accompagnement réalisée.",
                            EN: 'Description of the audit or strategic advisory mission delivered.',
                          },
                          tag: { FR: 'Expertise', EN: 'Expertise' },
                        });
                        showNotification();
                      }}
                      className="px-3.5 py-2 bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {currentLang === 'FR' ? 'Ajouter une diapositive' : 'Add Slide'}
                      </span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {carouselSlides.map((slide, idx) => (
                      <div
                        key={slide.id}
                        className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-[0_10px_24px_rgba(15,23,42,0.04)] space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0f4c81] bg-blue-100 px-2.5 py-1 rounded-lg">
                            Slide #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              requestConfirm(
                                currentLang === 'FR'
                                  ? 'Supprimer cette diapositive ?'
                                  : 'Delete this slide?',
                                currentLang === 'FR'
                                  ? 'La diapositive sera retirée du carrousel public. Continuer ?'
                                  : 'The slide will be removed from the public carousel. Continue?',
                                () => {
                                  deleteCarouselSlide(slide.id);
                                  showNotification();
                                  setConfirmAction(null);
                                },
                                'danger'
                              )
                            }
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                          <div className="relative w-full sm:w-56 h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shrink-0">
                            <img
                              src={slide.image}
                              alt={slide.title.FR}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 w-full space-y-2">
                            <label className="block text-xs font-bold text-slate-700">
                              {currentLang === 'FR'
                                ? "Changer l'image de la diapositive"
                                : 'Change Slide Image'}
                            </label>

                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                id={`slide-upload-${slide.id}`}
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleSlideImageUpload(slide, f);
                                }}
                                className="hidden"
                              />
                              <label
                                htmlFor={`slide-upload-${slide.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>
                                  {currentLang === 'FR'
                                    ? 'Téléverser photo locale'
                                    : 'Upload photo'}
                                </span>
                              </label>

                              <input
                                type="url"
                                placeholder="Ou URL d'image web..."
                                defaultValue={slide.image.startsWith('data:') ? '' : slide.image}
                                onBlur={(e) => {
                                  if (e.target.value.trim()) {
                                    updateCarouselSlide({
                                      ...slide,
                                      image: e.target.value.trim(),
                                    });
                                    showNotification();
                                  }
                                }}
                                className="flex-1 min-w-[200px] px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Titre Diapositive (FR)
                            </label>
                            <input
                              type="text"
                              value={slide.title.FR}
                              onChange={(e) => {
                                updateCarouselSlide({
                                  ...slide,
                                  title: { ...slide.title, FR: e.target.value },
                                });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Slide Title (EN)
                            </label>
                            <input
                              type="text"
                              value={slide.title.EN}
                              onChange={(e) => {
                                updateCarouselSlide({
                                  ...slide,
                                  title: { ...slide.title, EN: e.target.value },
                                });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Badge / Tag (FR)
                            </label>
                            <input
                              type="text"
                              value={slide.tag.FR}
                              onChange={(e) => {
                                updateCarouselSlide({
                                  ...slide,
                                  tag: { ...slide.tag, FR: e.target.value },
                                });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Tag / Category (EN)
                            </label>
                            <input
                              type="text"
                              value={slide.tag.EN}
                              onChange={(e) => {
                                updateCarouselSlide({
                                  ...slide,
                                  tag: { ...slide.tag, EN: e.target.value },
                                });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Description (FR)
                            </label>
                            <textarea
                              rows={2}
                              value={slide.description.FR}
                              onChange={(e) => {
                                updateCarouselSlide({
                                  ...slide,
                                  description: { ...slide.description, FR: e.target.value },
                                });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Description (EN)
                            </label>
                            <textarea
                              rows={2}
                              value={slide.description.EN}
                              onChange={(e) => {
                                updateCarouselSlide({
                                  ...slide,
                                  description: { ...slide.description, EN: e.target.value },
                                });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: COMPLIANCE */}
              {activeTab === 'compliance' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {currentLang === 'FR'
                        ? 'Cadre Réglementaire & Normes'
                        : 'Regulatory Framework & Standards'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Modifiez les 4 cartes d'information réglementaire (OHADA, DGI, CGI, CNPS).
                    </p>
                  </div>

                  <div className="space-y-4">
                    <BilingualField
                      label="Carte 1 : Titre (SYSCOHADA)"
                      valFR={tFR['comp-box1-title']}
                      valEN={tEN['comp-box1-title']}
                      onSave={(fr, en) => {
                        updateTextBilingual('comp-box1-title', fr, en);
                        showNotification();
                      }}
                    />
                    <BilingualField
                      label="Carte 1 : Description (SYSCOHADA)"
                      isTextarea
                      valFR={tFR['comp-box1-desc']}
                      valEN={tEN['comp-box1-desc']}
                      onSave={(fr, en) => {
                        updateTextBilingual('comp-box1-desc', fr, en);
                        showNotification();
                      }}
                    />

                    <div className="pt-2 border-t" />

                    <BilingualField
                      label="Carte 2 : Titre (DSF 15 Mars)"
                      valFR={tFR['comp-box2-title']}
                      valEN={tEN['comp-box2-title']}
                      onSave={(fr, en) => {
                        updateTextBilingual('comp-box2-title', fr, en);
                        showNotification();
                      }}
                    />
                    <BilingualField
                      label="Carte 2 : Description (DSF 15 Mars)"
                      isTextarea
                      valFR={tFR['comp-box2-desc']}
                      valEN={tEN['comp-box2-desc']}
                      onSave={(fr, en) => {
                        updateTextBilingual('comp-box2-desc', fr, en);
                        showNotification();
                      }}
                    />

                    <div className="pt-2 border-t" />

                    <BilingualField
                      label="Carte 3 : Titre (CGI & Fiscalité)"
                      valFR={tFR['comp-box3-title']}
                      valEN={tEN['comp-box3-title']}
                      onSave={(fr, en) => {
                        updateTextBilingual('comp-box3-title', fr, en);
                        showNotification();
                      }}
                    />
                    <BilingualField
                      label="Carte 3 : Description (CGI & Fiscalité)"
                      isTextarea
                      valFR={tFR['comp-box3-desc']}
                      valEN={tEN['comp-box3-desc']}
                      onSave={(fr, en) => {
                        updateTextBilingual('comp-box3-desc', fr, en);
                        showNotification();
                      }}
                    />

                    <div className="pt-2 border-t" />

                    <BilingualField
                      label="Carte 4 : Titre (CNPS & DIPE)"
                      valFR={tFR['comp-box4-title']}
                      valEN={tEN['comp-box4-title']}
                      onSave={(fr, en) => {
                        updateTextBilingual('comp-box4-title', fr, en);
                        showNotification();
                      }}
                    />
                    <BilingualField
                      label="Carte 4 : Description (CNPS & DIPE)"
                      isTextarea
                      valFR={tFR['comp-box4-desc']}
                      valEN={tEN['comp-box4-desc']}
                      onSave={(fr, en) => {
                        updateTextBilingual('comp-box4-desc', fr, en);
                        showNotification();
                      }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: TESTIMONIALS */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {currentLang === 'FR'
                        ? 'Validation des témoignages clients'
                        : 'Client testimonial moderation'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {currentLang === 'FR'
                        ? 'La file d’attente d’administration est strictement limitée à l’approbation ou au rejet des avis soumis.'
                        : 'The admin review queue is limited to approving or rejecting submitted feedback.'}
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        {currentLang === 'FR' ? 'En attente' : 'Pending'}
                      </h5>

                      {pendingTestimonials.length > 0 ? (
                        pendingTestimonials.map((item, idx) => (
                          <div
                            key={item.id}
                            className="bg-amber-50/80 p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-[0_10px_24px_rgba(180,83,9,0.06)] space-y-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-900 bg-amber-100 px-2 py-1 rounded-lg">
                                  {currentLang === 'FR' ? 'À examiner' : 'Review'}
                                </span>
                                <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    approveTestimonial(item.id);
                                    showNotification();
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {currentLang === 'FR' ? 'Approuver' : 'Approve'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    requestConfirm(
                                      currentLang === 'FR'
                                        ? 'Rejeter cette soumission ?'
                                        : 'Reject this submission?',
                                      currentLang === 'FR'
                                        ? 'Le témoignage ne sera plus visible sur le site public. Continuer ?'
                                        : 'The testimonial will no longer be visible on the public website. Continue?',
                                      () => {
                                        rejectTestimonial(item.id);
                                        showNotification();
                                        setConfirmAction(null);
                                      },
                                      'danger'
                                    )
                                  }
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-[11px] font-bold hover:bg-red-700"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  {currentLang === 'FR' ? 'Rejeter' : 'Reject'}
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                                  Auteur
                                </label>
                                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
                                  {item.author}
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                                  E-mail
                                </label>
                                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
                                  {item.email || '—'}
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                                  Entreprise
                                </label>
                                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
                                  {item.company}
                                </div>
                              </div>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 italic">
                              “{item.quote.FR || item.quote.EN}”
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                          {currentLang === 'FR'
                            ? 'Aucune soumission cliente en attente pour le moment.'
                            : 'No customer submissions awaiting review.'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pt-2 border-t border-slate-200">
                      <h5 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        {currentLang === 'FR' ? 'Approuvés' : 'Approved'}
                      </h5>

                      {approvedTestimonials.length > 0 ? (
                        approvedTestimonials.map((item, idx) => (
                          <div
                            key={item.id}
                            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-[0_10px_24px_rgba(15,23,42,0.04)] space-y-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                                  {currentLang === 'FR' ? 'Approuvé' : 'Approved'}
                                </span>
                                <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  requestConfirm(
                                    currentLang === 'FR'
                                      ? 'Rejeter ce témoignage approuvé ?'
                                      : 'Reject this approved testimonial?',
                                    currentLang === 'FR'
                                      ? 'Ce témoignage sera retiré de la page publique immédiatement. Continuer ?'
                                      : 'This testimonial will be removed from the public page immediately. Continue?',
                                    () => {
                                      rejectTestimonial(item.id);
                                      showNotification();
                                      setConfirmAction(null);
                                    },
                                    'danger'
                                  )
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-[11px] font-bold hover:bg-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                {currentLang === 'FR' ? 'Rejeter' : 'Reject'}
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                                  Auteur
                                </label>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                                  {item.author}
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                                  E-mail
                                </label>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                                  {item.email || '—'}
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                                  Entreprise
                                </label>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                                  {item.company}
                                </div>
                              </div>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 italic">
                              “{item.quote.FR || item.quote.EN}”
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                          {currentLang === 'FR'
                            ? 'Aucun témoignage approuvé pour le moment.'
                            : 'No approved testimonials yet.'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pt-2 border-t border-slate-200">
                      <h5 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        {currentLang === 'FR' ? 'Rejetés' : 'Rejected'}
                      </h5>

                      {rejectedTestimonials.length > 0 ? (
                        rejectedTestimonials.map((item, idx) => (
                          <div
                            key={item.id}
                            className="bg-rose-50/80 p-4 sm:p-5 rounded-2xl border border-rose-200 shadow-[0_10px_24px_rgba(190,24,93,0.06)] space-y-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-rose-700 bg-rose-100 px-2 py-1 rounded-lg">
                                  {currentLang === 'FR' ? 'Rejeté' : 'Rejected'}
                                </span>
                                <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  approveTestimonial(item.id);
                                  showNotification();
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {currentLang === 'FR' ? 'Rétablir' : 'Restore'}
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                                  Auteur
                                </label>
                                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
                                  {item.author}
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                                  E-mail
                                </label>
                                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
                                  {item.email || '—'}
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                                  Entreprise
                                </label>
                                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
                                  {item.company}
                                </div>
                              </div>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 italic">
                              “{item.quote.FR || item.quote.EN}”
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                          {currentLang === 'FR'
                            ? 'Aucun témoignage rejeté pour le moment.'
                            : 'No rejected testimonials yet.'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: CONTACT & OFFICES */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {currentLang === 'FR'
                        ? 'Bureaux, Téléphones & Coordonnées'
                        : 'Offices, Phone & Coordinates'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Modifiez les coordonnées affichées pour Douala, Yaoundé et le canal WhatsApp.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {officeLocations.map((loc, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-[0_10px_24px_rgba(15,23,42,0.04)] space-y-3"
                      >
                        <h5 className="font-bold text-sm text-[#0f4c81]">
                          Bureau #{idx + 1} - {loc.city.FR}
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Adresse physique
                            </label>
                            <input
                              type="text"
                              value={loc.address}
                              onChange={(e) => {
                                updateOfficeLocation(idx, { ...loc, address: e.target.value });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Numéro de Téléphone
                            </label>
                            <input
                              type="text"
                              value={loc.phone}
                              onChange={(e) => {
                                updateOfficeLocation(idx, { ...loc, phone: e.target.value });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Adresse Email
                            </label>
                            <input
                              type="email"
                              value={loc.email}
                              onChange={(e) => {
                                updateOfficeLocation(idx, { ...loc, email: e.target.value });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Horaires d'ouverture
                            </label>
                            <input
                              type="text"
                              value={loc.schedule.FR}
                              onChange={(e) => {
                                updateOfficeLocation(idx, {
                                  ...loc,
                                  schedule: { FR: e.target.value, EN: e.target.value },
                                });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: BACKUP & RESTORE */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {currentLang === 'FR'
                        ? 'Sauvegarde, Export & Réinitialisation'
                        : 'Backup, Export & Factory Reset'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Exportez l'intégralité du site (textes, images, services) sous forme de fichier
                      JSON ou restaurez les paramètres d'usine.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_10px_24px_rgba(15,23,42,0.04)] flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0f4c81] flex items-center justify-center mb-3">
                          <Download className="w-5 h-5" />
                        </div>
                        <h5 className="font-bold text-sm text-slate-900 mb-1">
                          {currentLang === 'FR' ? 'Exporter en JSON' : 'Export JSON'}
                        </h5>
                        <p className="text-xs text-slate-600 mb-4">
                          Téléchargez un fichier de sauvegarde complet contenant toutes vos
                          modifications.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={exportBackup}
                        className="w-full py-2.5 px-3 bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        {currentLang === 'FR' ? 'Télécharger la sauvegarde' : 'Download Backup'}
                      </button>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_10px_24px_rgba(15,23,42,0.04)] flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                          <Upload className="w-5 h-5" />
                        </div>
                        <h5 className="font-bold text-sm text-slate-900 mb-1">
                          {currentLang === 'FR' ? 'Importer un JSON' : 'Import JSON'}
                        </h5>
                        <p className="text-xs text-slate-600 mb-4">
                          Chargez un fichier de sauvegarde précédemment exporté pour restaurer le
                          site.
                        </p>
                      </div>

                      <div>
                        <input
                          ref={backupFileInputRef}
                          type="file"
                          accept=".json,application/json"
                          onChange={handleImportFile}
                          className="hidden"
                          id="backup-file-input"
                        />
                        <label
                          htmlFor="backup-file-input"
                          className="w-full inline-flex items-center justify-center py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                        >
                          {currentLang === 'FR' ? 'Sélectionner un fichier' : 'Select File'}
                        </label>
                      </div>
                    </div>

                    <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200 flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
                          <RotateCcw className="w-5 h-5" />
                        </div>
                        <h5 className="font-bold text-sm text-red-950 mb-1">
                          {currentLang === 'FR' ? 'Réinitialiser' : 'Factory Reset'}
                        </h5>
                        <p className="text-xs text-red-700/80 mb-4">
                          Supprime toutes les modifications personnalisées et restaure le contenu
                          d'origine.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          requestConfirm(
                            currentLang === 'FR'
                              ? 'Réinitialiser le contenu ?'
                              : 'Reset the content?',
                            currentLang === 'FR'
                              ? 'Attention : cette action effacera toutes vos modifications personnalisées et restaurera le contenu d’origine. Continuer ?'
                              : 'Warning: this action will clear all custom edits and restore the original content. Continue?',
                            () => {
                              resetToDefaults();
                              showNotification();
                              setConfirmAction(null);
                            },
                            'danger'
                          )
                        }
                        className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        {currentLang === 'FR'
                          ? "Réinitialiser aux valeurs d'origine"
                          : 'Reset to Defaults'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: USERS & SECURITY */}
              {activeTab === 'users' && <UserManagementSection currentLang={currentLang} />}

              {/* TAB 9: SEO & VISIBILITY */}
              {activeTab === 'seo' && <SEOManagementSection currentLang={currentLang} />}
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {noticeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] overflow-hidden"
            >
              <div
                className={`px-5 py-4 border-b ${
                  noticeModal.variant === 'error'
                    ? 'border-red-100 bg-red-50'
                    : noticeModal.variant === 'success'
                    ? 'border-emerald-100 bg-emerald-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ${
                      noticeModal.variant === 'error'
                        ? 'bg-red-100 text-red-600'
                        : noticeModal.variant === 'success'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {noticeModal.variant === 'error' ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{noticeModal.title}</h3>
                    <p className="mt-1 text-xs text-slate-600">{noticeModal.message}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end px-5 py-4 bg-white">
                <button
                  type="button"
                  onClick={() => setNoticeModal(null)}
                  className="px-4 py-2 text-sm font-bold rounded-xl bg-[#0f4c81] hover:bg-[#1d70b8] text-white transition-colors"
                >
                  {currentLang === 'FR' ? 'OK' : 'OK'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.26)] overflow-hidden"
            >
              <div
                className={`px-5 py-4 border-b ${
                  confirmAction.variant === 'danger'
                    ? 'border-red-100 bg-red-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ${
                      confirmAction.variant === 'danger'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {confirmAction.variant === 'danger' ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <ShieldCheck className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{confirmAction.title}</h3>
                    <p className="mt-1 text-xs text-slate-600">{confirmAction.message}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-5 py-4 bg-white">
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {currentLang === 'FR' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleConfirmAction();
                  }}
                  className={`px-4 py-2 text-sm font-bold rounded-xl text-white transition-colors ${
                    confirmAction.variant === 'danger'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-[#0f4c81] hover:bg-[#1d70b8]'
                  }`}
                >
                  {currentLang === 'FR' ? 'Confirmer' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isAddServiceModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              className="w-full max-w-2xl rounded-[24px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.26)] overflow-hidden"
            >
              <div className="bg-gradient-to-r from-slate-950 via-[#0b3557] to-[#0f4c81] px-5 py-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/10 border border-white/10">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">
                      {currentLang === 'FR' ? 'Ajouter un nouveau service' : 'Add a new service'}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {currentLang === 'FR'
                        ? 'Créez une fiche de service premium pour le site.'
                        : 'Create a premium service card for the website.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddServiceModalOpen(false)}
                  className="p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1">
                      {currentLang === 'FR' ? 'Badge FR' : 'Badge FR'}
                    </label>
                    <input
                      type="text"
                      value={serviceDraft.badge?.FR || ''}
                      onChange={(e) =>
                        setServiceDraft({
                          ...serviceDraft,
                          badge: {
                            FR: e.target.value,
                            EN: serviceDraft.badge?.EN || '',
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#0f4c81] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1">
                      {currentLang === 'FR' ? 'Badge EN' : 'Badge EN'}
                    </label>
                    <input
                      type="text"
                      value={serviceDraft.badge?.EN || ''}
                      onChange={(e) =>
                        setServiceDraft({
                          ...serviceDraft,
                          badge: {
                            FR: serviceDraft.badge?.FR || '',
                            EN: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#0f4c81] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1">
                      {currentLang === 'FR' ? 'Titre FR' : 'Title FR'}
                    </label>
                    <input
                      type="text"
                      value={serviceDraft.title.FR}
                      onChange={(e) =>
                        setServiceDraft({
                          ...serviceDraft,
                          title: { ...serviceDraft.title, FR: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#0f4c81] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1">
                      {currentLang === 'FR' ? 'Titre EN' : 'Title EN'}
                    </label>
                    <input
                      type="text"
                      value={serviceDraft.title.EN}
                      onChange={(e) =>
                        setServiceDraft({
                          ...serviceDraft,
                          title: { ...serviceDraft.title, EN: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#0f4c81] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1">
                      {currentLang === 'FR' ? 'Description FR' : 'Description FR'}
                    </label>
                    <textarea
                      rows={3}
                      value={serviceDraft.description.FR}
                      onChange={(e) =>
                        setServiceDraft({
                          ...serviceDraft,
                          description: { ...serviceDraft.description, FR: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#0f4c81] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1">
                      {currentLang === 'FR' ? 'Description EN' : 'Description EN'}
                    </label>
                    <textarea
                      rows={3}
                      value={serviceDraft.description.EN}
                      onChange={(e) =>
                        setServiceDraft({
                          ...serviceDraft,
                          description: { ...serviceDraft.description, EN: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#0f4c81] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1">
                      {currentLang === 'FR' ? 'Livrables FR' : 'Deliverables FR'}
                    </label>
                    <textarea
                      rows={4}
                      value={(serviceDraft.deliverables.FR || []).join('\n')}
                      onChange={(e) =>
                        setServiceDraft({
                          ...serviceDraft,
                          deliverables: {
                            ...serviceDraft.deliverables,
                            FR: e.target.value
                              .split('\n')
                              .map((line) => line.trim())
                              .filter(Boolean),
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#0f4c81] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1">
                      {currentLang === 'FR' ? 'Livrables EN' : 'Deliverables EN'}
                    </label>
                    <textarea
                      rows={4}
                      value={(serviceDraft.deliverables.EN || []).join('\n')}
                      onChange={(e) =>
                        setServiceDraft({
                          ...serviceDraft,
                          deliverables: {
                            ...serviceDraft.deliverables,
                            EN: e.target.value
                              .split('\n')
                              .map((line) => line.trim())
                              .filter(Boolean),
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#0f4c81] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1">
                    {currentLang === 'FR' ? 'Icône' : 'Icon'}
                  </label>
                  <select
                    value={serviceDraft.iconName}
                    onChange={(e) =>
                      setServiceDraft({
                        ...serviceDraft,
                        iconName: e.target.value as ServiceItem['iconName'],
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-[#0f4c81] outline-none bg-white"
                  >
                    <option value="calculator">Calculator</option>
                    <option value="file-spreadsheet">Spreadsheet</option>
                    <option value="shield-check">Shield</option>
                    <option value="trending-up">Growth</option>
                    <option value="book-open">Book</option>
                    <option value="award">Award</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsAddServiceModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    {currentLang === 'FR' ? 'Annuler' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={saveNewService}
                    className="px-4 py-2 text-sm font-bold rounded-xl bg-[#0f4c81] hover:bg-[#1d70b8] text-white shadow-[0_12px_24px_rgba(15,76,129,0.2)] transition-colors"
                  >
                    {currentLang === 'FR' ? 'Enregistrer le service' : 'Save service'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}

interface BilingualFieldProps {
  label: string;
  valFR: string;
  valEN: string;
  isTextarea?: boolean;
  onSave: (valFR: string, valEN: string) => void;
}

function BilingualField({ label, valFR, valEN, isTextarea, onSave }: BilingualFieldProps) {
  const [fr, setFr] = useState(valFR);
  const [en, setEn] = useState(valEN);

  if (fr !== valFR && fr === '') setFr(valFR);
  if (en !== valEN && en === '') setEn(valEN);

  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-[0_6px_18px_rgba(15,23,42,0.03)] space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800">{label}</span>
        {(fr !== valFR || en !== valEN) && (
          <button
            type="button"
            onClick={() => onSave(fr, en)}
            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-bold rounded-md flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <Save className="w-3 h-3" />
            <span>Enregistrer</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <span className="block text-[10px] font-bold uppercase text-[#0f4c81] mb-1">
            Version FR
          </span>
          {isTextarea ? (
            <textarea
              rows={2}
              value={fr}
              onChange={(e) => setFr(e.target.value)}
              onBlur={() => onSave(fr, en)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none bg-white text-slate-900"
            />
          ) : (
            <input
              type="text"
              value={fr}
              onChange={(e) => setFr(e.target.value)}
              onBlur={() => onSave(fr, en)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none bg-white text-slate-900"
            />
          )}
        </div>

        <div>
          <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
            Version EN
          </span>
          {isTextarea ? (
            <textarea
              rows={2}
              value={en}
              onChange={(e) => setEn(e.target.value)}
              onBlur={() => onSave(fr, en)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none bg-white text-slate-900"
            />
          ) : (
            <input
              type="text"
              value={en}
              onChange={(e) => setEn(e.target.value)}
              onBlur={() => onSave(fr, en)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none bg-white text-slate-900"
            />
          )}
        </div>
      </div>
    </div>
  );
}