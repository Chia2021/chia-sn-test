import { SearchItem } from '../types';

export const searchIndexData: SearchItem[] = [
  // SERVICES
  {
    id: 'search-service-bookkeeping',
    category: 'services',
    title: {
      FR: 'Tenue de Comptabilité & Paie',
      EN: 'Bookkeeping & Records'
    },
    description: {
      FR: 'Saisie journalière des pièces comptables, rapprochements bancaires, paie et déclarations CNPS/DIPE sous le plan comptable SYSCOHADA.',
      EN: 'Daily accounting entry management, bank reconciliations, payroll slips, and CNPS/DIPE compliance under SYSCOHADA.'
    },
    badge: {
      FR: 'Service Régulier',
      EN: 'Ongoing Retainer'
    },
    tags: [
      'comptabilite', 'bookkeeping', 'paie', 'payroll', 'salaires', 'bulletins', 'cnps', 'dipe',
      'rapprochement', 'pieces', 'journal', 'grand livre', 'syscohada', 'charges', 'factures'
    ],
    targetSection: '#services',
    serviceId: 'bookkeeping',
    actionType: 'open-service'
  },
  {
    id: 'search-service-dsf',
    category: 'services',
    title: {
      FR: 'Montage & Télédéclaration de la DSF',
      EN: 'DSF Filing Production'
    },
    description: {
      FR: 'Établissement du bilan, compte de résultat, TAFIRE, rédaction des 36 notes annexes et télédéclaration DGI avant le 15 mars.',
      EN: 'Annual statistical & tax declaration compilation, balance sheet, 36 financial notes, and e-filing to DGI by March 15 deadline.'
    },
    badge: {
      FR: 'Échéance 15 Mars',
      EN: 'Deadline March 15'
    },
    tags: [
      'dsf', 'declaration statistique et fiscale', 'bilan', 'compte de resultat', 'tafire',
      '36 notes annexes', 'impots', 'dgi', 'teledeclaration', 'liasse fiscale', 'cloture', '15 mars',
      'centre des impots', 'cime', 'dge'
    ],
    targetSection: '#services',
    serviceId: 'dsf',
    actionType: 'open-service'
  },
  {
    id: 'search-service-tax',
    category: 'services',
    title: {
      FR: 'Conseil Juridique & Fiscal',
      EN: 'Legal & Tax Advisory'
    },
    description: {
      FR: 'Audit préventif fiscal, réponses aux redressements, optimisation TVA/IS et structuration conforme au Code Général des Impôts (CGI).',
      EN: 'Pre-emptive tax diagnostic audits, tax inspection defense, VAT/IS optimization, and structuring compliant with Cameroon Tax Code.'
    },
    badge: {
      FR: 'Protection Fiscale',
      EN: 'Tax Shield'
    },
    tags: [
      'fiscalite', 'tax', 'impots', 'cgi', 'code general des impots', 'redressement', 'controle fiscal',
      'notification', 'loi de finances', 'tva', 'is', 'precompte', 'acomptes', 'litiges', 'avocat'
    ],
    targetSection: '#services',
    serviceId: 'tax',
    actionType: 'open-service'
  },
  {
    id: 'search-service-audit',
    category: 'services',
    title: {
      FR: 'Audit & Restructuration d’Entreprise',
      EN: 'Audit & Corporate Restructuring'
    },
    description: {
      FR: 'Commissariat aux comptes, revue des contrôles internes, diagnostics de rentabilité et plans de redressement pour dirigeants.',
      EN: 'Statutory audit, internal controls review, cost center profitability assessment, and turnaround liquidity planning.'
    },
    badge: {
      FR: 'Gouvernance',
      EN: 'Governance'
    },
    tags: [
      'audit', 'commissariat', 'cac', 'restructuration', 'controle interne', 'rentabilite',
      'fusion', 'tresorerie', 'diagnostic', 'gouvernance', 'processus'
    ],
    targetSection: '#services',
    serviceId: 'audit',
    actionType: 'open-service'
  },

  // COMPLIANCE & REGULATORY FRAMEWORKS
  {
    id: 'search-comp-ohada',
    category: 'compliance',
    title: {
      FR: 'SYSCOHADA Révisé (Traité OHADA)',
      EN: 'SYSCOHADA Revised (OHADA Treaty)'
    },
    description: {
      FR: 'Tenue des comptes et production des états financiers selon les règles uniformes OHADA obligatoires dans les 17 États membres de la zone CEMAC.',
      EN: 'Accounting records and financial statements strictly compliant with OHADA uniform standards mandatory across all 17 CEMAC member states.'
    },
    badge: {
      FR: 'Norme Régionale',
      EN: 'Regional Standard'
    },
    tags: [
      'ohada', 'syscohada', 'norme', 'reglementation', 'cemac', 'plan comptable', 'etats financiers',
      'consolidation', 'uniforme', 'afrique centrale'
    ],
    targetSection: '#compliance',
    actionType: 'scroll-section'
  },
  {
    id: 'search-comp-dgi',
    category: 'compliance',
    title: {
      FR: 'Télédéclaration DGI & Échéance 15 Mars',
      EN: 'DGI E-filing & March 15 Deadline'
    },
    description: {
      FR: 'Dépôt obligatoire de la DSF au Centre des Impôts compétent (DGE, CIME, CSI) avant le 15 mars pour éviter les pénalités d’office de 10% à 25%.',
      EN: 'Mandatory filing of the annual DSF on the tax administration portal by March 15 to avoid late submission penalties of 10% to 25%.'
    },
    badge: {
      FR: 'Échéance Fiscale',
      EN: 'Tax Deadline'
    },
    tags: [
      'dgi', 'teledeclaration', '15 mars', 'echeance', 'penalites', 'retard', 'centre des impots',
      'cime', 'dge', 'csi', 'direction generale des impots'
    ],
    targetSection: '#compliance',
    actionType: 'scroll-section'
  },
  {
    id: 'search-comp-cgi',
    category: 'compliance',
    title: {
      FR: 'Code Général des Impôts (CGI) & Loi de Finances',
      EN: 'Cameroon Tax Code (CGI) & Finance Law'
    },
    description: {
      FR: 'Sécurisation juridique des déductions de charges, retenues à la source, précomptes sur achats et conformité annuelle à la Loi de Finances.',
      EN: 'Legal validation of expense deductions, withholding taxes, purchase deductions, and year-to-year Finance Law alignment.'
    },
    badge: {
      FR: 'Droit Fiscal',
      EN: 'Tax Law'
    },
    tags: [
      'cgi', 'code general des impots', 'loi de finances', 'deduction', 'charges', 'retenue',
      'source', 'precompte', 'achat', 'securite fiscale'
    ],
    targetSection: '#compliance',
    actionType: 'scroll-section'
  },
  {
    id: 'search-comp-cnps',
    category: 'compliance',
    title: {
      FR: 'Obligations Sociales CNPS & Télédéclaration DIPE',
      EN: 'CNPS Social Security & DIPE Electronic Upload'
    },
    description: {
      FR: 'Calcul rigoureux des cotisations sociales patronales/salariales et téléversement mensuel du Document d’Information sur le Personnel Employé (DIPE).',
      EN: 'Accurate payroll social contribution calculations and mandatory monthly electronic submission of employee declarations (DIPE).'
    },
    badge: {
      FR: 'Conformité Sociale',
      EN: 'Social Security'
    },
    tags: [
      'cnps', 'dipe', 'social', 'cotisations', 'salaries', 'caisse nationale', 'prevoyance',
      'retraite', 'bulletins', 'personnel', 'declaration sociale'
    ],
    targetSection: '#compliance',
    actionType: 'scroll-section'
  },
  {
    id: 'search-faq-general',
    category: 'compliance',
    title: {
      FR: 'Foire Aux Questions (FAQ) - Fiscalité & Comptabilité Cameroun',
      EN: 'Frequently Asked Questions (FAQ) - Cameroon Accounting & Tax'
    },
    description: {
      FR: 'Réponses détaillées sur les délais DSF (15 mars), régimes d’imposition (Réel vs Simplifié), nomination d’un Commissaire aux Comptes et contrôle fiscal.',
      EN: 'Detailed answers regarding DSF deadlines (March 15), tax regimes, statutory auditor mandates under OHADA, and DGI tax audit defense.'
    },
    badge: {
      FR: 'FAQ Réglementation',
      EN: 'Regulatory FAQ'
    },
    tags: [
      'faq', 'questions', 'reponses', 'fiscalite', 'dgi', 'dsf', '15 mars', 'commissaire aux comptes',
      'cac', 'ohada', 'syscohada', 'cnps', 'dipe', 'controle fiscal', 'impot societes', 'is', 'acompte'
    ],
    targetSection: '#faq',
    actionType: 'scroll-section'
  },

  // OFFICES & CONTACT
  {
    id: 'search-loc-douala',
    category: 'locations',
    title: {
      FR: 'Douala - Siège Opérationnel (Bonanjo)',
      EN: 'Douala - Operational Headquarters (Bonanjo)'
    },
    description: {
      FR: 'Boulevard de la Liberté, Immeuble Horizon, Bonanjo. Téléphone: +237 670 12 34 56. Ouvert du lundi au vendredi 8h00 - 17h30.',
      EN: 'Boulevard de la Liberté, Immeuble Horizon, Bonanjo. Phone: +237 670 12 34 56. Open Monday to Friday 8:00 AM - 5:30 PM.'
    },
    badge: {
      FR: 'Siège Principal',
      EN: 'Headquarters'
    },
    tags: [
      'douala', 'bonanjo', 'siege', 'immeuble horizon', 'boulevard de la liberte', 'littoral', 'bureau douala',
      'adresse douala', 'telephone douala', 'contact'
    ],
    targetSection: '#contact',
    actionType: 'scroll-section'
  },
  {
    id: 'search-loc-yaounde',
    category: 'locations',
    title: {
      FR: 'Yaoundé - Antenne Régionale (Bastos)',
      EN: 'Yaoundé - Regional Office (Bastos)'
    },
    description: {
      FR: 'Avenue Rosa Parks, Quartier Bastos, Yaoundé. Proximité institutions ministérielles et Direction Générale des Impôts (DGI).',
      EN: 'Rosa Parks Avenue, Bastos District, Yaoundé. Close proximity to government ministries and the General Tax Directorate (DGI).'
    },
    badge: {
      FR: 'Antenne Régionale',
      EN: 'Regional Office'
    },
    tags: [
      'yaounde', 'bastos', 'rosa parks', 'antenne', 'centre', 'bureau yaounde', 'adresse yaounde',
      'contact yaounde', 'ministere'
    ],
    targetSection: '#contact',
    actionType: 'scroll-section'
  },
  {
    id: 'search-loc-consultation',
    category: 'locations',
    title: {
      FR: 'Demande de Consultation & Diagnostic Fiscal Gratuit',
      EN: 'Request Free Consultation & Preliminary Diagnostic'
    },
    description: {
      FR: 'Formulaire de prise de contact direct pour planifier un rendez-vous avec l’un de nos experts-comptables certifiés.',
      EN: 'Direct contact scheduling form to meet with one of our chartered accounting partners.'
    },
    badge: {
      FR: 'Consultation Offerte',
      EN: 'Free Consultation'
    },
    tags: [
      'consultation', 'devis', 'rdv', 'rendez-vous', 'formulaire', 'contactez-nous', 'audit preliminaire',
      'diagnostic gratuit'
    ],
    targetSection: '#contact',
    actionType: 'scroll-section'
  },

  // CLIENT TESTIMONIALS & CASE STUDIES
  {
    id: 'search-testi-dsf',
    category: 'testimonials',
    title: {
      FR: 'Cameroun Transit & Logistique (CTL) - 0 FCFA Pénalités DSF',
      EN: 'Cameroun Transit & Logistics (CTL) - 0 Late DSF Penalties'
    },
    description: {
      FR: 'Télédéclaration systématique de la DSF bien avant le 15 mars. Zéro pénalité et zéro redressement sur 4 exercices comptables consécutifs.',
      EN: 'Timely annual DSF filing well before the March 15 deadline. Zero penalties and zero reassessments across 4 consecutive years.'
    },
    badge: {
      FR: 'Logistique Portuaire',
      EN: 'Port Logistics'
    },
    tags: [
      'ctl', 'transit', 'logistique', 'port', 'douala', 'amadou bello', 'penalites', 'dsf'
    ],
    targetSection: '#testimonials',
    actionType: 'scroll-section'
  },
  {
    id: 'search-testi-syscohada',
    category: 'testimonials',
    title: {
      FR: 'Groupe Agro-Pastoral des Plateaux - Conformité SYSCOHADA 3 Entités',
      EN: 'Plateaux Agro-Pastoral Group - SYSCOHADA Alignment (3 Entities)'
    },
    description: {
      FR: 'Mise en conformité SYSCOHADA Révisé de 3 filiales, formation des équipes comptables et fiabilisation des reportings bancaires.',
      EN: 'SYSCOHADA standards alignment across 3 subsidiaries, accounting team upskilling, and bank-grade consolidated reporting.'
    },
    badge: {
      FR: 'Agro-industrie',
      EN: 'Agribusiness'
    },
    tags: [
      'agro-industrie', 'agriculture', 'export', 'plateaux', 'madeleine eboa', 'bafoussam', 'banque'
    ],
    targetSection: '#testimonials',
    actionType: 'scroll-section'
  },
  {
    id: 'search-testi-tax',
    category: 'testimonials',
    title: {
      FR: 'AfriTech Solutions SARL - Allègement -75% Contrôle Fiscal',
      EN: 'AfriTech Solutions - 75% Tax Adjustment Reduction'
    },
    description: {
      FR: 'Défense juridique et comptable face à un contrôle fiscal approfondi de la DGI. Réduction de 75% du redressement notifié.',
      EN: 'Legal and financial defense during an extensive state tax audit, successfully mitigating 75% of disputed adjustments.'
    },
    badge: {
      FR: 'Services Numériques',
      EN: 'Digital Services'
    },
    tags: [
      'afritech', 'informatique', 'numerique', 'patrick nguemo', 'controle fiscal', 'defense', 'dgi'
    ],
    targetSection: '#testimonials',
    actionType: 'scroll-section'
  },
  {
    id: 'search-compliance-terms',
    category: 'compliance',
    title: {
      FR: 'Conditions Générales & Mentions Légales',
      EN: 'Terms & Conditions / Legal Notice'
    },
    description: {
      FR: 'Cadre déontologique ONECCA, secret professionnel (Art. 378 Code Pénal), honoraires en FCFA, et protection des données.',
      EN: 'ONECCA ethical rules, professional secrecy (Penal Code Art. 378), billing terms in FCFA, and privacy policies.'
    },
    badge: {
      FR: 'Juridique & Déontologie',
      EN: 'Legal & Ethics'
    },
    tags: [
      'termes', 'conditions', 'cgu', 'mentions legales', 'terms', 'deontologie', 'secret professionnel',
      'loi', 'penal', 'honoraires', 'litiges', 'onecca', 'onecca cameroun', 'droit ohada', 'reglement'
    ],
    targetSection: '#terms',
    actionType: 'scroll-section'
  }
];

export const popularSearchQueries = [
  { label: 'DSF 15 Mars', query: 'DSF' },
  { label: 'SYSCOHADA Révisé', query: 'SYSCOHADA' },
  { label: 'Contrôle Fiscal & DGI', query: 'Fiscal' },
  { label: 'Gestion Paie & CNPS', query: 'Paie' },
  { label: 'Conditions Générales', query: 'Conditions' },
  { label: 'Audit & Commissariat', query: 'Audit' },
  { label: 'Siège Douala Bonanjo', query: 'Douala' },
];
