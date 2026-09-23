import { useState, FormEvent } from 'react';
import { Send, CheckCircle2, MapPin, Phone, Mail, Clock, MessageSquareQuote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Language, ContactFormData } from '../types';
import { useCMS } from '../context/CMSContext';
import { EditableText } from './EditableText';

import { GoogleMapsLocalization } from './GoogleMapsLocalization';

interface ContactSectionProps {
  currentLang: Language;
  selectedServicePreload?: string;
}

export function ContactSection({ currentLang, selectedServicePreload }: ContactSectionProps) {
  const { getTranslations, officeLocations } = useCMS();
  const t = getTranslations(currentLang);

  const [formData, setFormData] = useState<ContactFormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    serviceType: selectedServicePreload || 'syscohada',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionRef, setSubmissionRef] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();


// inside handleSubmit, after validation passes:
try {
  const { error } = await supabase.from('contact_messages').insert({
    company_name: formData.companyName,
    contact_person: formData.contactPerson,
    email: formData.email,
    phone: formData.phone,
    service_type: formData.serviceType,
    message: formData.message,
  });

  if (error) {
    console.error('Contact message insert failed:', error.message);
    // You can still show success, or show a soft warning — up to you.
  }
} catch (err) {
  console.error('Contact message insert threw:', err);
}

// existing success UI:
setSubmitted(true);
    setIsSubmitting(true);

    const randomRef = `REQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const { error } = await supabase
      .from('consultation_requests')
      .insert([
        {
          company_name: formData.companyName,
          contact_person: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          service_type: formData.serviceType,
          message: formData.message,
          tracking_ref: randomRef,
        },
      ]);

    if (error) {
      console.error('Failed to submit consultation request:', error);
      setIsSubmitting(false);
      return;
    }

    setSubmissionRef(randomRef);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmissionRef('');
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      serviceType: selectedServicePreload || 'syscohada',
      message: '',
    });
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0f4c81] bg-blue-100/60 px-3.5 py-1 rounded-full inline-block mb-3">
            <EditableText translationKey="contact-tag" label="Tag Contact">
              <span>{t['contact-tag']}</span>
            </EditableText>
          </span>
          <h2 id="contact-title" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            <EditableText translationKey="contact-title" label="Titre Contact">
              <span>{t['contact-title']}</span>
            </EditableText>
          </h2>
          <div className="w-16 h-1 bg-[#e67e22] mx-auto rounded-full mb-6" />
          <EditableText translationKey="contact-subtitle" label="Sous-titre Contact" as="p" className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {t['contact-subtitle']}
          </EditableText>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Office details & Direct contact cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#0f4c81]" />
                <span>{t['offices-title']}</span>
              </h3>

              <div className="space-y-6">
                {officeLocations.map((loc, idx) => (
                  <div key={idx} className="pb-6 border-b border-slate-200 last:border-0 last:pb-0">
                    <h4 className="font-bold text-[#0f4c81] text-base mb-1">
                      {loc.city[currentLang]}
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">
                      {loc.address}
                    </p>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{loc.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{loc.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{loc.schedule[currentLang]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Box */}
            <div className="p-6 rounded-2xl bg-[#0f4c81] text-white flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base mb-1">
                  {currentLang === 'FR' ? 'Urgence Fiscale ou DSF ?' : 'Urgent Tax or DSF Query?'}
                </h4>
                <p className="text-xs text-slate-200">
                  {currentLang === 'FR' ? 'Échangez directement avec un associé sur WhatsApp' : 'Connect immediately with a senior partner on WhatsApp'}
                </p>
              </div>
              <a
                href="https://wa.me/237670123456"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center gap-1.5"
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contact & Consultation Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-lg">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success-box"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-10 text-center space-y-5"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {t['msg-badge']}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {currentLang === 'FR' ? 'Dossier Enregistré' : 'File Successfully Registered'}
                    </h3>
                    <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                      {t['msg-success']}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 inline-block text-left text-xs sm:text-sm text-slate-700">
                    <div><strong>{currentLang === 'FR' ? 'Numéro de suivi :' : 'Tracking Reference:'}</strong> <span className="font-mono text-[#0f4c81] font-bold">{submissionRef}</span></div>
                    <div><strong>{currentLang === 'FR' ? 'Entreprise :' : 'Company:'}</strong> {formData.companyName}</div>
                    <div><strong>{currentLang === 'FR' ? 'Responsable :' : 'Representative:'}</strong> {formData.contactPerson}</div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer"
                    >
                      {currentLang === 'FR' ? 'Nouvelle demande' : 'Submit another inquiry'}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Company Name */}
                    <div>
                      <label htmlFor="company-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        {t['lbl-company']} <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="company-name"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder={t['ph-company']}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#0f4c81] focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 text-sm transition-all"
                      />
                    </div>

                    {/* Contact Person */}
                    <div>
                      <label htmlFor="contact-person" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        {t['lbl-person']} <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact-person"
                        required
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        placeholder={t['ph-person']}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#0f4c81] focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        {t['lbl-email']} <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t['ph-email']}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#0f4c81] focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 text-sm transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        {t['lbl-phone']}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={t['ph-phone']}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#0f4c81] focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Service Selection */}
                  <div>
                    <label htmlFor="service-type" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      {t['lbl-select']}
                    </label>
                    <select
                      id="service-type"
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#0f4c81] focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 text-sm bg-white transition-all cursor-pointer"
                    >
                      <option value="syscohada">{t['opt1']}</option>
                      <option value="tax">{t['opt2']}</option>
                      <option value="bookkeeping">{t['opt3']}</option>
                      <option value="audit">{t['opt4']}</option>
                      <option value="restructuring">{t['opt5']}</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      {t['lbl-msg']} <span className="text-amber-600">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t['ph-msg']}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#0f4c81] focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 text-sm transition-all resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    id="btn-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#0f4c81] hover:bg-[#1d70b8] active:scale-[0.99] text-white font-bold text-base shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t['btn-submitting']}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t['btn-submit']}</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-500">
                    {currentLang === 'FR'
                      ? 'Vos données sont traitées dans le respect du secret professionnel et des normes de confidentialité OHADA.'
                      : 'Your corporate information is protected by statutory professional secrecy and OHADA confidentiality rules.'}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Embedded Interactive Google Maps Localization */}
        <GoogleMapsLocalization currentLang={currentLang} />
      </div>
    </section>
  );
}
