import { BookOpen, Calendar, ShieldCheck, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { useCMS } from '../context/CMSContext';
import { EditableText } from './EditableText';

interface ComplianceSectionProps {
  currentLang: Language;
}

export function ComplianceSection({ currentLang }: ComplianceSectionProps) {
  const { getTranslations } = useCMS();
  const t = getTranslations(currentLang);

  const frameworks = [
    {
      title: t['comp-box1-title'],
      desc: t['comp-box1-desc'],
      titleKey: 'comp-box1-title',
      descKey: 'comp-box1-desc',
      icon: BookOpen,
      tag: 'OHADA',
    },
    {
      title: t['comp-box2-title'],
      desc: t['comp-box2-desc'],
      titleKey: 'comp-box2-title',
      descKey: 'comp-box2-desc',
      icon: Calendar,
      tag: 'DGI Cameroun',
    },
    {
      title: t['comp-box3-title'],
      desc: t['comp-box3-desc'],
      titleKey: 'comp-box3-title',
      descKey: 'comp-box3-desc',
      icon: ShieldCheck,
      tag: 'CGI & Loi Finances',
    },
    {
      title: t['comp-box4-title'],
      desc: t['comp-box4-desc'],
      titleKey: 'comp-box4-title',
      descKey: 'comp-box4-desc',
      icon: Users,
      tag: 'CNPS & DIPE',
    },
  ];

  return (
    <section id="compliance" className="py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#e67e22] bg-amber-50 px-3.5 py-1 rounded-full inline-block mb-3 border border-amber-200">
            {currentLang === 'FR' ? 'Normes & Rigueur' : 'Regulatory Rigor'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            <EditableText translationKey="comp-title" label="Titre Conformité">
              <span>{t['comp-title']}</span>
            </EditableText>
          </h2>
          <div className="w-16 h-1 bg-[#e67e22] mx-auto rounded-full mb-6" />
          <EditableText translationKey="comp-subtitle" label="Sous-titre Conformité" as="p" className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {t['comp-subtitle']}
          </EditableText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {frameworks.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-[#0f4c81] transition-all hover:bg-white hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0f4c81] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    <EditableText translationKey={item.titleKey} label={`Bloc ${index + 1} - Titre`}>
                      <span>{item.title}</span>
                    </EditableText>
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <EditableText translationKey={item.descKey} label={`Bloc ${index + 1} - Texte`} as="p">
                      {item.desc}
                    </EditableText>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
