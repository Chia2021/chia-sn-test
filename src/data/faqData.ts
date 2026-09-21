import { Language } from '../types';

export interface FAQItem {
  id: string;
  category: 'dsf' | 'tax' | 'audit' | 'social';
  badge: {
    FR: string;
    EN: string;
  };
  question: {
    FR: string;
    EN: string;
  };
  answer: {
    FR: string;
    EN: string;
  };
  keyTakeaway?: {
    FR: string;
    EN: string;
  };
  reference?: string;
}

export interface FAQCategory {
  id: 'all' | 'dsf' | 'tax' | 'audit' | 'social';
  label: {
    FR: string;
    EN: string;
  };
}

export const faqCategories: FAQCategory[] = [
  {
    id: 'all',
    label: {
      FR: 'Toutes les Questions',
      EN: 'All Questions'
    }
  },
  {
    id: 'dsf',
    label: {
      FR: 'DSF & Clôture Annuelle',
      EN: 'DSF & Year-End Filing'
    }
  },
  {
    id: 'tax',
    label: {
      FR: 'Fiscalité & CGI Cameroun',
      EN: 'Taxation & Cameroon CGI'
    }
  },
  {
    id: 'audit',
    label: {
      FR: 'SYSCOHADA & Audit Légal',
      EN: 'SYSCOHADA & Statutory Audit'
    }
  },
  {
    id: 'social',
    label: {
      FR: 'Paie, DIPE & CNPS',
      EN: 'Payroll, DIPE & Social CNPS'
    }
  }
];

export const faqItems: FAQItem[] = [
  {
    id: 'faq-dsf-deadline',
    category: 'dsf',
    badge: {
      FR: 'Échéance Légale DGI',
      EN: 'Mandatory DGI Deadline'
    },
    question: {
      FR: 'Quelle est la date limite obligatoire pour le dépôt de la DSF au Cameroun et quels sont les risques en cas de retard ?',
      EN: 'What is the mandatory deadline for filing the DSF in Cameroon, and what are the penalties for late submission?'
    },
    answer: {
      FR: "L'échéance légale impérative fixée par le Code Général des Impôts (CGI) pour le dépôt de la Déclaration Statistique et Fiscale (DSF) est le 15 mars de chaque année, pour l'exercice comptable clôturé au 31 décembre précédent. Le dépôt s'effectue obligatoirement en ligne via la plateforme de télédéclaration de la DGI.",
      EN: "The statutory deadline mandated by Cameroon's General Tax Code (CGI) for submitting the Annual Statistical and Tax Declaration (DSF) is strictly March 15th of each year, for the fiscal year closed on the preceding December 31st. Submissions must be executed digitally through the DGI e-filing portal."
    },
    keyTakeaway: {
      FR: "Risques en cas de non-respect : amende forfaitaire pouvant atteindre 5 000 000 FCFA, pénalités de 10% à 100% sur les droits compromis, suspension immédiate de l'Attestation de Non-Redevance (ANR) et blocage douanier/bancaire.",
      EN: "Consequences of late filing: statutory fines up to 5,000,000 FCFA, surcharges ranging from 10% to 100%, suspension of the Tax Clearance Certificate (ANR), and operational freezes on customs and banking accounts."
    },
    reference: 'Art. 18 et L.1 du Code Général des Impôts'
  },
  {
    id: 'faq-tax-regimes',
    category: 'tax',
    badge: {
      FR: 'Régimes Fiscaux',
      EN: 'Tax Classification'
    },
    question: {
      FR: "Quels sont les régimes d'imposition en vigueur au Cameroun et comment déterminer celui de mon entreprise ?",
      EN: 'What tax regimes exist in Cameroon and how do I determine which one applies to my company?'
    },
    answer: {
      FR: "Le système fiscal camerounais classe les contribuables selon leur Chiffre d'Affaires (CA) annuel hors taxes dans trois régimes principaux :\n\n1. Régime de l'Impôt Libératoire : CA annuel inférieur à 10 millions FCFA (micro-activités et petits commerçants).\n2. Régime Simplifié : CA annuel compris entre 10 millions et 50 millions FCFA (comptabilité allégée Système Minimal de Trésorerie SMT).\n3. Régime du Réel : CA annuel égal ou supérieur à 50 millions FCFA. Ce régime impose la facturation de la TVA (19,25%), la tenue d'une comptabilité complète selon le Système Normal SYSCOHADA, et le rattachement aux CIME (Centres des Impôts des Moyennes Entreprises) ou à la DGE pour les CA supérieurs à 3 milliards FCFA.",
      EN: "Cameroon's tax system classifies enterprises based on their annual turnover (excluding VAT) into three core categories:\n\n1. Discharge Tax Regime (Impôt Libératoire): Annual revenue below 10M FCFA.\n2. Simplified Regime: Annual revenue between 10M and 50M FCFA (simplified cash accounting SMT).\n3. Actual Assessment Regime (Régime du Réel): Annual revenue of 50M FCFA or more. This obligates VAT collection (19.25%), comprehensive SYSCOHADA accrual accounting, and direct management by Specialized Mid-Sized Tax Centers (CIME) or the Large Taxpayer Directorate (DGE) for turnover over 3 billion FCFA."
    },
    keyTakeaway: {
      FR: "Conseil Chia-SN : franchir le seuil des 50 millions FCFA exige une transition comptable immédiate pour sécuriser la déductibilité de vos charges et de votre crédit de TVA.",
      EN: "Chia-SN Advisory: Crossing the 50M FCFA threshold requires immediate accounting adaptation to preserve expense deductibility and VAT input credits."
    },
    reference: 'Art. 93 et suivants du Code Général des Impôts'
  },
  {
    id: 'faq-statutory-audit',
    category: 'audit',
    badge: {
      FR: 'Droit OHADA & Audit',
      EN: 'OHADA Law & Audit'
    },
    question: {
      FR: "Quand la désignation d'un Commissaire aux Comptes (CAC) devient-elle obligatoire au Cameroun ?",
      EN: 'When is appointing a Statutory Auditor (Commissaire aux Comptes) mandatory in Cameroon?'
    },
    answer: {
      FR: "Conformément à l'Acte Uniforme OHADA relatif au droit des sociétés commerciales et du GIE :\n\n• Pour les Sociétés Anonymes (SA) et SAS : la désignation d'au moins un Commissaire aux Comptes titulaire et un suppléant est obligatoire dès la constitution, quel que soit le capital ou le chiffre d'affaires.\n• Pour les Sociétés à Responsabilité Limitée (SARL) : la nomination d'un CAC devient obligatoire si la société franchit à la clôture de l'exercice au moins deux des trois seuils suivants :\n  - Total du bilan supérieur à 125 000 000 FCFA,\n  - Chiffre d'affaires annuel supérieur à 250 000 000 FCFA,\n  - Effectif permanent supérieur à 50 collaborateurs.",
      EN: "In accordance with the OHADA Uniform Act on Commercial Companies and Corporate Groups:\n\n• For Public Limited Companies (SA) and SAS: Appointing at least one primary statutory auditor and one deputy is mandatory from incorporation, regardless of capital or revenue.\n• For Private Limited Companies (SARL): Appointing a certified auditor is required if the firm exceeds at least two of the following three criteria at fiscal close:\n  - Balance sheet total over 125,000,000 FCFA,\n  - Annual turnover exceeding 250,000,000 FCFA,\n  - Permanent workforce over 50 employees."
    },
    keyTakeaway: {
      FR: "Les experts-comptables de Chia-SN sont inscrits au tableau de l'ONECCA et habilités à certifier les comptes annuels et rédiger le rapport général et spécial.",
      EN: "Chia-SN partners are chartered with ONECCA and certified to audit statutory financial statements and deliver official audit opinions."
    },
    reference: 'Acte Uniforme OHADA Révisé, Art. 376 & 702'
  },
  {
    id: 'faq-corporate-tax-rates',
    category: 'tax',
    badge: {
      FR: 'Taux IS & Acomptes',
      EN: 'CIT Rates & Prepayments'
    },
    question: {
      FR: "Quels sont les taux de l'Impôt sur les Sociétés (IS) et comment s'articulent les acomptes mensuels ?",
      EN: 'What are Cameroon corporate income tax rates and how do monthly advance payments function?'
    },
    answer: {
      FR: "Au Cameroun, l'Impôt sur les Sociétés (IS) comporte un taux de base majoré de 10% au titre des Centimes Additionnels Communaux (CAC) :\n\n• Taux standard : 28% + 10% CAC = 30,8% pour les grandes entreprises.\n• Taux préférentiel PME : 25% + 10% CAC = 27,5% pour les entreprises dont le chiffre d'affaires annuel est inférieur à 3 milliards FCFA.\n\nAcomptes mensuels d'IS : chaque mois au plus tard le 15, les entreprises soumises au réel versent un acompte assis sur le CA hors taxes réalisé le mois précédent. Le taux est généralement de 2,2% (2% + 10% CAC). Cet acompte constitue un crédit d'impôt imputable sur l'IS définitif calculé lors de la DSF.",
      EN: "Corporate Income Tax (IS) in Cameroon combines the base tax rate with an additional 10% municipal surcharge (CAC):\n\n• Standard Rate: 28% + 10% CAC = 30.8% effective rate for large enterprises.\n• Preferential SME Rate: 25% + 10% CAC = 27.5% for companies with annual revenue under 3 billion FCFA.\n\nMonthly Advance Payments: On or before the 15th of each month, enterprises pay a monthly advance calculated on the prior month's gross turnover, generally 2.2% (2% + 10% CAC). These advances represent tax credits deducted from total corporate tax due upon filing the annual DSF."
    },
    keyTakeaway: {
      FR: "Si le montant cumulé des acomptes mensuels excède l'IS dû à la clôture, l'excédent constitue un crédit d'impôt reportable sur les exercices suivants.",
      EN: "If accumulated monthly installments exceed the calculated corporate tax liability at fiscal year-end, the excess constitutes a tax credit carried forward to future periods."
    },
    reference: 'Art. 17 et 21 du Code Général des Impôts'
  },
  {
    id: 'faq-syscohada-statements',
    category: 'audit',
    badge: {
      FR: 'Normes Comptables',
      EN: 'Accounting Standards'
    },
    question: {
      FR: 'Quels sont les 4 états financiers indissociables exigés par le SYSCOHADA Révisé ?',
      EN: 'What are the 4 mandatory financial statements required under Revised SYSCOHADA?'
    },
    answer: {
      FR: "Le Système Normal du SYSCOHADA Révisé impose la production conjointe et cohérente de 4 documents certifiés :\n\n1. Le Bilan : photographie du patrimoine (actif immobilisé, circulant, trésorerie-actif vs capitaux propres, dettes financières, passif circulant).\n2. Le Compte de Résultat : analyse des charges et produits par nature distinguant l'activité d'exploitation, financière et hors activités ordinaires (HAO).\n3. Le Tableau des Flux de Trésorerie (TFT) : remplaçant l'ancien TAFIRE, il retrace l'origine et l'emploi des liquidités selon 3 cycles (exploitation, investissement, financement).\n4. Les Notes Annexes (Notes 1 à 36) : commentaires chiffrés indispensables sur les méthodes d'évaluation, les amortissements, les créances et les engagements hors bilan.",
      EN: "The Normal System under Revised SYSCOHADA mandates the unified preparation of 4 interconnected financial schedules:\n\n1. Balance Sheet: Asset and liability position categorizing fixed assets, working capital, and net equity.\n2. Income Statement: Structured revenue and expense classification delineating operating, financial, and extraordinary (HAO) segments.\n3. Statement of Cash Flows: Depicting liquidity movements across operational activities, capital investments, and financing structures.\n4. Disclosures & Notes (Notes 1 to 36): Analytical breakdowns detailing depreciation schedules, provisions, inventory metrics, and off-balance sheet commitments."
    },
    keyTakeaway: {
      FR: 'Une omission ou incohérence entre les 36 notes annexes et le bilan entraîne le rejet automatique de la télédéclaration DSF par le serveur DGI.',
      EN: 'A discrepancy between the 36 disclosure notes and the main financial statements triggers automatic rejection by the DGI electronic filing validation engine.'
    },
    reference: 'Acte Uniforme OHADA portant organisation et harmonisation des comptabilités'
  },
  {
    id: 'faq-cnps-dipe',
    category: 'social',
    badge: {
      FR: 'Charges Sociales',
      EN: 'Payroll & Social Security'
    },
    question: {
      FR: 'Comment fonctionnent les cotisations sociales CNPS et le dépôt mensuel du DIPE au Cameroun ?',
      EN: 'How are CNPS social contributions calculated and how does monthly DIPE filing work?'
    },
    answer: {
      FR: "Toute entreprise employant des salariés au Cameroun doit s'immatriculer à la Caisse Nationale de Prévoyance Sociale (CNPS) et télédéclarer mensuellement le DIPE (Document d'Information sur le Personnel Employé) avant le 15 du mois suivant :\n\n• Prestations Familiales : 7% du salaire brut, à la charge exclusive de l'employeur.\n• Accidents du Travail et Maladies Professionnelles : 1,75% (risque faible), 2,5% (risque moyen), ou 5% (risque élevé), à la charge exclusive de l'employeur.\n• Assurance Pension (Vieillesse, Invalidité, Décès) : 8,4% assis sur les salaires plafonnés à 750 000 FCFA/mois par salarié (4,2% part patronale + 4,2% retenue salariale).",
      EN: "Any enterprise with employees in Cameroon must register with the National Social Insurance Fund (CNPS) and submit the monthly DIPE report before the 15th of the following month:\n\n• Family Allowances: 7% of gross payroll, borne entirely by the employer.\n• Industrial Accidents & Work-Related Diseases: 1.75% (low risk), 2.5% (medium), or 5% (high), paid exclusively by the employer.\n• Old Age, Disability & Death Pension: 8.4% capped at 750,000 FCFA per month per employee (4.2% employer contribution + 4.2% employee wage deduction)."
    },
    keyTakeaway: {
      FR: "Le défaut de versement ou le retard entraîne des pénalités CNPS de 10% le premier mois, majorées de 3% par mois supplémentaire.",
      EN: "Late payment triggers an initial 10% penalty plus a 3% monthly surcharge for each subsequent delayed period."
    },
    reference: 'Code de Sécurité Sociale du Cameroun'
  },
  {
    id: 'faq-tax-audit-defense',
    category: 'tax',
    badge: {
      FR: 'Contrôle & Contentieux',
      EN: 'Tax Defense & Audit'
    },
    question: {
      FR: 'Que faire en cas de réception d’un avis de vérification ou d’une notification de redressement fiscal ?',
      EN: 'What steps should you take upon receiving a tax audit notice or reassessment from the tax office?'
    },
    answer: {
      FR: "En cas de notification de redressement (consécutif à un contrôle ponctuel ou général), vous disposez d'un délai légal strict de 30 jours à compter de la réception pour formuler vos observations motivées (Livre des Procédures Fiscales).\n\nDémarche recommandée avec le cabinet Chia-SN :\n1. Analyse immédiate des chefs de redressement et confrontation avec les pièces comptables justificatives.\n2. Vérification de la régularité formelle de la procédure menée par les inspecteurs des impôts.\n3. Rédaction d'une réponse contradictoire rigoureuse et chiffrée article par article.\n4. Assistance physique lors des séances contradictoires en brigade ou négociations hiérarchiques.",
      EN: "Upon receipt of a tax reassessment notification, the taxpayer has a strict statutory window of 30 days to respond in writing with legal and factual defenses (Tax Procedures Book).\n\nRecommended procedure with Chia-SN:\n1. Immediate forensic review of each reassessment item matched against accounting ledgers.\n2. Verification of procedural regularity and observance of taxpayer rights by tax auditors.\n3. Drafting of an exhaustive, evidence-backed rebuttal brief referencing relevant CGI provisions.\n4. Direct in-person representation during contradictor discussions and hierarchical appeals."
    },
    keyTakeaway: {
      FR: 'Important : ne jamais laisser s’écouler le délai de 30 jours sans réponse formelle, car le silence vaut acquiescement et rend la taxation d’office immédiatement exigible.',
      EN: 'Vital note: Never let the 30-day period lapse without an official rebuttal; silence is interpreted as acceptance, making reassessments immediately enforceable.'
    },
    reference: 'Livre des Procédures Fiscales du Cameroun, Art. L.23 et suivants'
  },
  {
    id: 'faq-withholding-tsr',
    category: 'tax',
    badge: {
      FR: 'Fiscalité Internationale',
      EN: 'International Taxation'
    },
    question: {
      FR: 'Comment s’applique la Taxe Spéciale sur le Revenu (TSR) sur les prestations étrangères ?',
      EN: 'How does Special Tax on Income (TSR) apply to foreign service provider invoices?'
    },
    answer: {
      FR: "La Taxe Spéciale sur le Revenu (TSR) frappe les rémunérations de prestations intellectuelles, d'assistance technique, de licences logicielles et de redevances versées par une entreprise résidente au Cameroun à un prestataire non établi au Cameroun.\n\nLe taux de droit commun est de 15% opéré en retenue à la source au moment du règlement. Ce taux peut être réduit à 7,5% ou neutralisé si le pays du prestataire est signataire d'une convention fiscale bilatérale de non-double imposition avec le Cameroun (notamment la Convention France-Cameroun ou les accords CEMAC).",
      EN: "The Special Tax on Income (TSR) levies payments for intellectual services, software subscriptions, technical support, and royalties disbursed by a Cameroon resident company to a non-resident vendor.\n\nThe statutory withholding rate is 15% deducted at source upon payment. This rate may be lowered to 7.5% or eliminated under applicable bilateral Double Taxation Treaties (e.g., France-Cameroon tax treaty or CEMAC agreements)."
    },
    keyTakeaway: {
      FR: "L'application d'un taux réduit nécessite impérativement la présentation d'une attestation de résidence fiscale visée par l'administration du pays cocontractant.",
      EN: "Applying treaty-reduced withholding tax rates strictly requires producing a certified certificate of tax residence from the foreign vendor's home jurisdiction."
    },
    reference: 'Art. 225 et suivants du Code Général des Impôts'
  }
];
