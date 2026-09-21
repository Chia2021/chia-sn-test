import { CarouselSlide, OfficeLocation, ServiceItem, TestimonialItem } from '../types';

export const servicesData: ServiceItem[] = [
  {
    id: 'bookkeeping',
    iconName: 'calculator',
    badge: {
      FR: 'Opérations Continues',
      EN: 'Ongoing Operations'
    },
    title: {
      FR: 'Tenue de Comptabilité & Paie',
      EN: 'Bookkeeping & Records'
    },
    description: {
      FR: 'Gestion externalisée complète de vos écritures comptables quotidiennes en stricte conformité avec le plan comptable général SYSCOHADA.',
      EN: 'Full outsourced management of daily accounting entries and transactions strictly following the SYSCOHADA general charter.'
    },
    deliverables: {
      FR: [
        'Saisie journalière et mensuelle des pièces comptables',
        'Rapprochements bancaires et lettrage des comptes tiers',
        'Gestion des bulletins de paie et télédéclarations CNPS / DIPE',
        'Tableaux de bord financiers périodiques pour la direction'
      ],
      EN: [
        'Daily and monthly ledger transaction reconciliation',
        'Bank reconciliations and accounts payable/receivable matching',
        'Payroll slips production and mandatory CNPS / DIPE filing',
        'Periodic financial executive dashboards for management'
      ]
    }
  },
  {
    id: 'dsf',
    iconName: 'file-spreadsheet',
    badge: {
      FR: 'Échéance 15 Mars',
      EN: 'Deadline March 15'
    },
    title: {
      FR: 'Montage & Télédéclaration de la DSF',
      EN: 'DSF Filing Production'
    },
    description: {
      FR: 'Préparation, fiabilisation et optimisation de votre Déclaration Statistique et Fiscale annuelle pour le Centre Spécialisé des Impôts.',
      EN: 'Comprehensive compilation, reconciliation, and e-filing of your annual Statistical and Tax Declaration for the tax administration.'
    },
    deliverables: {
      FR: [
        'Établissement du bilan, compte de résultat et tableau des flux (TAFIRE)',
        'Rédaction complète des 36 notes annexes réglementaires',
        'Validation par expert-comptable certifié avant transmission',
        'Téléversement dématérialisé sur le portail DGI sans incident'
      ],
      EN: [
        'Preparation of balance sheet, income statement & cash flow statements',
        'Drafting of all 36 mandatory regulatory financial disclosure notes',
        'Pre-submission validation by chartered accounting partners',
        'Direct electronic transmission to Cameroon tax portals'
      ]
    }
  },
  {
    id: 'tax',
    iconName: 'shield-check',
    badge: {
      FR: 'Protection Fiscale',
      EN: 'Tax Shield'
    },
    title: {
      FR: 'Conseil Juridique & Fiscal',
      EN: 'Legal & Tax Advisory'
    },
    description: {
      FR: 'Accompagnement stratégique face au Code Général des Impôts (CGI) du Cameroun pour minimiser vos risques financiers et anticiper les contrôles.',
      EN: 'Strategic advisory navigating the Cameroon General Tax Code (CGI) to optimize liabilities and defend against tax inspections.'
    },
    deliverables: {
      FR: [
        'Audit préventif fiscal avant contrôle officiel des impôts',
        'Assistance et rédaction des réponses aux notifications de redressement',
        'Optimisation légale de la TVA, du précompte et de l’acompte d’IS',
        'Conseil en structuration sociétaire et contrats commerciaux'
      ],
      EN: [
        'Pre-emptive tax diagnostic audits before official state inspections',
        'Formal defense drafting against tax adjustment notifications',
        'Legal optimization of VAT, withholding tax and corporate advance payments',
        'Corporate structuring advisory and commercial contract vetting'
      ]
    }
  },
  {
    id: 'audit',
    iconName: 'trending-up',
    badge: {
      FR: 'Gouvernance',
      EN: 'Governance'
    },
    title: {
      FR: 'Audit & Restructuration d’Entreprise',
      EN: 'Audit & Corporate Restructuring'
    },
    description: {
      FR: 'Analyse critique des performances opérationnelles, commissariat aux comptes et réorganisation des processus internes de votre structure.',
      EN: 'Critical reviews of operational structures, internal control auditing, and optimization of organizational business workflows.'
    },
    deliverables: {
      FR: [
        'Audit organisationnel et revue des contrôles internes',
        'Missions de commissariat aux apports et à la fusion',
        'Diagnostic de rentabilité par centre de profit',
        'Plan de redressement et optimisation de trésorerie'
      ],
      EN: [
        'Organizational audit and internal control framework assessment',
        'Statutory auditor missions for capital increases and mergers',
        'Cost center profitability diagnostics and margins evaluation',
        'Turnaround plans and corporate liquidity stabilization'
      ]
    }
  }
];

export const carouselSlides: CarouselSlide[] = [
  {
    id: 'slide-audit',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    title: {
      FR: 'Audits Légaux & Contractuels',
      EN: 'Statutory & Contractual Auditing'
    },
    description: {
      FR: 'Vérification méticuleuse de la régularité et de la sincérité des états financiers pour actionnaires, bailleurs de fonds et partenaires bancaires.',
      EN: 'Rigorous verification of the transparency, accuracy, and reliability of financial statements for investors and banking institutions.'
    },
    tag: {
      FR: 'Transparence & Contrôle',
      EN: 'Transparency & Control'
    }
  },
  {
    id: 'slide-syscohada',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    title: {
      FR: 'Mise en Conformité SYSCOHADA Révisé',
      EN: 'SYSCOHADA Alignment Frameworks'
    },
    description: {
      FR: 'Migration des systèmes d’information comptable et formation des directions financières aux normes révisées de l’OHADA.',
      EN: 'Seamless ERP and bookkeeping system migration with executive workshops on evolving regional OHADA regulations.'
    },
    tag: {
      FR: 'Normes Régionales OHADA',
      EN: 'Regional OHADA Standards'
    }
  },
  {
    id: 'slide-sme',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    title: {
      FR: 'Accompagnement des PME Locales & Startups',
      EN: 'Local SME Structural Scaling'
    },
    description: {
      FR: 'Suivi comptable, prévisions de trésorerie et montage de dossiers de financement pour les entreprises de Douala, Yaoundé et Bafoussam.',
      EN: 'Dedicated corporate guidance, working capital forecasts, and institutional credit file preparation across Cameroon.'
    },
    tag: {
      FR: 'Croissance Entreprises',
      EN: 'Enterprise Growth'
    }
  },
  {
    id: 'slide-consulting',
    image: 'https://images.unsplash.com/photo-1542744094-2ab25be78b90?auto=format&fit=crop&w=1200&q=80',
    title: {
      FR: 'Conseil en Stratégie Fiscale & Investissement',
      EN: 'Strategic Tax & Investment Planning'
    },
    description: {
      FR: 'Accompagnement des investisseurs étrangers et nationaux bénéficiant du statut de la Charte des Investissements au Cameroun.',
      EN: 'Assisting domestic and foreign direct investors leveraging tax incentives under Cameroon Investment Charter schemes.'
    },
    tag: {
      FR: 'Zone CEMAC',
      EN: 'CEMAC Economic Area'
    }
  }
];

export const officeLocations: OfficeLocation[] = [
  {
    city: {
      FR: 'Douala (Siège)',
      EN: 'Douala (Headquarters)'
    },
    address: 'Boulevard de la Liberté, Immeuble Horizon, Bonanjo',
    phone: '+237 670 12 34 56 / +237 233 42 11 00',
    email: 'douala@chia-sn.cm',
    schedule: {
      FR: 'Lundi au Vendredi : 08h00 - 17h30',
      EN: 'Monday to Friday: 8:00 AM - 5:30 PM'
    }
  },
  {
    city: {
      FR: 'Yaoundé (Antenne)',
      EN: 'Yaoundé (Regional Office)'
    },
    address: 'Avenue Rosa Parks, Face Ambassades, Bastos',
    phone: '+237 699 98 76 54 / +237 222 21 09 88',
    email: 'yaounde@chia-sn.cm',
    schedule: {
      FR: 'Lundi au Vendredi : 08h30 - 17h00',
      EN: 'Monday to Friday: 8:30 AM - 5:00 PM'
    }
  }
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: 'testi-1',
    author: 'Amadou Bello',
    role: {
      FR: 'Directeur Général',
      EN: 'Chief Executive Officer'
    },
    company: 'Cameroun Transit & Logistique (CTL)',
    industry: {
      FR: 'Transport & Logistique Portuaire',
      EN: 'Freight & Port Logistics'
    },
    location: 'Douala (Zone Portuaire)',
    rating: 5,
    quote: {
      FR: "Grâce à l'accompagnement rigoureux de Chia-SN, notre DSF est télédéclarée au centre des impôts bien avant l'échéance légale du 15 mars. Zéro pénalité et zéro redressement sur 4 exercices comptables consécutifs.",
      EN: "Thanks to Chia-SN's thorough support, our annual DSF tax filing is completed and e-filed well before the statutory March 15 deadline. Zero penalties and zero reassessments across 4 consecutive financial years."
    },
    highlightMetric: {
      value: '0 FCFA',
      label: {
        FR: 'Pénalités de retard sur 4 ans',
        EN: 'Late penalties across 4 years'
      }
    },
    serviceUsed: {
      FR: 'Montage DSF & Fiscalité',
      EN: 'DSF Filing & Tax Advisory'
    },
    avatarInitials: 'AB',
    badge: {
      FR: 'Partenaire depuis 2021',
      EN: 'Partner since 2021'
    }
  },
  {
    id: 'testi-2',
    author: 'Dr. Madeleine Eboa',
    role: {
      FR: 'Directrice Administrative & Financière',
      EN: 'Chief Financial Officer'
    },
    company: 'Groupe Agro-Pastoral des Plateaux',
    industry: {
      FR: 'Agro-industrie & Exportation',
      EN: 'Agribusiness & Export'
    },
    location: 'Bafoussam & Douala',
    rating: 5,
    quote: {
      FR: "La transition vers les normes SYSCOHADA Révisé pour nos trois entités s'est faite avec une maestria exemplaire. Les associés de Chia-SN ont formé nos équipes et sécurisé le reporting consolidé destiné à nos banques partenaires.",
      EN: "The transition to Revised SYSCOHADA standards across our three corporate entities was executed with exemplary expertise. Chia-SN partners trained our staff and secured consolidated reporting for our banking partners."
    },
    highlightMetric: {
      value: '3 Entités',
      label: {
        FR: 'Conformité OHADA totale',
        EN: 'Full OHADA compliance'
      }
    },
    serviceUsed: {
      FR: 'Mise en conformité SYSCOHADA',
      EN: 'SYSCOHADA Alignment'
    },
    avatarInitials: 'ME',
    badge: {
      FR: 'Audit & Formation',
      EN: 'Audit & Training'
    }
  },
  {
    id: 'testi-3',
    author: 'Patrick Nguemo',
    role: {
      FR: 'Fondateur & Co-Gérant',
      EN: 'Founder & Managing Director'
    },
    company: 'AfriTech Solutions SARL',
    industry: {
      FR: 'Ingénierie & Services Numériques',
      EN: 'IT & Digital Services'
    },
    location: 'Yaoundé (Bastos)',
    rating: 5,
    quote: {
      FR: "Lors d'un contrôle fiscal approfondi de la DGI, le cabinet Chia-SN a bâti une argumentation juridique et comptable irréfutable. Le redressement initial a été allégé de plus de 75% dans le strict respect de la loi de finances.",
      EN: "During an in-depth state tax investigation, Chia-SN constructed an airtight legal and accounting defense. The preliminary reassessment was reduced by over 75% in strict accordance with the Finance Law."
    },
    highlightMetric: {
      value: '-75%',
      label: {
        FR: 'Sur le redressement notifié',
        EN: 'On notified reassessments'
      }
    },
    serviceUsed: {
      FR: 'Assistance Contrôle Fiscal',
      EN: 'Tax Inspection Defense'
    },
    avatarInitials: 'PN',
    badge: {
      FR: 'Contentieux & Fiscalité',
      EN: 'Tax Dispute Advisory'
    }
  },
  {
    id: 'testi-4',
    author: 'Christian Manga',
    role: {
      FR: 'Directeur des Opérations Financières',
      EN: 'Chief Financial Operations'
    },
    company: 'Consortium BTP & Infrastructures Littoral',
    industry: {
      FR: 'Génie Civil & Construction',
      EN: 'Civil Engineering & Construction'
    },
    location: 'Douala (Akwa)',
    rating: 5,
    quote: {
      FR: "Nous leur déléguons la gestion intégrale de la paie, les déclarations sociales CNPS et les téléversements mensuels du DIPE pour plus de 85 salariés. Aucune anomalie, une réactivité permanente et des conseils avisés.",
      EN: "We delegate all payroll administration, mandatory CNPS social filings, and monthly DIPE electronic uploads for over 85 employees. Zero discrepancies, continuous responsiveness, and high-caliber advisory."
    },
    highlightMetric: {
      value: '85+ Agents',
      label: {
        FR: 'Paie & CNPS sans incident',
        EN: 'Payroll & CNPS zero errors'
      }
    },
    serviceUsed: {
      FR: 'Tenue de Comptabilité & Paie',
      EN: 'Bookkeeping & Payroll'
    },
    avatarInitials: 'CM',
    badge: {
      FR: 'Gestion Sociale & Paie',
      EN: 'Payroll & Social Security'
    }
  }
];
