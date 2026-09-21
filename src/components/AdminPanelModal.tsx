import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sliders,
  Image as ImageIcon,
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
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { Language, ServiceItem, CarouselSlide, TestimonialItem } from '../types';
import { compressImageFile } from '../utils/imageUtils';
import { UserManagementSection } from './admin/UserManagementSection';
import { SEOManagementSection } from './admin/SEOManagementSection';

interface AdminPanelModalProps {
  currentLang: Language;
}

type TabType = 'hero' | 'services' | 'carousel' | 'compliance' | 'testimonials' | 'contact' | 'users' | 'seo' | 'backup';

export function AdminPanelModal({ currentLang }: AdminPanelModalProps) {
  const {
    isAdminPanelOpen,
    setIsAdminPanelOpen,
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
    deleteTestimonial,
    officeLocations,
    updateOfficeLocation,
    heroBg,
    heroImages,
    updateHeroBg,
    updateHeroImages,
    addHeroImage,
    removeHeroImage,
    exportBackup,
    importBackup,
    resetToDefaults,
  } = useCMS();

  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [customHeroUrl, setCustomHeroUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  const tFR = getTranslations('FR');
  const tEN = getTranslations('EN');

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
      updateHeroBg(compressedDataUrl);
      showNotification();
    } catch (err: any) {
      alert(err.message || 'Erreur lors du traitement de l\'image.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSlideImageUpload = async (slide: CarouselSlide, file: File) => {
    try {
      setIsUploading(true);
      const compressedDataUrl = await compressImageFile(file, 1280, 720, 0.82);
      updateCarouselSlide({ ...slide, image: compressedDataUrl });
      showNotification();
    } catch (err: any) {
      alert(err.message || 'Erreur lors du traitement de l\'image.');
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
          alert(currentLang === 'FR' ? 'Contenu importé avec succès !' : 'Content imported successfully!');
        } else {
          alert(currentLang === 'FR' ? 'Fichier JSON invalide.' : 'Invalid JSON file.');
        }
      }
    };
    reader.readAsText(file);
    if (backupFileInputRef.current) backupFileInputRef.current.value = '';
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'hero', label: currentLang === 'FR' ? 'Hero & Textes Accueil' : 'Hero & Homepage', icon: Type },
    { id: 'services', label: currentLang === 'FR' ? 'Services & Livrables' : 'Services & Offerings', icon: Briefcase },
    { id: 'carousel', label: currentLang === 'FR' ? 'Carrousel & Photos' : 'Carousel & Media', icon: ImageIcon },
    { id: 'compliance', label: currentLang === 'FR' ? 'Cadre Réglementaire' : 'Compliance & Norms', icon: ShieldCheck },
    { id: 'testimonials', label: currentLang === 'FR' ? 'Avis Clients & Stats' : 'Testimonials & Reviews', icon: Award },
    { id: 'contact', label: currentLang === 'FR' ? 'Bureaux & Contact' : 'Offices & Contact', icon: MapPin },
    { id: 'users', label: currentLang === 'FR' ? 'Utilisateurs & Sécurité' : 'Users & Security', icon: Users },
    { id: 'seo', label: currentLang === 'FR' ? 'Référencement & SEO' : 'SEO & Visibility', icon: Globe },
    { id: 'backup', label: currentLang === 'FR' ? 'Sauvegarde & Import' : 'Backup & Restore', icon: Download },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAdminPanelOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Panel Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-6 flex flex-col max-h-[90vh]"
        >
          {/* Top Bar */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0f4c81] rounded-xl text-white">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                  <span>{currentLang === 'FR' ? 'Panneau Administrateur CMS' : 'Admin CMS Control Center'}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    En direct
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {currentLang === 'FR'
                    ? 'Modifiez tous les textes, téléversez des images et gérez l\'intégralité du contenu.'
                    : 'Modify all site texts, upload images, and control all section contents.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {saveSuccessNotice && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold animate-pulse">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{currentLang === 'FR' ? 'Modifications enregistrées !' : 'Saved!'}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsAdminPanelOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Layout: Tabs + Content */}
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-3 shrink-0 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap md:whitespace-normal text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#0f4c81] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: HERO & GENERAL */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  {/* Hero Background Images (Framer Motion Slides) */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#0f4c81]" />
                          <span>{currentLang === 'FR' ? 'Diaporama d\'Arrière-Plan Hero (Framer Motion)' : 'Hero Background Slides (Framer Motion)'}</span>
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

                    {/* Slides Grid Preview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {heroImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all group aspect-video bg-slate-900 ${
                            idx === 0 ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-300 hover:border-[#0f4c81]'
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
                                {idx === 0 ? (currentLang === 'FR' ? '1 (Principal)' : '1 (Main)') : `#${idx + 1}`}
                              </span>
                              {heroImages.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    removeHeroImage(idx);
                                    showNotification();
                                  }}
                                  className="p-1 rounded-md bg-red-600/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  title={currentLang === 'FR' ? 'Supprimer cette image' : 'Remove image'}
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

                    {/* Upload and Add Controls */}
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
                              'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2000&q=80'
                            ]);
                            showNotification();
                          }}
                          className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          {currentLang === 'FR' ? 'Restaurer diapos par défaut' : 'Reset default slides'}
                        </button>
                      </div>

                      {/* URL input */}
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="url"
                          placeholder={currentLang === 'FR' ? "Coller une URL d'image pour ajouter un slide..." : "Paste image URL to add slide..."}
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

                  {/* Hero Texts Form */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b pb-2">
                      <Type className="w-4 h-4 text-[#0f4c81]" />
                      <span>{currentLang === 'FR' ? 'Titres & Textes du Hero' : 'Hero Titles & Subtitles'}</span>
                    </h4>

                    {/* Badge */}
                    <BilingualField
                      label="Badge supérieur (Hero)"
                      valFR={tFR['hero-badge']}
                      valEN={tEN['hero-badge']}
                      onSave={(fr, en) => {
                        updateTextBilingual('hero-badge', fr, en);
                        showNotification();
                      }}
                    />

                    {/* Title Prefix, Highlight, Suffix */}
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

                    {/* Description */}
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

                    {/* CTA Buttons */}
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

                    {/* Stats metrics */}
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
                        {currentLang === 'FR' ? 'Gestion des Services Stratégiques' : 'Strategic Services Management'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {currentLang === 'FR'
                          ? 'Modifiez les fiches de service, badges et listes de livrables.'
                          : 'Edit service cards, badges and detailed deliverables.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newId = `service-${Date.now()}`;
                        addService({
                          id: newId,
                          iconName: 'calculator',
                          badge: { FR: 'Nouveau Service', EN: 'New Service' },
                          title: { FR: 'Nouveau Service Conseil', EN: 'New Advisory Service' },
                          description: {
                            FR: 'Description détaillée de la nouvelle prestation comptable ou fiscale.',
                            EN: 'Detailed description of this accounting or consulting offering.',
                          },
                          deliverables: {
                            FR: ['Livrable 1 : Analyse préliminaire', 'Livrable 2 : Rapport exécutif'],
                            EN: ['Deliverable 1: Preliminary analysis', 'Deliverable 2: Executive report'],
                          },
                        });
                        showNotification();
                      }}
                      className="px-3.5 py-2 bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{currentLang === 'FR' ? 'Ajouter un service' : 'Add Service'}</span>
                    </button>
                  </div>

                  <div className="space-y-5">
                    {services.map((service, index) => (
                      <div
                        key={service.id}
                        className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0f4c81] bg-blue-100 px-2.5 py-1 rounded-lg">
                            Service #{index + 1} ({service.id})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Voulez-vous vraiment supprimer ce service ?')) {
                                deleteService(service.id);
                                showNotification();
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Supprimer ce service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Title FR & EN */}
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

                        {/* Badge FR & EN */}
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

                        {/* Description FR & EN */}
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

                        {/* Deliverables Bullet Points */}
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
                        {currentLang === 'FR' ? 'Carrousel & Téléversement de Photos' : 'Carousel & Photo Uploads'}
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
                            FR: 'Description de la mission d\'audit ou d\'accompagnement réalisée.',
                            EN: 'Description of the audit or strategic advisory mission delivered.',
                          },
                          tag: { FR: 'Expertise', EN: 'Expertise' },
                        });
                        showNotification();
                      }}
                      className="px-3.5 py-2 bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{currentLang === 'FR' ? 'Ajouter une diapositive' : 'Add Slide'}</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {carouselSlides.map((slide, idx) => (
                      <div
                        key={slide.id}
                        className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0f4c81] bg-blue-100 px-2.5 py-1 rounded-lg">
                            Slide #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Voulez-vous supprimer cette diapositive ?')) {
                                deleteCarouselSlide(slide.id);
                                showNotification();
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Slide Image + Uploader */}
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
                              {currentLang === 'FR' ? 'Changer l\'image de la diapositive' : 'Change Slide Image'}
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
                                <span>{currentLang === 'FR' ? 'Téléverser photo locale' : 'Upload photo'}</span>
                              </label>

                              <input
                                type="url"
                                placeholder="Ou URL d'image web..."
                                defaultValue={slide.image.startsWith('data:') ? '' : slide.image}
                                onBlur={(e) => {
                                  if (e.target.value.trim()) {
                                    updateCarouselSlide({ ...slide, image: e.target.value.trim() });
                                    showNotification();
                                  }
                                }}
                                className="flex-1 min-w-[200px] px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Title FR / EN */}
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

                        {/* Tag FR / EN */}
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

                        {/* Description FR / EN */}
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
                      {currentLang === 'FR' ? 'Cadre Réglementaire & Normes' : 'Regulatory Framework & Standards'}
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {currentLang === 'FR' ? 'Témoignages & Études de Cas' : 'Client Testimonials & Case Studies'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Ajoutez, modifiez ou supprimez les avis de clients certifiés.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newId = `testi-${Date.now()}`;
                        addTestimonial({
                          id: newId,
                          author: 'Nom du Dirigeant',
                          role: { FR: 'Directeur Général', EN: 'Chief Executive Officer' },
                          company: 'Nouvelle Société SA',
                          industry: { FR: 'Commerce & Distribution', EN: 'Trade & Distribution' },
                          location: 'Douala, Littoral',
                          rating: 5,
                          avatarInitials: 'ND',
                          serviceUsed: { FR: 'Audit & Conformité DSF', EN: 'Statutory Audit & DSF' },
                          quote: {
                            FR: 'Une collaboration exemplaire et une expertise remarquable sur les normes fiscales camerounaises.',
                            EN: 'Exemplary collaboration and remarkable expertise in Cameroonian tax standards.',
                          },
                          highlightMetric: {
                            value: '0 FCFA',
                            label: { FR: 'Pénalités fiscales', EN: 'Tax penalties' },
                          },
                        });
                        showNotification();
                      }}
                      className="px-3.5 py-2 bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{currentLang === 'FR' ? 'Ajouter un témoignage' : 'Add Testimonial'}</span>
                    </button>
                  </div>

                  <div className="space-y-5">
                    {testimonials.map((item, idx) => (
                      <div
                        key={item.id}
                        className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0f4c81] bg-blue-100 px-2.5 py-1 rounded-lg">
                            Témoignage #{idx + 1} - {item.author} ({item.company})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Supprimer ce témoignage ?')) {
                                deleteTestimonial(item.id);
                                showNotification();
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Auteur (Nom & Prénom)
                            </label>
                            <input
                              type="text"
                              value={item.author}
                              onChange={(e) => {
                                updateTestimonial({ ...item, author: e.target.value });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Entreprise
                            </label>
                            <input
                              type="text"
                              value={item.company}
                              onChange={(e) => {
                                updateTestimonial({ ...item, company: e.target.value });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Localisation
                            </label>
                            <input
                              type="text"
                              value={item.location}
                              onChange={(e) => {
                                updateTestimonial({ ...item, location: e.target.value });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none"
                            />
                          </div>
                        </div>

                        {/* Quote FR / EN */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Citation / Témoignage (FR)
                            </label>
                            <textarea
                              rows={3}
                              value={item.quote.FR}
                              onChange={(e) => {
                                updateTestimonial({
                                  ...item,
                                  quote: { ...item.quote, FR: e.target.value },
                                });
                                showNotification();
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Quote / Review (EN)
                            </label>
                            <textarea
                              rows={3}
                              value={item.quote.EN}
                              onChange={(e) => {
                                updateTestimonial({
                                  ...item,
                                  quote: { ...item.quote, EN: e.target.value },
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

              {/* TAB 6: CONTACT & OFFICES */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {currentLang === 'FR' ? 'Bureaux, Téléphones & Coordonnées' : 'Offices, Phone & Coordinates'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Modifiez les coordonnées affichées pour Douala, Yaoundé et le canal WhatsApp.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {officeLocations.map((loc, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3"
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
                      {currentLang === 'FR' ? 'Sauvegarde, Export & Réinitialisation' : 'Backup, Export & Factory Reset'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Exportez l'intégralité du site (textes, images, services) sous forme de fichier JSON ou restaurez les paramètres d'usine.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Export Card */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0f4c81] flex items-center justify-center mb-3">
                          <Download className="w-5 h-5" />
                        </div>
                        <h5 className="font-bold text-sm text-slate-900 mb-1">
                          {currentLang === 'FR' ? 'Exporter en JSON' : 'Export JSON'}
                        </h5>
                        <p className="text-xs text-slate-600 mb-4">
                          Téléchargez un fichier de sauvegarde complet contenant toutes vos modifications.
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

                    {/* Import Card */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                          <Upload className="w-5 h-5" />
                        </div>
                        <h5 className="font-bold text-sm text-slate-900 mb-1">
                          {currentLang === 'FR' ? 'Importer un JSON' : 'Import JSON'}
                        </h5>
                        <p className="text-xs text-slate-600 mb-4">
                          Chargez un fichier de sauvegarde précédemment exporté pour restaurer le site.
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

                    {/* Factory Reset Card */}
                    <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200 flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
                          <RotateCcw className="w-5 h-5" />
                        </div>
                        <h5 className="font-bold text-sm text-red-950 mb-1">
                          {currentLang === 'FR' ? 'Réinitialiser' : 'Factory Reset'}
                        </h5>
                        <p className="text-xs text-red-700/80 mb-4">
                          Supprime toutes les modifications personnalisées et restaure le contenu d'origine.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              'Attention : Cette action effacera toutes vos modifications personnalisées. Continuer ?'
                            )
                          ) {
                            resetToDefaults();
                            showNotification();
                          }
                        }}
                        className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        {currentLang === 'FR' ? 'Réinitialiser aux valeurs d\'origine' : 'Reset to Defaults'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: USERS & SECURITY */}
              {activeTab === 'users' && (
                <UserManagementSection currentLang={currentLang} />
              )}

              {/* TAB 9: SEO & VISIBILITY */}
              {activeTab === 'seo' && (
                <SEOManagementSection currentLang={currentLang} />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Helper Subcomponent for Bilingual Text Editing
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

  // Sync if external props change
  if (fr !== valFR && fr === '') setFr(valFR);
  if (en !== valEN && en === '') setEn(valEN);

  return (
    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
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
          <span className="block text-[10px] font-bold uppercase text-[#0f4c81] mb-1">Version FR</span>
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
          <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Version EN</span>
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
