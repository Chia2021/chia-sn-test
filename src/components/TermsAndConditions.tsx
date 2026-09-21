import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  Scale,
  Lock,
  FileText,
  Clock,
  Search,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Copy,
  Check,
  Share2,
  FileCheck2,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types';

interface TermsAndConditionsProps {
  currentLang: Language;
  onBackToHome: () => void;
  onToggleLang?: () => void;
  onNavigateToContact?: () => void;
}

interface TermArticle {
  id: string;
  number: number;
  titleFR: string;
  titleEN: string;
  summaryFR: string;
  summaryEN: string;
  contentFR: React.ReactNode;
  contentEN: React.ReactNode;
  tagFR: string;
  tagEN: string;
}

export function TermsAndConditions({
  currentLang,
  onBackToHome,
  onToggleLang,
  onNavigateToContact,
}: TermsAndConditionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('art-1');
  const [copiedLink, setCopiedLink] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#terms`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const articles: TermArticle[] = [
    {
      id: 'art-1',
      number: 1,
      titleFR: 'Identification du Cabinet & Cadre Institutionnel',
      titleEN: 'Practice Identification & Institutional Framework',
      tagFR: 'Statut & Agréments',
      tagEN: 'Status & Accreditation',
      summaryFR: 'Statut officiel, sièges de Douala et Yaoundé, immatriculation fiscale et inscription ordinale.',
      summaryEN: 'Official status, Douala & Yaoundé offices, tax registration, and professional body accreditations.',
      contentFR: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            Le présent site internet et les prestations de conseil associées sont exploités par le{' '}
            <strong className="text-slate-900">Cabinet Chia-SN</strong>, cabinet d’expertise comptable, d’audit
            contractuel, de commissariat aux comptes et de conseil fiscal, régi par les lois de la République du Cameroun et
            les Actes Uniformes de l’Organisation pour l’Harmonisation en Afrique du Droit des Affaires (OHADA).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Siège Social (Douala)</span>
              <p className="font-semibold text-slate-900 mt-0.5">Bonanjo, Immeuble Horizon, 3ème étage</p>
              <p className="text-xs text-slate-600">B.P. 1245 Douala, Région du Littoral, Cameroun</p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Bureau de Liaison (Yaoundé)</span>
              <p className="font-semibold text-slate-900 mt-0.5">Bastos, Avenue des Ambassades</p>
              <p className="text-xs text-slate-600">Yaoundé, Région du Centre, Cameroun</p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Ordre & Réglementation</span>
              <p className="font-semibold text-slate-900 mt-0.5">Ordre National des Experts-Comptables (ONECCA)</p>
              <p className="text-xs text-slate-600">Agrément CEMAC / Zone Franc / SYSCOHADA</p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Fiscalité & Coordonnées</span>
              <p className="font-semibold text-slate-900 mt-0.5">NIF : M021500049281Z</p>
              <p className="text-xs text-slate-600">E-mail : contact@chia-sn.cm | Tél : +237 670 12 34 56</p>
            </div>
          </div>
          <p>
            Toute utilisation de ce site web et toute mission confiée au Cabinet Chia-SN implique l’acceptation pleine, entière
            et sans réserve des présentes Conditions Générales d’Utilisation et d’Intervention.
          </p>
        </div>
      ),
      contentEN: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            This website and its associated professional services are published and operated by{' '}
            <strong className="text-slate-900">Cabinet Chia-SN</strong>, a chartered accounting, statutory auditing,
            and corporate tax advisory firm incorporated in the Republic of Cameroon, compliant with OHADA Uniform Acts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Headquarters (Douala)</span>
              <p className="font-semibold text-slate-900 mt-0.5">Bonanjo, Horizon Tower, 3rd Floor</p>
              <p className="text-xs text-slate-600">P.O. Box 1245 Douala, Littoral Region, Cameroon</p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Liaison Office (Yaoundé)</span>
              <p className="font-semibold text-slate-900 mt-0.5">Bastos, Embassy Avenue</p>
              <p className="text-xs text-slate-600">Yaoundé, Centre Region, Cameroon</p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Accreditation</span>
              <p className="font-semibold text-slate-900 mt-0.5">National Order of Chartered Accountants (ONECCA)</p>
              <p className="text-xs text-slate-600">CEMAC Zone Accreditation / SYSCOHADA Framework</p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Tax ID & Contact</span>
              <p className="font-semibold text-slate-900 mt-0.5">TIN : M021500049281Z</p>
              <p className="text-xs text-slate-600">Email: contact@chia-sn.cm | Phone: +237 670 12 34 56</p>
            </div>
          </div>
          <p>
            Browsing this platform and retaining Cabinet Chia-SN for any professional mandate constitutes formal and
            unreserved acceptance of these Terms and Conditions.
          </p>
        </div>
      ),
    },
    {
      id: 'art-2',
      number: 2,
      titleFR: 'Objet, Champ d’Application & Lettre de Mission',
      titleEN: 'Scope of Services & Engagement Letter',
      tagFR: 'Contrat & Périmètre',
      tagEN: 'Contract & Scope',
      summaryFR: 'Définition des missions d’expertise, audit et conseil, et formalisation contractuelle.',
      summaryEN: 'Definition of advisory, bookkeeping, and audit mandates, formal engagement letters.',
      contentFR: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            Les présentes conditions régissent les relations contractuelles entre le Cabinet Chia-SN et toute personne physique ou
            morale (« le Client ») ayant recours à ses services :
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li>
              <strong>Tenue & Révision Comptable :</strong> Saisie, surveillance, établissement des balances, grands livres et comptes
              annuels selon le Système Comptable OHADA (SYSCOHADA Révisé).
            </li>
            <li>
              <strong>Montage de la DSF :</strong> Élaboration, fiabilisation et télédéclaration de la Déclaration Statistique et
              Fiscale annuelle avant l’échéance légale du 15 mars auprès de la DGI.
            </li>
            <li>
              <strong>Conseil Fiscal & Assistance au Contrôle :</strong> Optimisation fiscale légale sous le Code Général des Impôts
              (CGI), audit fiscal préventif, rédaction de réponses aux notifications de redressement, recours gracieux et contentieux.
            </li>
            <li>
              <strong>Audit Légal & Contractuel :</strong> Commissariat aux comptes, audit d’acquisition (Due Diligence), certification
              de sincérité et régularité des comptes.
            </li>
            <li>
              <strong>Secrétariat Juridique & Restructuration :</strong> Rédaction de statuts OHADA, fusions, augmentations de capital,
              formalités au RCCM.
            </li>
          </ul>
          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
            <FileCheck2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <p>
              <strong>Obligation de Lettre de Mission :</strong> Conformément aux normes professionnelles ordonnatrices (ONECCA /
              IFAC), toute mission d’intervention donne obligatoirement lieu à la signature préalable d’une{' '}
              <strong>Lettre de Mission</strong> formalisant les objectifs précis, les livrables attendus, le calendrier et le barème
              d’honoraires.
            </p>
          </div>
        </div>
      ),
      contentEN: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            These terms govern all contractual relationships between Cabinet Chia-SN and any individual or corporate entity (&quot;the
            Client&quot;) engaging our professional services:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li>
              <strong>Bookkeeping & Accounts Revision:</strong> Regular posting, general ledger maintenance, trial balance oversight,
              and annual financial statements under SYSCOHADA Revised.
            </li>
            <li>
              <strong>DSF Production & Filing:</strong> Comprehensive preparation and online filing of the Statistical and Tax Return
              (DSF) prior to the mandatory March 15 deadline at DGI.
            </li>
            <li>
              <strong>Tax Advisory & Audit Defense:</strong> Legal tax optimization under the Cameroon General Tax Code (CGI), preventive
              tax health-checks, response to tax reassessment notices, and contentious claims.
            </li>
            <li>
              <strong>Statutory & Contractual Audits:</strong> Certified statutory audit mandates, transaction due diligence, financial
              statement fairness reviews.
            </li>
            <li>
              <strong>Corporate Legal Restructuring:</strong> Drafting OHADA bylaws, capital reorganizations, merger support, and Trade
              Registry (RCCM) formalities.
            </li>
          </ul>
          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
            <FileCheck2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <p>
              <strong>Mandatory Engagement Letter:</strong> In accordance with ONECCA and IFAC professional standards, every client
              mandate requires an executed bilateral <strong>Engagement Letter</strong> outlining the mission scope, deliverables,
              timelines, and remuneration schedule.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'art-3',
      number: 3,
      titleFR: 'Déontologie, Secret Professionnel & Indépendance',
      titleEN: 'Professional Ethics, Secrecy & Independence',
      tagFR: 'Secret & Confidentialité',
      tagEN: 'Confidentiality & Ethics',
      summaryFR: 'Sanction pénale du secret professionnel (Art. 378 Code Pénal Camerounais) et indépendance d’exercice.',
      summaryEN: 'Criminal sanctions for professional secrecy (Art. 378 Cameroon Penal Code) and absolute independence.',
      contentFR: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            L’exercice de la profession d’expert-comptable et de commissaire aux comptes est soumis aux règles déontologiques
            les plus strictes édictées par l’Ordre National des Experts-Comptables du Cameroun (ONECCA) et l’International Federation
            of Accountants (IFAC).
          </p>
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Lock className="w-4 h-4 text-amber-700" />
              <span>Sanction Légale du Secret Professionnel (Art. 378 du Code Pénal Camerounais)</span>
            </div>
            <p className="leading-relaxed">
              Le Cabinet Chia-SN, ses associés, ses collaborateurs salariés et ses consultants sont tenus au respect absolu du
              secret professionnel le plus rigoureux. Aucune information comptable, financière, commerciale ou stratégique
              recueillie au cours de la mission ne peut être divulguée à des tiers, sauf réquisition expresse de l’autorité judiciaire
              compétente ou dérogation légale impérative.
            </p>
          </div>
          <p>
            <strong>Indépendance & Conflits d’intérêts :</strong> Le Cabinet garantit une totale indépendance intellectuelle et
            morale. Il s’interdit d’accepter toute mission susceptible de placer ses collaborateurs en situation d’auto-révision ou
            de conflit d’intérêts direct ou indirect.
          </p>
        </div>
      ),
      contentEN: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            Chartered accounting and statutory auditing practices are governed by the rigorous ethical codes enforced by the
            National Order of Chartered Accountants of Cameroon (ONECCA) and the International Federation of Accountants (IFAC).
          </p>
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Lock className="w-4 h-4 text-amber-700" />
              <span>Criminal Sanctions for Breach of Secrecy (Article 378 of the Cameroon Penal Code)</span>
            </div>
            <p className="leading-relaxed">
              Cabinet Chia-SN, its partners, permanent staff, and affiliated specialists are bound by absolute professional
              confidentiality. No accounting records, commercial strategies, or tax details obtained during engagements may ever be
              disclosed to unauthorized parties, except upon formal judicial subpoena from a competent court of law.
            </p>
          </div>
          <p>
            <strong>Independence & Conflict of Interest:</strong> The firm guarantees total intellectual and operational independence,
            refusing any mandate that would compromise objectivity, involve self-review, or generate unresolved conflicts of interest.
          </p>
        </div>
      ),
    },
    {
      id: 'art-4',
      number: 4,
      titleFR: 'Obligations & Collaboration Active du Client',
      titleEN: 'Client Obligations & Active Cooperation',
      tagFR: 'Pièces & Délais',
      tagEN: 'Records & Timelines',
      summaryFR: 'Transmission exhaustive et sincère des pièces justificatives et respect strict des échéances déclaratives.',
      summaryEN: 'Exhaustive and authentic submission of accounting evidence, strictly meeting legal deadlines.',
      contentFR: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            La bonne exécution des travaux comptables et fiscaux repose sur une collaboration étroite, loyale et transparente du
            Client :
          </p>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Exhaustivité & Authenticité des pièces :</strong> Le Client s’engage à transmettre toutes les pièces
                justificatives régulières (factures d’achats, ventes, états de paie, extraits bancaires, contrats) sans omission ni
                altération.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Respect impératif des calendriers :</strong> Pour permettre le respect des télédéclarations fiscales mensuelles
                (TVA, acomptes IS avant le 15 du mois suivant) et de la DSF annuelle (15 mars), les documents doivent être remis selon
                le rétro-planning convenu dans la lettre de mission.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Notification des événements majeurs :</strong> Le Client doit informer sans délai le Cabinet de tout litige en
                cours, avis de passage des vérificateurs de la DGI ou de la CNPS, ou changement de situation capitalistique.
              </span>
            </li>
          </ul>
          <p className="text-xs text-slate-500 italic">
            Le Cabinet ne saurait être tenu responsable des pénalités, astreintes ou rejets de déductibilité résultant de la
            transmission tardive, incomplète ou frauduleuse de documents par le Client.
          </p>
        </div>
      ),
      contentEN: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            The accurate execution of accounting, auditing, and tax filings relies entirely on the timely and transparent
            cooperation of the Client:
          </p>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Authenticity of Vouchers:</strong> The Client undertakes to submit genuine, verifiable supporting documents
                (invoices, contracts, payroll registers, bank statements) without alteration or omission.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Strict Timeline Compliance:</strong> To enable timely e-filing of monthly returns (VAT, corporate income tax
                installments by the 15th) and the annual DSF (March 15), source records must be furnished according to the agreed
                schedule.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Immediate Notification:</strong> The Client must immediately notify the firm of any audit notices, tax queries
                from DGI/CNPS inspectors, or major structural corporate changes.
              </span>
            </li>
          </ul>
          <p className="text-xs text-slate-500 italic">
            The firm disclaims all liability for tax late fees, surcharges, or disallowed deductions caused by delayed, falsified, or
            insufficient source documentation provided by the Client.
          </p>
        </div>
      ),
    },
    {
      id: 'art-5',
      number: 5,
      titleFR: 'Honoraires, Facturation & Modalités de Règlement',
      titleEN: 'Fees, Invoicing & Payment Terms',
      tagFR: 'Tarifs & Délais',
      tagEN: 'Pricing & Billing',
      summaryFR: 'Devise en FCFA (XAF), taux de TVA camerounais applicable (19,25%), échéances et pénalités de retard.',
      summaryEN: 'FCFA (XAF) currency, applicable 19.25% Cameroon VAT, payment milestones, and late payment interest.',
      contentFR: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            Les honoraires du Cabinet sont fixés librement en accord avec le Client dans la lettre de mission, selon l’importance de
            la structure, le volume d’écritures et le niveau de qualification des intervenants.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li>
              <strong>Monnaie de règlement :</strong> Tous nos tarifs et factures sont libellés en Francs CFA (XAF). Pour les clients
              étrangers, les règlements peuvent être convertis en Euros ou Dollars US selon le cours légal de la BEAC.
            </li>
            <li>
              <strong>TVA applicable :</strong> Les prestations sont soumises à la Taxe sur la Valeur Ajoutée (TVA) en vigueur en
              République du Cameroun au taux normal de <strong>19,25%</strong> (17,5% principal + 10% CAC), sauf régime d’exonération
              légalement justifié par une attestation DGI.
            </li>
            <li>
              <strong>Modalités de paiement :</strong> Sauf accord particulier, les factures sont payables à réception ou sous trente
              (30) jours par virement bancaire, chèque certifié ou instrument sécurisé.
            </li>
            <li>
              <strong>Pénalités de retard :</strong> Tout retard de paiement entraîne de plein droit, après mise en demeure restée
              infructueuse, l’application d’un intérêt de retard au taux légal en vigueur majoré de 3 points, ainsi que la faculté pour
              le Cabinet de suspendre temporairement ses travaux.
            </li>
          </ul>
        </div>
      ),
      contentEN: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            Fees are determined jointly with the Client inside the engagement letter, reflecting operational complexity, volume of
            transactions, and seniority of deployed specialists.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li>
              <strong>Currency:</strong> All invoices are issued in Central African CFA Francs (XAF). International accounts may settle
              in EUR or USD at prevailing official BEAC exchange rates.
            </li>
            <li>
              <strong>Applicable VAT:</strong> Services are subject to the official Cameroonian Value Added Tax rate of{' '}
              <strong>19.25%</strong> (17.5% base + 10% municipal surcharge), unless an authentic DGI tax exemption certificate is
              provided.
            </li>
            <li>
              <strong>Settlement Terms:</strong> Invoices are payable upon presentation or within thirty (30) calendar days via wire
              transfer, certified draft, or approved digital banking.
            </li>
            <li>
              <strong>Late Payment Interest:</strong> Defaulting on payment terms after formal reminder automatically triggers statutory
              interest charges and empowers the firm to suspend ongoing services until settlement.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'art-6',
      number: 6,
      titleFR: 'Propriété Intellectuelle & Outils Numériques',
      titleEN: 'Intellectual Property & Digital Tools',
      tagFR: 'Droits & Simulateurs',
      tagEN: 'Rights & Software',
      summaryFR: 'Protection des simulateurs fiscaux, notes méthodologiques et interdiction de reproduction non autorisée.',
      summaryEN: 'Protection of tax simulation tools, analytical frameworks, and restricted distribution rights.',
      contentFR: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            L’ensemble des contenus, simulateurs fiscaux interactifs, grilles d’audit, modèles de notes annexes et publications
            édités sur le site <span className="font-semibold text-slate-900">chia-sn.cm</span> constituent la propriété intellectuelle
            exclusive du Cabinet Chia-SN.
          </p>
          <p>
            Le Client bénéficie d’un droit d’utilisation personnel, non exclusif et non transférable des livrables et rapports
            remis dans le cadre strict de l’exécution de la mission convenue. Toute reproduction intégrale ou partielle, revente,
            diffusion publique ou mise à disposition de tiers non autorisés sans notre consentement préalable écrit est formellement
            prohibée et passible de poursuites au titre du droit de la propriété intellectuelle.
          </p>
        </div>
      ),
      contentEN: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            All original articles, tax simulators, accounting audit methodologies, and custom models published on{' '}
            <span className="font-semibold text-slate-900">chia-sn.cm</span> are the exclusive intellectual property of Cabinet
            Chia-SN.
          </p>
          <p>
            Clients receive a non-exclusive, non-transferable license to use final reports and financial deliverable files solely for
            their own internal corporate governance. Any unauthorized reproduction, commercial distribution, or publication is
            strictly prohibited under applicable intellectual property laws.
          </p>
        </div>
      ),
    },
    {
      id: 'art-7',
      number: 7,
      titleFR: 'Protection des Données Personnelles & Cybersécurité',
      titleEN: 'Personal Data Protection & Cybersecurity',
      tagFR: 'Loi n°2010/012 & Confidentialité',
      tagEN: 'Data Privacy & Law n°2010/012',
      summaryFR: 'Conformité à la Loi camerounaise sur la cybersécurité et la cybercriminalité, chiffrement et droits d’accès.',
      summaryEN: 'Compliance with Cameroon Cyberlaw n°2010/012, data encryption, access and rectification rights.',
      contentFR: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            Le Cabinet applique des protocoles rigoureux de sécurité et de confidentialité des données, en conformité avec la{' '}
            <strong className="text-slate-900">Loi n° 2010/012 du 21 décembre 2010</strong> relative à la cybersécurité et la
            cybercriminalité en République du Cameroun.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li>
              <strong>Finalité du traitement :</strong> Les données collectées (noms, e-mails, téléphones, états financiers, données de
              paie) sont strictement traitées pour l’exécution des obligations légales, comptables et déclaratives convenues.
            </li>
            <li>
              <strong>Sauvegarde & Chiffrement :</strong> Toutes les archives numériques bénéficient de sauvegardes déportées et
              sécurisées, avec protocoles de chiffrement de bout en bout conformes aux standards bancaires.
            </li>
            <li>
              <strong>Exercice des droits :</strong> Chaque utilisateur dispose d’un droit d’accès, de rectification et d’effacement de
              ses données de contact en écrivant à : <a href="mailto:contact@chia-sn.cm" className="text-blue-700 font-semibold underline">contact@chia-sn.cm</a>.
            </li>
          </ul>
        </div>
      ),
      contentEN: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            The firm enforces advanced cybersecurity safeguards in full alignment with{' '}
            <strong className="text-slate-900">Cameroon Law n° 2010/012 of December 21, 2010</strong> on Cybersecurity and Cybercrime.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li>
              <strong>Purpose of Processing:</strong> Contact records and financial files are collected exclusively to perform legal
              accounting mandates, tax declarations, and payroll services.
            </li>
            <li>
              <strong>Data Encryption & Backup:</strong> Digital archives are stored in redundant, encrypted repositories with enterprise-grade
              access controls.
            </li>
            <li>
              <strong>User Rights:</strong> You may request access, rectification, or withdrawal of your contact information at any time
              by messaging: <a href="mailto:contact@chia-sn.cm" className="text-blue-700 font-semibold underline">contact@chia-sn.cm</a>.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'art-8',
      number: 8,
      titleFR: 'Limitation de Responsabilité & Assurances',
      titleEN: 'Limitation of Liability & Professional Indemnity',
      tagFR: 'Obligation de Moyens',
      tagEN: 'Standard of Care',
      summaryFR: 'Obligation de moyens qualifiés, souscription d’assurance RCP obligatoire et exclusions de responsabilité.',
      summaryEN: 'Duty of reasonable care, compulsory professional liability insurance, and customary exclusion clauses.',
      contentFR: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            Dans le cadre de ses missions de conseil et d’assistance comptable, le Cabinet Chia-SN est tenu à une{' '}
            <strong className="text-slate-900">obligation de moyens</strong> renforcée, mobilisant les compétences, la diligence et la
            rigueur de professionnels agréés.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-800 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5 text-slate-900">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              Police d’Assurance Responsabilité Civile Professionnelle
            </p>
            <p>
              Le Cabinet est titulaire d’une police d’assurance en Responsabilité Civile Professionnelle (RCP) en cours de validité,
              garantissant les conséquences pécuniaires d’éventuelles erreurs ou omissions professionnelles directes et prouvées.
            </p>
          </div>
          <p>
            La responsabilité du Cabinet ne saurait en aucun cas être engagée en cas de préjudices indirects (perte d’exploitation, gain
            manqué) ou de faits consécutifs à des documents frauduleux, dissimulés ou erronés remis par le Client.
          </p>
        </div>
      ),
      contentEN: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            When performing advisory and accounting engagements, Cabinet Chia-SN is bound by a strict{' '}
            <strong className="text-slate-900">obligation of due diligence and means</strong>, utilizing qualified chartered accountants.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-800 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5 text-slate-900">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              Professional Indemnity Insurance Policy
            </p>
            <p>
              The firm maintains mandatory Professional Civil Liability Insurance covering direct, proven professional errors or
              unintentional omissions up to contractual policy limits.
            </p>
          </div>
          <p>
            Liability is strictly excluded for indirect losses, commercial loss of opportunity, or outcomes arising from fraudulent,
            incomplete, or misleading client representations.
          </p>
        </div>
      ),
    },
    {
      id: 'art-9',
      number: 9,
      titleFR: 'Durée, Suspension & Résiliation de la Mission',
      titleEN: 'Term, Suspension & Termination of Engagement',
      tagFR: 'Préavis & Restitution',
      tagEN: 'Notice & Handover',
      summaryFR: 'Reconduction des mandats récurrents, délais de préavis contractuel et restitution des dossiers comptables.',
      summaryEN: 'Annual renewals for ongoing mandates, formal termination notice, and professional handover.',
      contentFR: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            Les missions récurrentes (tenue comptable continue, conseil permanent) sont généralement conclues pour une période d’un
            exercice social et renouvelables par tacite reconduction, sauf dénonciation écrite respectant le préavis fixé dans la
            lettre de mission (habituellement 3 mois avant la clôture de l’exercice).
          </p>
          <p>
            En cas de résiliation anticipée ou de changement d’expert-comptable, les règles de confraternité de l’Ordre National des
            Experts-Comptables du Cameroun (ONECCA) s’appliquent : les dossiers et pièces sont restitués au confrère successeur après
            apurement intégral de toutes les créances d’honoraires légitimement échues.
          </p>
        </div>
      ),
      contentEN: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            Ongoing engagements (monthly bookkeeping, annual tax support) are concluded on an annual basis, tacitly renewed unless
            terminated in writing with prior notice (customarily 3 months prior to fiscal year-end).
          </p>
          <p>
            Upon termination or transition to a successor practitioner, ONECCA professional handover procedures are observed: records
            are formally transferred upon comprehensive settlement of outstanding fee invoices.
          </p>
        </div>
      ),
    },
    {
      id: 'art-10',
      number: 10,
      titleFR: 'Droit Applicable & Règlement des Litiges',
      titleEN: 'Governing Law & Dispute Resolution',
      tagFR: 'Conciliation ONECCA & Tribunaux',
      tagEN: 'Mediation & Jurisdiction',
      summaryFR: 'Application du Droit OHADA et camerounais, tentative préalable obligatoire de conciliation ordinale.',
      summaryEN: 'Application of OHADA and Cameroon law, mandatory conciliation before the President of ONECCA.',
      contentFR: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            Les présentes Conditions Générales et l’ensemble des relations contractuelles entre les parties sont exclusivement soumises
            au <strong className="text-slate-900">Droit de la République du Cameroun</strong> et aux{' '}
            <strong className="text-slate-900">Actes Uniformes de l’OHADA</strong>.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Scale className="w-4 h-4 text-blue-700" />
              <span>Procédure de Conciliation Ordinale Préalable Obligatoire</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              En cas de contestation sur l’interprétation, l’exécution ou la liquidation des honoraires, les parties s’engagent
              expressément à soumettre leur différend à la conciliation préalable du{' '}
              <strong>Président du Conseil de l’Ordre National des Experts-Comptables du Cameroun (ONECCA)</strong> avant tout recours
              judiciaire.
            </p>
          </div>
          <p>
            À défaut de conciliation amiable dans un délai de soixante (60) jours à compter de la saisine de l’Ordre, tout litige sera
            soumis à la compétence exclusive des <strong className="text-slate-900">Tribunaux compétents de Douala</strong>, même en cas
            d’appel en garantie ou de pluralité de défendeurs.
          </p>
        </div>
      ),
      contentEN: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            These Terms and all contractual relationships are governed exclusively by the{' '}
            <strong className="text-slate-900">Laws of the Republic of Cameroon</strong> and{' '}
            <strong className="text-slate-900">OHADA Uniform Acts</strong>.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Scale className="w-4 h-4 text-blue-700" />
              <span>Mandatory Prior Conciliation by the President of ONECCA</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Prior to initiating any judicial action regarding service execution or fee claims, parties agree to submit their dispute
              to the conciliation of the <strong>President of the National Order of Chartered Accountants of Cameroon (ONECCA)</strong>.
            </p>
          </div>
          <p>
            Should conciliation fail within sixty (60) calendar days from receipt of referral, the dispute shall be referred to the
            exclusive jurisdiction of the <strong className="text-slate-900">competent Commercial Courts of Douala, Cameroon</strong>.
          </p>
        </div>
      ),
    },
    {
      id: 'art-11',
      number: 11,
      titleFR: 'Contact Officiel, Modifications & Entrée en Vigueur',
      titleEN: 'Official Contact, Amendments & Validity',
      tagFR: 'Mises à jour & Support',
      tagEN: 'Updates & Support',
      summaryFR: 'Mises à jour régulières selon les lois de finances et coordonnées des interlocuteurs légaux.',
      summaryEN: 'Regular updates aligning with annual Finance Acts, and legal department contacts.',
      contentFR: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            Le Cabinet Chia-SN se réserve la faculté d’adapter et de mettre à jour les présentes conditions pour tenir compte des
            évolutions législatives, fiscales (Lois de Finances annuelles) et des normes OHADA. Les modifications entrent en vigueur dès
            leur mise en ligne.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-slate-900">Dernière mise à jour :</span> 15 Septembre 2026
            </div>
            <div>
              <span className="font-semibold text-slate-900">Service Juridique & Conformité :</span>{' '}
              <a href="mailto:contact@chia-sn.cm" className="text-blue-700 hover:underline">
                contact@chia-sn.cm
              </a>
            </div>
          </div>
        </div>
      ),
      contentEN: (
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            Cabinet Chia-SN reserves the right to amend these Terms to reflect legislative changes, new annual Finance Acts, or updated
            OHADA standards. Revisions become effective immediately upon digital publication.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-slate-900">Last Revised:</span> September 15, 2026
            </div>
            <div>
              <span className="font-semibold text-slate-900">Legal & Compliance Desk:</span>{' '}
              <a href="mailto:contact@chia-sn.cm" className="text-blue-700 hover:underline">
                contact@chia-sn.cm
              </a>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Filter articles based on search input
  const filteredArticles = useMemo(() => {
    if (!searchTerm.trim()) return articles;
    const term = searchTerm.toLowerCase();
    return articles.filter((art) => {
      const title = currentLang === 'FR' ? art.titleFR : art.titleEN;
      const summary = currentLang === 'FR' ? art.summaryFR : art.summaryEN;
      const tag = currentLang === 'FR' ? art.tagFR : art.tagEN;
      return (
        title.toLowerCase().includes(term) ||
        summary.toLowerCase().includes(term) ||
        tag.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, currentLang]);

  const scrollToArticle = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-6 pb-20">
      {/* Header bar / Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          {/* Breadcrumb + Back Button */}
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <button
              id="terms-back-home-btn"
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#0f4c81] hover:border-blue-300 transition-colors font-medium shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentLang === 'FR' ? "Retour à l'accueil" : 'Back to Home'}</span>
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500 font-medium truncate">
              {currentLang === 'FR' ? 'Conditions Générales & Mentions Légales' : 'Terms & Conditions'}
            </span>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
              title={currentLang === 'FR' ? 'Imprimer ou exporter en PDF' : 'Print or export as PDF'}
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentLang === 'FR' ? 'Imprimer / PDF' : 'Print / PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
              title={currentLang === 'FR' ? 'Copier le lien' : 'Copy link'}
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{currentLang === 'FR' ? 'Lien copié !' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentLang === 'FR' ? 'Partager' : 'Share'}</span>
                </>
              )}
            </button>

            {onToggleLang && (
              <button
                type="button"
                onClick={onToggleLang}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f4c81] text-white hover:bg-[#1d70b8] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span>{currentLang === 'FR' ? 'English Version' : 'Version Française'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Page Title Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-blue-50 rounded-full blur-2xl pointer-events-none" />
          
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0f4c81] text-xs font-bold mb-3">
              <Scale className="w-3.5 h-3.5" />
              <span>
                {currentLang === 'FR'
                  ? 'Cadre Déontologique & Légal • République du Cameroun'
                  : 'Legal & Professional Framework • Republic of Cameroon'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {currentLang === 'FR'
                ? 'Conditions Générales d’Utilisation & d’Intervention'
                : 'Terms of Service & Professional Engagement'}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {currentLang === 'FR'
                ? 'Règles régissant l’utilisation des plateformes du Cabinet Chia-SN ainsi que l’exécution des missions d’expertise comptable, d’audit contractuel et de conseil fiscal en conformité avec les normes ONECCA, le droit OHADA et le Code Général des Impôts (CGI) camerounais.'
                : 'Regulations governing digital usage of Cabinet Chia-SN platforms and the performance of accounting, auditing, and tax advisory engagements under ONECCA standards, OHADA business law, and the Cameroon Tax Code.'}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentLang === 'FR' ? 'Dernière mise à jour : 15 Septembre 2026' : 'Last updated: September 15, 2026'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Douala (Bonanjo) • Yaoundé (Bastos)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentLang === 'FR' ? 'Secret Professionnel Garanti' : 'Strict Professional Secrecy'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Content: Left Table of Contents, Right Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Table of Contents & Quick Search (Desktop Sticky) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            {/* Search within terms */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <label htmlFor="terms-search-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                {currentLang === 'FR' ? 'Filtrer dans les articles' : 'Filter within articles'}
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="terms-search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={currentLang === 'FR' ? 'Ex: secret, honoraires, DSF...' : 'e.g. secrecy, fees, audit...'}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              {searchTerm && (
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {filteredArticles.length} {currentLang === 'FR' ? 'articles correspondants' : 'matching articles'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="text-blue-700 hover:underline cursor-pointer"
                  >
                    {currentLang === 'FR' ? 'Effacer' : 'Clear'}
                  </button>
                </div>
              )}
            </div>

            {/* Table of contents navigation list */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 overflow-hidden">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                {currentLang === 'FR' ? 'Sommaire des Articles' : 'Table of Articles'}
              </h3>
              <nav className="space-y-1 max-h-[460px] overflow-y-auto pr-1">
                {articles.map((art) => {
                  const isActive = activeSection === art.id;
                  const title = currentLang === 'FR' ? art.titleFR : art.titleEN;
                  return (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => scrollToArticle(art.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-[#0f4c81] text-white shadow-xs font-semibold'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span className="truncate">
                        <span className="font-bold mr-1.5">Art. {art.number}</span>
                        {title}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Contact Box */}
            <div className="bg-gradient-to-br from-[#0b3557] to-[#0f4c81] text-white p-5 rounded-xl shadow-xs">
              <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>{currentLang === 'FR' ? 'Service Déontologie & Contrats' : 'Legal & Compliance Desk'}</span>
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed mb-3">
                {currentLang === 'FR'
                  ? 'Pour toute question spécifique sur une lettre de mission ou pour convenir de conditions sur-mesure :'
                  : 'For custom engagement letters or specific compliance queries, reach our legal counsel directly:'}
              </p>
              <div className="space-y-1.5 text-xs text-slate-100">
                <a href="tel:+237670123456" className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>+237 670 12 34 56</span>
                </a>
                <a href="mailto:contact@chia-sn.cm" className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>contact@chia-sn.cm</span>
                </a>
              </div>
              {onNavigateToContact && (
                <button
                  type="button"
                  onClick={onNavigateToContact}
                  className="mt-4 w-full py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  {currentLang === 'FR' ? 'Demander une consultation' : 'Request Consultation'}
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Complete Detailed Legal Articles */}
          <div className="lg:col-span-8 space-y-6">
            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {currentLang === 'FR' ? 'Aucun article ne correspond à votre recherche' : 'No articles match your search'}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  {currentLang === 'FR'
                    ? 'Essayez avec un autre mot-clé ou réinitialisez le filtre.'
                    : 'Try another keyword or reset the filter.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 rounded-lg bg-[#0f4c81] text-white text-xs font-semibold hover:bg-[#1d70b8] transition-colors cursor-pointer"
                >
                  {currentLang === 'FR' ? 'Afficher tous les articles' : 'Show all articles'}
                </button>
              </div>
            ) : (
              filteredArticles.map((art) => {
                const title = currentLang === 'FR' ? art.titleFR : art.titleEN;
                const tag = currentLang === 'FR' ? art.tagFR : art.tagEN;
                const summary = currentLang === 'FR' ? art.summaryFR : art.summaryEN;
                const content = currentLang === 'FR' ? art.contentFR : art.contentEN;

                return (
                  <motion.section
                    key={art.id}
                    id={art.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs scroll-mt-28 transition-all hover:border-slate-300"
                  >
                    {/* Article Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#0f4c81] font-extrabold flex items-center justify-center text-sm border border-blue-200">
                          {art.number}
                        </span>
                        <div>
                          <span className="text-[11px] font-bold tracking-wider uppercase text-blue-700 block">
                            Article {art.number}
                          </span>
                          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                            {title}
                          </h2>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                        {tag}
                      </span>
                    </div>

                    {/* Summary callout */}
                    <div className="mb-4 text-xs font-medium text-slate-500 bg-slate-50/80 px-3.5 py-2 rounded-lg border-l-3 border-[#0f4c81]">
                      {summary}
                    </div>

                    {/* Full Body Content */}
                    <div className="article-body">
                      {content}
                    </div>
                  </motion.section>
                );
              })
            )}

            {/* Bottom Final Legal Disclaimer / Signature Notice */}
            <div className="bg-slate-100 rounded-2xl border border-slate-200 p-6 text-xs text-slate-600 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>
                  {currentLang === 'FR'
                    ? 'Déclaration de Conformité Professionnelle'
                    : 'Statement of Professional Compliance'}
                </span>
              </div>
              <p className="leading-relaxed">
                {currentLang === 'FR'
                  ? 'Le Cabinet Chia-SN atteste de son inscription régulière au tableau de l’Ordre National des Experts-Comptables du Cameroun (ONECCA). Les présentes conditions complètent de plein droit la lettre de mission contresignée par le client et prévalent sur toutes autres conditions générales d’achat émises par les cocontractants.'
                  : 'Cabinet Chia-SN confirms its accredited registration on the official roll of the National Order of Chartered Accountants of Cameroon (ONECCA). These terms complement by operation of law the engagement letter executed with the client and supersede any general purchasing conditions of the contracting party.'}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 text-slate-500">
                <span>Cabinet Chia-SN • Expertise Comptable, Audit & Conseil Fiscal</span>
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="text-[#0f4c81] font-semibold hover:underline cursor-pointer"
                >
                  {currentLang === 'FR' ? "← Revenir à la page d'accueil" : '← Return to Home page'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
