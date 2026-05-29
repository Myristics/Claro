import type { Job, Application, Conversation } from '../store/types';

// ---------------------------------------------------------------------------
// JOBS
// ---------------------------------------------------------------------------

export const JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Head Pastry Chef',
    company: 'Sunrise Bakery',
    companyLogoInitials: 'SB',
    companyColor: '#D4711F',
    type: 'Full-time',
    location: 'Jakarta Selatan',
    workMode: 'On-site',
    salaryRange: 'Rp 8.000.000 – Rp 12.000.000',
    processingDays: 14,
    positions: 1,
    includes: ['cognitive', 'personality', 'technical'],
    closingDate: '2026-06-15',
    description:
      'Sunrise Bakery is looking for a talented Head Pastry Chef to lead our artisan production kitchen in Jakarta Selatan. You will oversee a team of six bakers, develop seasonal menus, and maintain the quality standards our customers love.',
    responsibilities: [
      'Lead and mentor a team of six junior bakers and pastry assistants',
      'Develop and test new seasonal pastry and bread recipes',
      'Manage ingredient procurement and inventory to minimise waste',
      'Ensure all production meets food-safety and hygiene regulations',
      'Coordinate with the front-of-house manager on daily output targets',
    ],
    requirements: [
      'Minimum 5 years experience in a professional kitchen, with 2 years in a senior role',
      'Formal culinary education (Diploma or equivalent) preferred',
      'Strong knowledge of French and Asian pastry techniques',
      'Experience managing a small production team',
      'Fluent in Bahasa Indonesia; working knowledge of English a plus',
    ],
    benefits: [
      'Health insurance (BPJS Kesehatan + top-up)',
      'Annual performance bonus up to 2× monthly salary',
      'Free daily meals during shift',
      'Professional development budget Rp 3.000.000/year',
    ],
    stage: 'Assessment',
    industry: 'Food & Beverage',
    experienceLevel: 'Senior',
    isOpen: true,
    postedAt: '2026-05-01',
  },
  {
    id: 'job-2',
    title: 'Farm Operations Manager',
    company: 'Greenfield Farm',
    companyLogoInitials: 'GF',
    companyColor: '#2E7D32',
    type: 'Full-time',
    location: 'Bogor, Jawa Barat',
    workMode: 'On-site',
    salaryRange: 'Rp 12.000.000 – Rp 18.000.000',
    processingDays: 21,
    positions: 1,
    includes: ['cognitive', 'personality'],
    closingDate: '2026-06-20',
    description:
      'Greenfield Farm operates 120 hectares of mixed vegetable and fruit production in Bogor. We need an experienced Farm Operations Manager to oversee daily field activities, coordinate harvest logistics, and drive continuous improvement in yield quality.',
    responsibilities: [
      'Oversee planting schedules, irrigation, and pest-management programmes',
      'Manage a workforce of 40+ field staff and seasonal workers',
      'Coordinate cold-chain logistics from farm gate to distribution centre',
      'Track KPIs including yield per hectare, post-harvest loss, and labour cost per kg',
      'Liaise with buyers, certification auditors, and equipment suppliers',
    ],
    requirements: [
      'Bachelor degree in Agronomy, Agriculture, or related field',
      'Minimum 7 years operational experience on a commercial farm',
      'Proficient in farm-management software (e.g. Agworld or equivalent)',
      'Strong leadership and conflict-resolution skills',
      'Willing to reside in Bogor or commute daily',
    ],
    benefits: [
      'Company housing or housing allowance Rp 2.500.000/month',
      'Transport allowance and company vehicle for field use',
      'BPJS Ketenagakerjaan and BPJS Kesehatan',
      'Annual leave 14 days + 2 days compassionate leave',
    ],
    stage: 'Interview',
    industry: 'Agriculture',
    experienceLevel: 'Senior',
    isOpen: true,
    postedAt: '2026-04-22',
  },
  {
    id: 'job-3',
    title: 'Supply Chain Specialist',
    company: 'Green Leaf Organic',
    companyLogoInitials: 'GL',
    companyColor: '#4CAF50',
    type: 'Full-time',
    location: 'Bandung, Jawa Barat',
    workMode: 'Hybrid',
    salaryRange: 'Rp 9.000.000 – Rp 14.000.000',
    processingDays: 18,
    positions: 2,
    includes: ['cognitive', 'technical'],
    closingDate: '2026-06-10',
    description:
      'Green Leaf Organic sources certified organic produce from 200+ smallholder farmers across Java and Bali. As our Supply Chain Specialist you will manage supplier relationships, optimise logistics routes, and ensure on-time delivery to retail and e-commerce partners.',
    responsibilities: [
      'Manage end-to-end order fulfilment from supplier to retail shelf',
      'Analyse shipment data and identify cost-reduction opportunities',
      'Coordinate with warehouse teams to maintain optimal stock levels',
      'Develop and maintain supplier scorecards and performance metrics',
      'Support new product launch logistics and sourcing of new suppliers',
    ],
    requirements: [
      'Bachelor degree in Supply Chain Management, Industrial Engineering, or equivalent',
      'Minimum 3 years experience in FMCG or agri-food supply chain',
      'Advanced Excel and working knowledge of ERP systems (SAP or Oracle)',
      'Analytical mindset with attention to detail',
      'Fluent Bahasa Indonesia; English intermediate (written)',
    ],
    benefits: [
      'Flexible hybrid schedule (3 days office / 2 days remote)',
      'BPJS full coverage',
      'Internet allowance Rp 400.000/month',
      'Quarterly team-building events',
    ],
    stage: 'Applied',
    industry: 'FMCG / Organic Food',
    experienceLevel: 'Mid-level',
    isOpen: true,
    postedAt: '2026-05-05',
  },
  {
    id: 'job-4',
    title: 'Guest Experience Lead',
    company: 'Blue Horizon Resort',
    companyLogoInitials: 'BH',
    companyColor: '#1565C0',
    type: 'Full-time',
    location: 'Badung, Bali',
    workMode: 'On-site',
    salaryRange: 'Rp 7.500.000 – Rp 11.000.000',
    processingDays: 10,
    positions: 3,
    includes: ['personality', 'interview'],
    closingDate: '2026-06-05',
    description:
      'Blue Horizon Resort in Seminyak seeks a Guest Experience Lead to set the tone for every guest interaction—from arrival welcome to post-stay follow-up. You will coach a front-desk team of eight and personally handle VIP guests and escalations.',
    responsibilities: [
      'Greet VIP arrivals and lead pre-arrival personalisation touchpoints',
      'Coach and performance-manage a team of eight front-desk agents',
      'Resolve guest complaints within 15 minutes using the LEARN framework',
      'Maintain a guest satisfaction (NPS) score above 72',
      'Collaborate with F&B and housekeeping on seamless service delivery',
    ],
    requirements: [
      'Diploma or Bachelor degree in Hospitality Management',
      'Minimum 4 years hotel experience with at least 1 year in a supervisory role',
      'Fluent English (written and spoken); Mandarin or Japanese a strong plus',
      'Calm under pressure with a genuine passion for service',
      'Willing to work rotating shifts including weekends and public holidays',
    ],
    benefits: [
      'Accommodation or housing allowance for non-Bali residents',
      'Meals on duty',
      'International brand hospitality training programme',
      'Service charge distribution on top of base salary',
    ],
    stage: 'Interview',
    industry: 'Hospitality',
    experienceLevel: 'Mid-level',
    isOpen: true,
    postedAt: '2026-05-10',
  },
  {
    id: 'job-5',
    title: 'Agricultural Data Scientist',
    company: 'Greenfield Farm',
    companyLogoInitials: 'GF',
    companyColor: '#2E7D32',
    type: 'Full-time',
    location: 'Bogor, Jawa Barat',
    workMode: 'Hybrid',
    salaryRange: 'Rp 18.000.000 – Rp 25.000.000',
    processingDays: 21,
    positions: 1,
    includes: ['cognitive', 'technical'],
    closingDate: '2026-07-01',
    description:
      'We are investing in precision agriculture at Greenfield Farm and need a Data Scientist to turn our sensor, satellite, and yield datasets into actionable insights for farm management teams.',
    responsibilities: [
      'Build predictive models for crop yield and disease risk from IoT sensor data',
      'Design and maintain a farm data lake on AWS',
      'Deliver weekly dashboards to operations and executive teams',
      'Work with agronomists to translate model outputs into field decisions',
      'Evaluate and pilot new satellite imagery and remote-sensing services',
    ],
    requirements: [
      'Master degree in Data Science, Statistics, Computer Science, or Agronomy with strong analytics track record',
      'Proficient in Python (pandas, scikit-learn, PyTorch or TensorFlow)',
      'Experience with geospatial data (GDAL, GeoPandas, or QGIS)',
      'Familiarity with cloud platforms (AWS or GCP preferred)',
      'Ability to communicate findings clearly to non-technical audiences',
    ],
    benefits: [
      'Remote-friendly (travel to Bogor farm 4× per year)',
      'Research publication support',
      'Conference attendance budget Rp 10.000.000/year',
      'Stock options in company growth scheme',
    ],
    stage: 'Applied',
    industry: 'Agriculture / Technology',
    experienceLevel: 'Senior',
    isOpen: true,
    postedAt: '2026-05-14',
  },
  {
    id: 'job-6',
    title: 'Digital Archive Specialist',
    company: 'Maplewood Library',
    companyLogoInitials: 'ML',
    companyColor: '#6D4C41',
    type: 'Full-time',
    location: 'Yogyakarta',
    workMode: 'On-site',
    salaryRange: 'Rp 5.500.000 – Rp 7.500.000',
    processingDays: 14,
    positions: 1,
    includes: ['cognitive'],
    closingDate: '2026-06-28',
    description:
      'Maplewood Library is digitising 45.000 historical manuscripts and photographs. The Digital Archive Specialist will manage scanning workflows, metadata tagging, and ensure the long-term accessibility of our digital collections.',
    responsibilities: [
      'Operate high-resolution scanners and manage image quality control',
      'Create and maintain Dublin Core metadata records in our DSpace repository',
      'Train volunteer staff on digitisation standards (ISO 19264)',
      'Coordinate with the IT team on storage infrastructure and backup schedules',
      'Prepare digitised content for online exhibition and public access portals',
    ],
    requirements: [
      'Bachelor degree in Library Science, Information Management, or equivalent',
      'Experience with digitisation workflows and metadata standards',
      'Familiar with DSpace, Omeka, or similar repository platforms',
      'Detail-oriented with excellent file organisation skills',
      'Comfortable working with fragile historical materials',
    ],
    benefits: [
      'Government-equivalent civil-service benefits',
      'Access to rare manuscript collection for personal research',
      'Flexible hours within core 08.00–16.00 window',
      'Annual study leave for relevant postgraduate programmes',
    ],
    stage: 'Applied',
    industry: 'Education / Libraries',
    experienceLevel: 'Junior',
    isOpen: true,
    postedAt: '2026-05-18',
  },
  {
    id: 'job-7',
    title: 'Customer Service Representative',
    company: 'Ocean View Hotel',
    companyLogoInitials: 'OV',
    companyColor: '#00838F',
    type: 'Full-time',
    location: 'Makassar, Sulawesi Selatan',
    workMode: 'On-site',
    salaryRange: 'Rp 4.500.000 – Rp 6.000.000',
    processingDays: 7,
    positions: 5,
    includes: ['personality'],
    closingDate: '2026-06-01',
    description:
      'Ocean View Hotel in Makassar is expanding its front-desk team ahead of peak season. Customer Service Representatives are the face of the hotel and handle check-in, reservations, guest queries, and concierge requests.',
    responsibilities: [
      'Manage check-in and check-out efficiently using Opera PMS',
      'Handle phone and email reservations with accuracy',
      'Provide local tourism information and arrange transport, tours, and dining',
      'Escalate complaints to the duty manager within defined SLAs',
      'Maintain a tidy and welcoming front-desk environment at all times',
    ],
    requirements: [
      'Diploma or Bachelor degree in Hospitality, Tourism, or equivalent',
      'Minimum 1 year hotel front-desk experience preferred (fresh graduates welcome)',
      'Friendly and professional demeanour with strong communication skills',
      'Basic English proficiency',
      'Willing to work shift rotation including nights and weekends',
    ],
    benefits: [
      'Meals on duty',
      'Uniform provided',
      'Staff discount on hotel room rates',
      'Fast-track promotion programme for high performers',
    ],
    stage: 'Applied',
    industry: 'Hospitality',
    experienceLevel: 'Entry-level',
    isOpen: true,
    postedAt: '2026-05-20',
  },
  {
    id: 'job-8',
    title: 'Accountant',
    company: 'Airbnb',
    companyLogoInitials: 'AB',
    companyColor: '#FF5A5F',
    type: 'Full-time',
    location: 'Jakarta Pusat',
    workMode: 'Hybrid',
    salaryRange: 'Rp 14.000.000 – Rp 20.000.000',
    processingDays: 21,
    positions: 2,
    includes: ['cognitive', 'technical'],
    closingDate: '2026-06-25',
    description:
      'Airbnb Indonesia is seeking an Accountant to support statutory reporting, tax compliance, and financial analysis for our Southeast Asia operations hub in Jakarta.',
    responsibilities: [
      'Prepare monthly, quarterly, and annual financial statements in accordance with PSAK and IFRS',
      'Handle tax computation, filing (SPT), and liaise with the DJP as required',
      'Reconcile inter-company accounts for the APAC holding structure',
      'Support annual audit by coordinating with external auditors (Big Four)',
      'Identify process-improvement opportunities in the month-end close cycle',
    ],
    requirements: [
      'Bachelor degree in Accounting or Finance (S1)',
      'Brevet A & B tax certification',
      'Minimum 3 years experience in public accounting or MNC finance team',
      'Proficient in SAP S/4HANA or Oracle Financials',
      'Fluent in Bahasa Indonesia and English (TOEFL 550+ or IELTS 6.0+)',
    ],
    benefits: [
      'Annual performance bonus',
      'Stock options (RSU) vesting over 4 years',
      'Comprehensive health insurance for employee and dependants',
      'Home office allowance Rp 1.500.000/month for hybrid days',
    ],
    stage: 'Applied',
    industry: 'Technology / Travel',
    experienceLevel: 'Mid-level',
    isOpen: false,
    postedAt: '2026-04-15',
  },
  {
    id: 'job-9',
    title: 'Product Designer',
    company: 'Tokopedia',
    companyLogoInitials: 'TP',
    companyColor: '#42B549',
    type: 'Full-time',
    location: 'Jakarta Selatan',
    workMode: 'Hybrid',
    salaryRange: 'Rp 20.000.000 – Rp 32.000.000',
    processingDays: 28,
    positions: 3,
    includes: ['cognitive', 'personality', 'technical', 'interview'],
    closingDate: '2026-07-10',
    description:
      "Tokopedia's Growth Design team is hiring Product Designers to craft seamless buyer and seller experiences across our marketplace. You will work closely with PMs, engineers, and data analysts in fast-moving two-week sprints.",
    responsibilities: [
      'Own end-to-end design for one or two product domains (discovery, checkout, or seller tools)',
      'Run user research (generative and evaluative) to validate design decisions',
      'Produce wireframes, prototypes, and final Figma specs for engineering handoff',
      'Contribute to and evolve the Tokopedia design system',
      'Present design rationale to senior stakeholders with clarity and confidence',
    ],
    requirements: [
      'Bachelor degree in Design, HCI, or equivalent field',
      'Minimum 3 years product design experience on a consumer or marketplace platform',
      'Expert in Figma and prototyping tools',
      'Portfolio demonstrating end-to-end design process and measurable impact',
      'Collaborative mindset and comfort with rapid iteration',
    ],
    benefits: [
      'Competitive base salary + equity',
      'Annual design conference budget Rp 15.000.000',
      'Best-in-class health insurance',
      'Hybrid schedule with ergonomic home office allowance',
    ],
    stage: 'Assessment',
    industry: 'E-commerce / Technology',
    experienceLevel: 'Mid-level',
    isOpen: true,
    postedAt: '2026-05-03',
  },
  {
    id: 'job-10',
    title: 'Content Strategy Analyst',
    company: 'Netflix',
    companyLogoInitials: 'NF',
    companyColor: '#E50914',
    type: 'Full-time',
    location: 'Jakarta Selatan',
    workMode: 'Hybrid',
    salaryRange: 'Rp 22.000.000 – Rp 35.000.000',
    processingDays: 30,
    positions: 1,
    includes: ['cognitive', 'personality', 'technical'],
    closingDate: '2026-07-05',
    description:
      'Netflix Indonesia is growing its Content Strategy team to support local and regional original production decisions. As Content Strategy Analyst you will analyse viewership data, competitive content landscapes, and audience trends to inform commissioning decisions.',
    responsibilities: [
      'Build quantitative models to forecast viewership and content ROI for proposed originals',
      'Conduct competitive benchmarking across streaming platforms in Southeast Asia',
      'Produce weekly content performance reports for the regional VP and commissioning editors',
      'Identify white-space opportunities in underserved genres or demographics',
      'Collaborate with the data engineering team to improve content analytics pipelines',
    ],
    requirements: [
      'Bachelor or Master degree in Business, Economics, Statistics, or Media Studies',
      'Minimum 4 years experience in media analytics, streaming, or management consulting',
      'Proficient in SQL and Tableau (or equivalent BI tool)',
      'Strong storytelling ability — can translate data into compelling narratives',
      'Deep knowledge of the Indonesian entertainment and media landscape',
    ],
    benefits: [
      'Unlimited streaming account (family plan)',
      'Annual performance bonus',
      'World-class health and wellness benefits',
      'Flexible hybrid schedule and summer Fridays',
    ],
    stage: 'Assessment',
    industry: 'Media / Streaming',
    experienceLevel: 'Mid-level',
    isOpen: true,
    postedAt: '2026-04-28',
  },
];

// ---------------------------------------------------------------------------
// APPLICATIONS  (for candidate "Ahmad Azza", candidateId: 'c-ahmad-azza')
// ---------------------------------------------------------------------------

export const APPLICATIONS: Application[] = [
  {
    // app-1: Content Strategy Analyst / Netflix — active, mid-assessment
    id: 'app-1',
    jobId: 'job-10',
    candidateId: 'c-ahmad-azza',
    stage: 'assessment',
    recruiterStatus: 'waiting-candidate',
    appliedAt: '2026-05-02',
    expectedDecisionDate: '2026-06-15',
    assessments: [
      {
        id: 'asmnt-1a',
        type: 'cognitive',
        label: 'Cognitive Reasoning',
        completed: true,
        score: 82,
        duration: 25,
      },
      {
        id: 'asmnt-1b',
        type: 'personality',
        label: 'Personality Profile',
        completed: true,
        duration: 20,
      },
      {
        id: 'asmnt-1c',
        type: 'technical',
        label: 'Technical Aptitude',
        completed: false,
        duration: 40,
      },
    ],
    assessmentProgress: 67,
    insightUnlocked: false,
    applicationWindowClosed: false,
    deadline: '2026-06-05',
    extensionsUsed: 0,
    hasInsightReport: false,
    lastActivityAt: '2026-05-20T10:30:00Z',
  },
  {
    // app-2: Product Designer / Tokopedia — under review
    id: 'app-2',
    jobId: 'job-9',
    candidateId: 'c-ahmad-azza',
    stage: 'in-review',
    recruiterStatus: 'in-progress',
    appliedAt: '2026-05-06',
    expectedDecisionDate: '2026-06-20',
    assessments: [],
    assessmentProgress: 0,
    insightUnlocked: false,
    applicationWindowClosed: false,
    deadline: '2026-06-20',
    extensionsUsed: 0,
    hasInsightReport: false,
    lastActivityAt: '2026-05-10T08:15:00Z',
  },
  {
    // app-3: Accountant / Airbnb — rejected, has insight report
    id: 'app-3',
    jobId: 'job-8',
    candidateId: 'c-ahmad-azza',
    stage: 'rejected',
    recruiterStatus: 'resolved',
    appliedAt: '2026-04-18',
    expectedDecisionDate: '2026-05-20',
    assessments: [
      {
        id: 'asmnt-3a',
        type: 'cognitive',
        label: 'Cognitive Reasoning',
        completed: true,
        score: 68,
        duration: 25,
      },
      {
        id: 'asmnt-3b',
        type: 'technical',
        label: 'Technical Aptitude',
        completed: true,
        score: 71,
        duration: 40,
      },
    ],
    assessmentProgress: 100,
    insightUnlocked: true,
    applicationWindowClosed: true,
    deadline: '2026-05-10',
    extensionsUsed: 1,
    rejectionReason:
      'We appreciated your enthusiasm for the role. After careful consideration, we have moved forward with candidates whose experience more closely matches our current technical accounting requirements — specifically PSAK convergence work and SAP S/4HANA migration projects. Your assessment scores were solid, and we encourage you to apply again as our team grows.',
    hasInsightReport: true,
    lastActivityAt: '2026-05-22T14:00:00Z',
    offerDetails: undefined,
  },
  {
    // app-4: Head Pastry Chef / Sunrise Bakery — accepted, offer extended
    id: 'app-4',
    jobId: 'job-1',
    candidateId: 'c-ahmad-azza',
    stage: 'accepted',
    recruiterStatus: 'resolved',
    appliedAt: '2026-05-05',
    expectedDecisionDate: '2026-05-25',
    assessments: [
      {
        id: 'asmnt-4a',
        type: 'cognitive',
        label: 'Cognitive Reasoning',
        completed: true,
        score: 79,
        duration: 25,
      },
      {
        id: 'asmnt-4b',
        type: 'personality',
        label: 'Personality Profile',
        completed: true,
        duration: 20,
      },
      {
        id: 'asmnt-4c',
        type: 'technical',
        label: 'Technical Aptitude',
        completed: true,
        score: 88,
        duration: 40,
      },
    ],
    assessmentProgress: 100,
    insightUnlocked: true,
    applicationWindowClosed: true,
    deadline: '2026-05-20',
    extensionsUsed: 0,
    hasInsightReport: true,
    lastActivityAt: '2026-05-24T09:00:00Z',
    offerDetails: {
      salary: 'Rp 10.500.000 per bulan',
      startDate: '2026-07-01',
      position: 'Head Pastry Chef',
      company: 'Sunrise Bakery',
    },
  },
  {
    // app-6: Guest Experience Lead / Blue Horizon Resort — interview stage
    id: 'app-6',
    jobId: 'job-4',
    candidateId: 'c-ahmad-azza',
    stage: 'interview',
    recruiterStatus: 'waiting-candidate',
    appliedAt: '2026-05-08',
    expectedDecisionDate: '2026-06-10',
    assessments: [
      {
        id: 'asmnt-6a',
        type: 'personality',
        label: 'Personality Profile',
        completed: true,
        duration: 20,
      },
      {
        id: 'asmnt-6b',
        type: 'interview',
        label: 'AI Interview',
        completed: false,
        duration: 15,
      },
    ],
    assessmentProgress: 50,
    insightUnlocked: false,
    applicationWindowClosed: false,
    deadline: '2026-06-10',
    extensionsUsed: 0,
    hasInsightReport: false,
    lastActivityAt: '2026-05-25T14:30:00Z',
  },
  {
    // app-7: Farm Operations Manager / Greenfield Farm — applied (just submitted)
    id: 'app-7',
    jobId: 'job-2',
    candidateId: 'c-ahmad-azza',
    stage: 'applied',
    recruiterStatus: 'waiting-recruiter',
    appliedAt: '2026-05-25',
    expectedDecisionDate: '2026-06-20',
    assessments: [],
    assessmentProgress: 0,
    insightUnlocked: false,
    applicationWindowClosed: false,
    deadline: '2026-06-20',
    extensionsUsed: 0,
    hasInsightReport: false,
    lastActivityAt: '2026-05-25T09:10:00Z',
  },
  {
    // app-8: Supply Chain Specialist / Green Leaf Organic — assessment-complete
    id: 'app-8',
    jobId: 'job-3',
    candidateId: 'c-ahmad-azza',
    stage: 'assessment-complete',
    recruiterStatus: 'in-progress',
    appliedAt: '2026-05-12',
    expectedDecisionDate: '2026-06-18',
    assessments: [
      { id: 'asmnt-8a', type: 'cognitive',  label: 'Cognitive Reasoning', completed: true, score: 75, duration: 25 },
      { id: 'asmnt-8b', type: 'technical',  label: 'Technical Aptitude',  completed: true, score: 80, duration: 40 },
    ],
    assessmentProgress: 100,
    insightUnlocked: false,
    applicationWindowClosed: false,
    deadline: '2026-06-10',
    extensionsUsed: 0,
    hasInsightReport: false,
    lastActivityAt: '2026-05-22T16:00:00Z',
  },
  {
    // app-9: Customer Service Representative / Ocean View Hotel — decision (final review)
    id: 'app-9',
    jobId: 'job-7',
    candidateId: 'c-ahmad-azza',
    stage: 'decision',
    recruiterStatus: 'in-progress',
    appliedAt: '2026-05-04',
    expectedDecisionDate: '2026-06-05',
    assessments: [
      { id: 'asmnt-9a', type: 'personality', label: 'Personality Profile', completed: true, duration: 20 },
    ],
    assessmentProgress: 100,
    insightUnlocked: false,
    applicationWindowClosed: false,
    deadline: '2026-05-28',
    extensionsUsed: 0,
    hasInsightReport: false,
    lastActivityAt: '2026-05-23T11:30:00Z',
  },
  {
    // app-10: Digital Archive Specialist / Maplewood Library — applied (recent)
    id: 'app-10',
    jobId: 'job-6',
    candidateId: 'c-ahmad-azza',
    stage: 'applied',
    recruiterStatus: 'waiting-recruiter',
    appliedAt: '2026-05-26',
    expectedDecisionDate: '2026-06-28',
    assessments: [],
    assessmentProgress: 0,
    insightUnlocked: false,
    applicationWindowClosed: false,
    deadline: '2026-06-28',
    extensionsUsed: 0,
    hasInsightReport: false,
    lastActivityAt: '2026-05-26T14:20:00Z',
  },
  {
    // app-5: Agricultural Data Scientist / Greenfield Farm — draft (in progress)
    id: 'app-5',
    jobId: 'job-5',
    candidateId: 'c-ahmad-azza',
    stage: 'draft',
    recruiterStatus: 'waiting-candidate',
    appliedAt: '2026-05-27T01:00:00Z',
    expectedDecisionDate: '2026-07-15',
    assessments: [],
    assessmentProgress: 66,
    draftStep: 2,
    draftTotalSteps: 3,
    insightUnlocked: false,
    applicationWindowClosed: false,
    deadline: '2026-07-01',
    extensionsUsed: 0,
    hasInsightReport: false,
    lastActivityAt: '2026-05-27T01:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// CONVERSATIONS
// ---------------------------------------------------------------------------

export const CONVERSATIONS: Conversation[] = [
  // ── Pinned general conversation ──────────────────────────────────────────
  {
    id: 'conv-general',
    applicationId: 'general',
    jobTitle: 'General',
    company: '',
    lastMessageAt: '2026-05-24T10:00:00Z',
    unread: false,
    messages: [
      {
        id: 'mg-1',
        role: 'user',
        content: 'How do I interpret my insight report archetype?',
        timestamp: '2026-05-24T09:45:00Z',
      },
      {
        id: 'mg-2',
        role: 'ai',
        content:
          'Your insight report archetype summarises your thinking and working style based on your assessment results. It is not a judgment — it is a map of how you naturally approach problems, collaborate, and make decisions. The archetype reflects consistent patterns across all your assessments. Your full report includes what that archetype means, its typical strengths, and which kinds of roles and environments tend to be a strong fit.',
        timestamp: '2026-05-24T09:46:00Z',
      },
      {
        id: 'mg-3',
        role: 'user',
        content: 'Can I have more than one archetype?',
        timestamp: '2026-05-24T09:50:00Z',
      },
      {
        id: 'mg-4',
        role: 'ai',
        content:
          'Each report is centred on one primary archetype, but many people have strong secondary traits too. Your report will highlight your dominant style while noting where secondary characteristics show up. Think of it less like a fixed box and more like a spectrum — the primary archetype just describes where you land most consistently.',
        timestamp: '2026-05-24T09:51:00Z',
      },
      {
        id: 'mg-5',
        role: 'user',
        content: 'Is the archetype shared with the recruiter?',
        timestamp: '2026-05-24T09:55:00Z',
      },
      {
        id: 'mg-6',
        role: 'ai',
        content:
          'Yes — a summary of your assessment results, including the archetype, is shared with the recruiter as part of the hiring process. The detailed narrative in your Insight Report is yours to keep regardless of the outcome, but the recruiter sees the headline profile so they can make a more informed, fair decision.',
        timestamp: '2026-05-24T09:56:00Z',
      },
      {
        id: 'mg-7',
        role: 'user',
        content: 'What if I disagree with my archetype?',
        timestamp: '2026-05-24T10:00:00Z',
      },
      {
        id: 'mg-8',
        role: 'ai',
        content:
          "That is completely valid. Archetypes are based on patterns in your responses, not a definitive verdict on who you are. If a result surprises you, it can be useful to re-read the full description — sometimes the nuance only becomes clear in context. If you still feel it is significantly off, you are welcome to note that in follow-up conversations with the recruiter. Your self-awareness is itself a signal they will value.",
        timestamp: '2026-05-24T10:01:00Z',
      },
    ],
  },
  // ── Per-application conversations ────────────────────────────────────────
  {
    id: 'conv-1',
    applicationId: 'app-1',
    jobTitle: 'Content Strategy Analyst',
    company: 'Netflix',
    lastMessageAt: '2026-05-20T11:00:00Z',
    unread: true,
    messages: [
      {
        id: 'msg-1a',
        role: 'user',
        content: 'What does the assessment stage mean for my application?',
        timestamp: '2026-05-20T10:45:00Z',
      },
      {
        id: 'msg-1b',
        role: 'ai',
        content:
          'Great question. The assessment stage means Netflix would like to evaluate some of your skills before moving you to the next step. You have been assigned three assessments: Cognitive Reasoning (25 min), Personality Profile (20 min), and Technical Aptitude (40 min). You have completed two of them — just the Technical Aptitude remains. Once you submit all three, your results will be reviewed by the hiring team and you will hear back within the expected decision window.',
        timestamp: '2026-05-20T10:46:00Z',
      },
      {
        id: 'msg-1c',
        role: 'user',
        content: 'How long do I have to complete the remaining assessment?',
        timestamp: '2026-05-20T10:55:00Z',
      },
      {
        id: 'msg-1d',
        role: 'ai',
        content:
          'Your current deadline is 5 June 2026. That gives you about 16 days from today. I would recommend completing it at least 3 days before the deadline so the results can be processed in time. Let me know if you have any questions about what to expect in the Technical Aptitude assessment.',
        timestamp: '2026-05-20T10:56:00Z',
      },
      {
        id: 'msg-1e',
        role: 'user',
        content: 'What kind of questions are in the Technical Aptitude test?',
        timestamp: '2026-05-20T11:00:00Z',
      },
      {
        id: 'msg-1f',
        role: 'ai',
        content:
          'The Technical Aptitude assessment for this role typically covers data interpretation, SQL logic, and business-case analysis aligned to the Content Strategy Analyst role. Questions are scenario-based and multiple choice. You cannot pause once you start, so make sure you are in a quiet environment with a reliable internet connection before you begin.',
        timestamp: '2026-05-20T11:01:00Z',
      },
    ],
  },
  {
    id: 'conv-2',
    applicationId: 'app-3',
    jobTitle: 'Accountant',
    company: 'Airbnb',
    lastMessageAt: '2026-05-23T09:30:00Z',
    unread: false,
    messages: [
      {
        id: 'msg-2a',
        role: 'user',
        content: 'My application was closed. What can I do to improve for next time?',
        timestamp: '2026-05-23T09:15:00Z',
      },
      {
        id: 'msg-2b',
        role: 'ai',
        content:
          'I understand this is disappointing news. The recruiter chose to share a reason with you, which you can read in your application detail — it mentions that the selected candidates had specific experience in PSAK convergence projects and SAP S/4HANA migrations. Your insight report is now available and shows your strengths in analytical reasoning and core accounting knowledge. It also identifies areas where targeted upskilling could sharpen your profile for similar roles.',
        timestamp: '2026-05-23T09:16:00Z',
      },
      {
        id: 'msg-2c',
        role: 'user',
        content: 'Can you tell me my exact scores?',
        timestamp: '2026-05-23T09:20:00Z',
      },
      {
        id: 'msg-2d',
        role: 'ai',
        content:
          'Score details are available directly in your Insight Report — I am not able to share raw numbers in this chat. Your report includes a full breakdown with context on what each score means and how it compares to benchmarks for similar roles. Head to your Application detail and tap "View Insight Report" to read it.',
        timestamp: '2026-05-23T09:21:00Z',
      },
      {
        id: 'msg-2e',
        role: 'user',
        content: 'I feel like the process was unfair. This is really discouraging.',
        timestamp: '2026-05-23T09:28:00Z',
      },
      {
        id: 'msg-2f',
        role: 'ai',
        content:
          'It is completely natural to feel that way — job searching is genuinely hard work, and hearing that an application did not progress is always difficult. Your effort in completing all the assessments is something to acknowledge. If you would like to talk through this with a person from the Rakamin support team, I can connect you right now.',
        timestamp: '2026-05-23T09:29:00Z',
        isEscalation: true,
      },
      {
        id: 'msg-2g',
        role: 'user',
        content: 'Yes, please connect me.',
        timestamp: '2026-05-23T09:30:00Z',
      },
      {
        id: 'msg-2h',
        role: 'ai',
        content:
          'Done — a member of the Rakamin candidate support team will reach out to you via the email on your profile within one business day. In the meantime, your Insight Report is still there whenever you are ready to review it.',
        timestamp: '2026-05-23T09:30:00Z',
      },
    ],
  },
  {
    id: 'conv-3',
    applicationId: 'app-4',
    jobTitle: 'Head Pastry Chef',
    company: 'Sunrise Bakery',
    lastMessageAt: '2026-05-24T10:00:00Z',
    unread: false,
    messages: [
      {
        id: 'msg-3a',
        role: 'user',
        content: 'I received an offer — what do I do next?',
        timestamp: '2026-05-24T09:50:00Z',
      },
      {
        id: 'msg-3b',
        role: 'ai',
        content:
          'Congratulations! Your offer from Sunrise Bakery is now visible in your application detail. You can review the full offer — including salary, start date, and position details — on the Offer page. When you are ready, tap "Accept Offer" to confirm, or reach out to the recruiter directly if you have any questions about the terms.',
        timestamp: '2026-05-24T09:51:00Z',
      },
      {
        id: 'msg-3c',
        role: 'user',
        content: 'Is there any room to negotiate the start date?',
        timestamp: '2026-05-24T09:58:00Z',
      },
      {
        id: 'msg-3d',
        role: 'ai',
        content:
          'Start-date flexibility is something to discuss directly with the Sunrise Bakery recruiter — I cannot negotiate on their behalf. I would recommend sending them a message through the platform before you formally accept, so both parties are aligned. Would you like help drafting that message?',
        timestamp: '2026-05-24T10:00:00Z',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// RECRUITER VACANCIES
// ---------------------------------------------------------------------------

export type VacancyStatus = 'active' | 'need-action' | 'not-active' | 'draft';

export interface RecruiterVacancy {
  id: string;
  title: string;
  locationWorkMode: string;
  status: VacancyStatus;
  expectedDecision: string | null; // ISO date or null
  lastActivity: {
    event: string;
    timeAgo: string;
    by: string; // 'candidate' | person name | 'no action taken'
  };
}

export const RECRUITER_VACANCIES: RecruiterVacancy[] = [
  {
    id: 'rv-1',
    title: 'Data Analyst',
    locationWorkMode: 'Remote',
    status: 'active',
    expectedDecision: '2026-06-10',
    lastActivity: { event: 'New Application', timeAgo: '1 hour ago', by: 'candidate' },
  },
  {
    id: 'rv-2',
    title: 'UX Researcher',
    locationWorkMode: 'Jakarta • Hybrid',
    status: 'active',
    expectedDecision: '2026-06-21',
    lastActivity: { event: 'Assessment Submitted', timeAgo: '2 hours ago', by: 'candidate' },
  },
  {
    id: 'rv-3',
    title: 'Senior Product Designer',
    locationWorkMode: 'Remote',
    status: 'draft',
    expectedDecision: null,
    lastActivity: { event: 'Draft Saved', timeAgo: '3 hours ago', by: 'Sarah R.' },
  },
  {
    id: 'rv-4',
    title: 'Backend Engineer',
    locationWorkMode: 'Jakarta • Hybrid',
    status: 'need-action',
    expectedDecision: '2026-05-25',
    lastActivity: { event: 'Candidate Moved to Interview', timeAgo: '5 hours ago', by: 'Sarah R.' },
  },
  {
    id: 'rv-5',
    title: 'Growth Marketing Lead',
    locationWorkMode: 'Bandung • Hybrid',
    status: 'active',
    expectedDecision: '2026-06-26',
    lastActivity: { event: 'Assessment Submitted', timeAgo: '6 hours ago', by: 'candidate' },
  },
  {
    id: 'rv-6',
    title: 'Frontend Engineer',
    locationWorkMode: 'Jakarta • On-site',
    status: 'not-active',
    expectedDecision: null,
    lastActivity: { event: 'Offer Accepted', timeAgo: '8 hours ago', by: 'candidate' },
  },
  {
    id: 'rv-7',
    title: 'iOS Engineer',
    locationWorkMode: 'Jakarta • On-site',
    status: 'need-action',
    expectedDecision: '2026-05-20',
    lastActivity: { event: 'Assessment Sent', timeAgo: '1 day ago', by: 'Sarah R.' },
  },
  {
    id: 'rv-8',
    title: 'DevOps Engineer',
    locationWorkMode: 'Jakarta • On-site',
    status: 'draft',
    expectedDecision: null,
    lastActivity: { event: 'Draft Saved', timeAgo: '1 day ago', by: 'Sarah R.' },
  },
  {
    id: 'rv-9',
    title: 'UX Researcher',
    locationWorkMode: 'Jakarta • Hybrid',
    status: 'active',
    expectedDecision: '2026-06-16',
    lastActivity: { event: 'Stage Updated', timeAgo: 'Yesterday', by: 'Sarah R.' },
  },
  {
    id: 'rv-10',
    title: 'Content Strategist',
    locationWorkMode: 'Jakarta • On-site',
    status: 'need-action',
    expectedDecision: '2026-05-21',
    lastActivity: { event: 'Decision Date Passed', timeAgo: '2 days ago', by: 'no action taken' },
  },
  {
    id: 'rv-11',
    title: 'Product Manager',
    locationWorkMode: 'Jakarta • Hybrid',
    status: 'active',
    expectedDecision: '2026-06-12',
    lastActivity: { event: 'Stage Updated', timeAgo: '3 days ago', by: 'Sarah R.' },
  },
  {
    id: 'rv-12',
    title: 'Data Scientist',
    locationWorkMode: 'Remote',
    status: 'not-active',
    expectedDecision: null,
    lastActivity: { event: 'Position Closed', timeAgo: '5 days ago', by: 'Sarah R.' },
  },
  {
    id: 'rv-13',
    title: 'Mobile Developer',
    locationWorkMode: 'Jakarta • On-site',
    status: 'not-active',
    expectedDecision: null,
    lastActivity: { event: 'Offer Rejected', timeAgo: '4 days ago', by: 'candidate' },
  },
  {
    id: 'rv-14',
    title: 'HR Specialist',
    locationWorkMode: 'Jakarta • Hybrid',
    status: 'not-active',
    expectedDecision: null,
    lastActivity: { event: 'Offer Accepted', timeAgo: '4 days ago', by: 'candidate' },
  },
  {
    id: 'rv-15',
    title: 'Finance Analyst',
    locationWorkMode: 'Remote',
    status: 'draft',
    expectedDecision: null,
    lastActivity: { event: 'Draft Saved', timeAgo: '1 week ago', by: 'Sarah R.' },
  },
];

// ── Candidate Pipeline ──────────────────────────────────────────────────────

export type PipelineCandidateStatus = 'waiting-for-review' | 'in-progress' | 'shortlisted' | 'offer-sent';

export type VacancyStage = 'Applied' | 'Assessment' | 'Interview' | 'Final Review' | 'Resolved';

// Each application the candidate submitted — carries its own status, stage, score + activity
export interface PipelineApplication {
  vacancyId: string;
  title: string;
  locationWorkMode: string;
  status: PipelineCandidateStatus;
  stage: VacancyStage;
  score: number | null; // null = no numeric assessments completed yet
  lastActivity: { event: string; timeAgo: string; by: string };
}

export interface PipelineCandidate {
  id: string;
  name: string;
  email: string;
  applications: PipelineApplication[];  // 1 = single role; 2+ = multi-role (dropdown)
}

// ── Vacancy Detail (for Overview tab) ──────────────────────────────────────

export interface AssessmentTypeConfig {
  type: 'cognitive' | 'personality' | 'technical' | 'ai-interview';
  label: string;
  description: string;
  enabled: boolean;
}

export interface VacancyDetail {
  vacancyId: string;
  level: string;
  type: string;
  positions: number;
  salaryRange: string;
  openedDate: string;
  decisionByDate: string;
  aboutRole: string;
  requirements: string[];
  applicationQuestions: string[];
  assessmentTypes: AssessmentTypeConfig[];
  assessmentSettings: {
    opensOn: string;
    deadline: string;
    insightReleased: string;
    proctoringLevel: string;
  };
}

export const PIPELINE_CANDIDATES: PipelineCandidate[] = [
  {
    id: 'pc-1',
    name: 'Aditya Kurniawan',
    email: 'aditya.kurniawan@gmail.com',
    applications: [
      {
        vacancyId: 'rv-1', title: 'Data Analyst', locationWorkMode: 'Jakarta • On-site',
        status: 'waiting-for-review', stage: 'Applied', score: null,
        lastActivity: { event: 'Application Submitted', timeAgo: '1 hour ago', by: 'system' },
      },
      {
        vacancyId: 'rv-5', title: 'Growth Marketing Lead', locationWorkMode: 'Jakarta • Hybrid',
        status: 'in-progress', stage: 'Assessment', score: 72,
        lastActivity: { event: 'Assessment Sent', timeAgo: '3 hours ago', by: 'Sarah B.' },
      },
    ],
  },
  {
    id: 'pc-2',
    name: 'Fika Permatasari',
    email: 'fika.permatasari@email.com',
    applications: [{
      vacancyId: 'rv-2', title: 'UX Researcher', locationWorkMode: 'Jakarta • Hybrid',
      status: 'waiting-for-review', stage: 'Assessment', score: 68,
      lastActivity: { event: 'Assessment Submitted', timeAgo: '3 hours ago', by: 'Fika P.' },
    }],
  },
  {
    id: 'pc-3',
    name: 'Budi Santoso',
    email: 'budi.s@gmail.com',
    applications: [{
      vacancyId: 'rv-2', title: 'UX Researcher', locationWorkMode: 'Jakarta • Hybrid',
      status: 'waiting-for-review', stage: 'Applied', score: null,
      lastActivity: { event: 'Assessment Assigned', timeAgo: '5 hours ago', by: 'Sarah B.' },
    }],
  },
  {
    id: 'pc-4',
    name: 'Maya Fitria',
    email: 'maya.fitria@gmail.com',
    applications: [{
      vacancyId: 'rv-9', title: 'Growth Marketing Lead', locationWorkMode: 'Jakarta • Hybrid',
      status: 'in-progress', stage: 'Assessment', score: 80,
      lastActivity: { event: 'Assessment Sent', timeAgo: '6 hours ago', by: 'Sarah B.' },
    }],
  },
  {
    id: 'pc-5',
    name: 'Devi Puspita',
    email: 'devi.p@gmail.com',
    applications: [{
      vacancyId: 'rv-5', title: 'Growth Marketing Lead', locationWorkMode: 'Jakarta • Hybrid',
      status: 'waiting-for-review', stage: 'Interview', score: 74,
      lastActivity: { event: 'Interview Scheduled', timeAgo: '8 hours ago', by: 'Ranti A.' },
    }],
  },
  {
    id: 'pc-6',
    name: 'Hamida Ramadhani',
    email: 'hamida.ramadhani@email.com',
    applications: [{
      vacancyId: 'rv-11', title: 'Product Manager', locationWorkMode: 'Jakarta • Hybrid',
      status: 'waiting-for-review', stage: 'Applied', score: null,
      lastActivity: { event: 'Application Submitted', timeAgo: '10 hours ago', by: 'system' },
    }],
  },
  {
    id: 'pc-7',
    name: 'Dewi Puspita',
    email: 'dewi.puspita@gmail.com',
    applications: [{
      vacancyId: 'rv-11', title: 'Product Manager', locationWorkMode: 'Jakarta • Hybrid',
      status: 'offer-sent', stage: 'Final Review', score: 88,
      lastActivity: { event: 'Offer Sent', timeAgo: 'Yesterday', by: 'Ranti A.' },
    }],
  },
  {
    id: 'pc-8',
    name: 'Nadia Rahman',
    email: 'nrk@gmail.com',
    applications: [{
      vacancyId: 'rv-1', title: 'Data Analyst', locationWorkMode: 'Jakarta • Hybrid',
      status: 'waiting-for-review', stage: 'Assessment', score: 65,
      lastActivity: { event: 'Application Submitted', timeAgo: '2 days ago', by: 'system' },
    }],
  },
  {
    id: 'pc-9',
    name: 'Siti Aminah',
    email: 'siti.aminah@gmail.com',
    applications: [{
      vacancyId: 'rv-9', title: 'Growth Marketing Lead', locationWorkMode: 'Jakarta • Hybrid',
      status: 'shortlisted', stage: 'Interview', score: 82,
      lastActivity: { event: 'Shortlisted', timeAgo: '2 days ago', by: 'Ranti A.' },
    }],
  },
  {
    id: 'pc-10',
    name: 'Rizky Pratama',
    email: 'rizky.pratama@email.com',
    applications: [{
      vacancyId: 'rv-2', title: 'UX Researcher', locationWorkMode: 'Jakarta • Hybrid',
      status: 'in-progress', stage: 'Assessment', score: 71,
      lastActivity: { event: 'Assessment Submitted', timeAgo: '3 days ago', by: 'Rizky P.' },
    }],
  },
  {
    id: 'pc-11',
    name: 'Laila Nurhayati',
    email: 'laila.n@gmail.com',
    applications: [
      {
        vacancyId: 'rv-1', title: 'Data Analyst', locationWorkMode: 'Jakarta • On-site',
        status: 'waiting-for-review', stage: 'Applied', score: null,
        lastActivity: { event: 'Application Submitted', timeAgo: '3 days ago', by: 'system' },
      },
      {
        vacancyId: 'rv-11', title: 'Product Manager', locationWorkMode: 'Jakarta • Hybrid',
        status: 'shortlisted', stage: 'Interview', score: 77,
        lastActivity: { event: 'Shortlisted', timeAgo: '2 days ago', by: 'Ranti A.' },
      },
      {
        vacancyId: 'rv-9', title: 'Growth Marketing Lead', locationWorkMode: 'Jakarta • Hybrid',
        status: 'in-progress', stage: 'Assessment', score: 69,
        lastActivity: { event: 'Assessment Sent', timeAgo: '4 days ago', by: 'Sarah B.' },
      },
    ],
  },
  {
    id: 'pc-12',
    name: 'Eko Santoso',
    email: 'eko.s@email.com',
    applications: [{
      vacancyId: 'rv-5', title: 'Growth Marketing Lead', locationWorkMode: 'Jakarta • Hybrid',
      status: 'in-progress', stage: 'Interview', score: 85,
      lastActivity: { event: 'Interview Completed', timeAgo: '4 days ago', by: 'Ranti A.' },
    }],
  },
  {
    id: 'pc-13',
    name: 'Putri Handayani',
    email: 'putri.h@gmail.com',
    applications: [{
      vacancyId: 'rv-9', title: 'Growth Marketing Lead', locationWorkMode: 'Jakarta • Hybrid',
      status: 'waiting-for-review', stage: 'Assessment', score: 63,
      lastActivity: { event: 'Assessment Assigned', timeAgo: '5 days ago', by: 'Sarah B.' },
    }],
  },
  {
    id: 'pc-14',
    name: 'Farhan Maulana',
    email: 'farhan.m@gmail.com',
    applications: [{
      vacancyId: 'rv-1', title: 'Data Analyst', locationWorkMode: 'Jakarta • On-site',
      status: 'shortlisted', stage: 'Interview', score: 78,
      lastActivity: { event: 'Shortlisted', timeAgo: '6 days ago', by: 'Ranti A.' },
    }],
  },
  {
    id: 'pc-15',
    name: 'Anisa Wulandari',
    email: 'anisa.w@email.com',
    applications: [{
      vacancyId: 'rv-11', title: 'Product Manager', locationWorkMode: 'Jakarta • Hybrid',
      status: 'offer-sent', stage: 'Resolved', score: 91,
      lastActivity: { event: 'Offer Accepted', timeAgo: '1 week ago', by: 'Anisa W.' },
    }],
  },
  // ── rv-4 Backend Engineer (overdue/late) ─────────────────────
  {
    id: 'pc-16',
    name: 'Reza Mahardika',
    email: 'reza.m@email.com',
    applications: [{
      vacancyId: 'rv-4', title: 'Backend Engineer', locationWorkMode: 'Jakarta • Hybrid',
      status: 'shortlisted', stage: 'Interview', score: 81,
      lastActivity: { event: 'Interview Completed', timeAgo: '5 days ago', by: 'Ranti A.' },
    }],
  },
  {
    id: 'pc-17',
    name: 'Indira Sari',
    email: 'indira.s@gmail.com',
    applications: [{
      vacancyId: 'rv-4', title: 'Backend Engineer', locationWorkMode: 'Jakarta • Hybrid',
      status: 'waiting-for-review', stage: 'Interview', score: 73,
      lastActivity: { event: 'Interview Completed', timeAgo: '6 days ago', by: 'Indira S.' },
    }],
  },
  {
    id: 'pc-18',
    name: 'Faisal Abdullah',
    email: 'faisal.a@email.com',
    applications: [{
      vacancyId: 'rv-4', title: 'Backend Engineer', locationWorkMode: 'Jakarta • Hybrid',
      status: 'shortlisted', stage: 'Final Review', score: 89,
      lastActivity: { event: 'Moved to Final Review', timeAgo: '8 days ago', by: 'Sarah R.' },
    }],
  },
  // ── rv-6 Frontend Engineer (closed/not-active) ───────────────
  {
    id: 'pc-19',
    name: 'Citra Dewi',
    email: 'citra.d@gmail.com',
    applications: [{
      vacancyId: 'rv-6', title: 'Frontend Engineer', locationWorkMode: 'Jakarta • On-site',
      status: 'offer-sent', stage: 'Resolved', score: 92,
      lastActivity: { event: 'Offer Accepted', timeAgo: '8 days ago', by: 'Citra D.' },
    }],
  },
  {
    id: 'pc-20',
    name: 'Hendra Kusuma',
    email: 'hendra.k@email.com',
    applications: [{
      vacancyId: 'rv-6', title: 'Frontend Engineer', locationWorkMode: 'Jakarta • On-site',
      status: 'in-progress', stage: 'Final Review', score: 76,
      lastActivity: { event: 'Vacancy Closed', timeAgo: '8 days ago', by: 'system' },
    }],
  },
];

// ── Vacancy Details (for Overview tab) ─────────────────────────────────────

export const VACANCY_DETAILS: VacancyDetail[] = [
  {
    vacancyId: 'rv-1',
    level: 'Mid-level',
    type: 'Full-time',
    positions: 2,
    salaryRange: 'Rp 12.000.000 – Rp 18.000.000',
    openedDate: '2026-05-01',
    decisionByDate: '2026-06-10',
    aboutRole:
      'We are looking for a Data Analyst to join our growing analytics team. You will transform complex datasets into clear business insights, build dashboards for key stakeholders, and help drive data-informed decisions across the organisation.',
    requirements: [
      'Bachelor degree in Statistics, Mathematics, Computer Science, or related field',
      'Minimum 3 years experience in a data analytics or BI role',
      'Proficient in SQL and at least one BI tool (Tableau, Power BI, or Metabase)',
      'Strong communication skills — able to present findings to non-technical audiences',
      'Experience with Python or R for data wrangling is a plus',
    ],
    applicationQuestions: [
      'Describe a time you identified a key business insight from a dataset. What was the impact?',
      'What BI tools are you most experienced with and why?',
      'How do you approach data quality issues in a production pipeline?',
    ],
    assessmentTypes: [
      { type: 'cognitive', label: 'Cognitive Reasoning', description: 'Measures logical and numerical reasoning ability', enabled: true },
      { type: 'personality', label: 'Personality Profile', description: 'Maps working style and behavioural traits', enabled: false },
      { type: 'technical', label: 'Technical Aptitude', description: 'Role-specific SQL and data analysis knowledge', enabled: true },
      { type: 'ai-interview', label: 'AI Interview', description: 'Structured video interview scored by AI', enabled: false },
    ],
    assessmentSettings: {
      opensOn: 'Immediately after application',
      deadline: '14 days after opening',
      insightReleased: 'After vacancy closes',
      proctoringLevel: 'Standard',
    },
  },
  {
    vacancyId: 'rv-2',
    level: 'Mid-level',
    type: 'Full-time',
    positions: 1,
    salaryRange: 'Rp 14.000.000 – Rp 20.000.000',
    openedDate: '2026-05-10',
    decisionByDate: '2026-06-21',
    aboutRole:
      'We are hiring a UX Researcher to lead user research initiatives across our product lines. You will conduct qualitative and quantitative studies, synthesise findings into actionable recommendations, and champion the user across the entire product lifecycle.',
    requirements: [
      'Bachelor or Master degree in HCI, Psychology, Design, or related field',
      'Minimum 3 years experience in UX research for a digital product',
      'Expertise in both generative and evaluative research methods',
      'Strong portfolio demonstrating research process and business impact',
      'Comfortable with usability testing, interviews, surveys, and data analysis',
    ],
    applicationQuestions: [
      'Walk us through a research project that changed a product direction. What methods did you use?',
      'How do you prioritise which user problems to investigate?',
      'Describe your experience collaborating with product designers and engineers.',
    ],
    assessmentTypes: [
      { type: 'cognitive', label: 'Cognitive Reasoning', description: 'Measures logical and analytical reasoning', enabled: true },
      { type: 'personality', label: 'Personality Profile', description: 'Maps working style and behavioural traits', enabled: true },
      { type: 'technical', label: 'Technical Aptitude', description: 'UX research methods and tools knowledge', enabled: false },
      { type: 'ai-interview', label: 'AI Interview', description: 'Structured video interview scored by AI', enabled: true },
    ],
    assessmentSettings: {
      opensOn: 'Immediately after application',
      deadline: '21 days after opening',
      insightReleased: 'After vacancy closes',
      proctoringLevel: 'Basic',
    },
  },
  {
    vacancyId: 'rv-4',
    level: 'Senior',
    type: 'Full-time',
    positions: 1,
    salaryRange: 'Rp 20.000.000 – Rp 30.000.000',
    openedDate: '2026-04-20',
    decisionByDate: '2026-05-25',
    aboutRole:
      'We are looking for a Senior Backend Engineer to architect and build scalable microservices. You will lead technical design discussions, mentor junior engineers, and work closely with product teams to deliver robust, well-tested backend systems.',
    requirements: [
      'Bachelor degree in Computer Science or equivalent',
      'Minimum 5 years backend engineering experience, with 2 years in a senior role',
      'Deep expertise in one or more of: Go, Node.js, Java, or Python',
      'Experience designing and operating distributed systems in production',
      'Strong understanding of databases, caching, and API design principles',
    ],
    applicationQuestions: [
      'Describe the most complex system you have designed from scratch. What were the main trade-offs?',
      'How do you approach performance optimisation in a high-traffic API?',
      'Give an example of how you have mentored a junior engineer effectively.',
    ],
    assessmentTypes: [
      { type: 'cognitive', label: 'Cognitive Reasoning', description: 'Measures logical and problem-solving ability', enabled: true },
      { type: 'personality', label: 'Personality Profile', description: 'Maps working style and leadership traits', enabled: false },
      { type: 'technical', label: 'Technical Aptitude', description: 'Backend engineering and systems design knowledge', enabled: true },
      { type: 'ai-interview', label: 'AI Interview', description: 'Structured video interview scored by AI', enabled: true },
    ],
    assessmentSettings: {
      opensOn: 'Immediately after application',
      deadline: '14 days after opening',
      insightReleased: 'After vacancy closes',
      proctoringLevel: 'Enhanced',
    },
  },
  {
    vacancyId: 'rv-6',
    level: 'Mid-level',
    type: 'Full-time',
    positions: 1,
    salaryRange: 'Rp 16.000.000 – Rp 22.000.000',
    openedDate: '2026-04-10',
    decisionByDate: '2026-05-20',
    aboutRole:
      'This vacancy is now closed — a successful candidate has been selected. We were looking for a Frontend Engineer to build beautiful, accessible interfaces with React and TypeScript. Application data is available for review.',
    requirements: [
      'Bachelor degree in Computer Science or related field',
      'Minimum 3 years frontend engineering experience',
      'Expert in React and TypeScript',
      'Strong CSS and responsive design skills',
      'Experience with testing (Jest, Playwright, or Cypress)',
    ],
    applicationQuestions: [
      'Describe a frontend performance challenge you solved. What was the measurable improvement?',
      'How do you approach accessibility in your UI work?',
    ],
    assessmentTypes: [
      { type: 'cognitive', label: 'Cognitive Reasoning', description: 'Measures logical and analytical thinking', enabled: true },
      { type: 'personality', label: 'Personality Profile', description: 'Maps working style and collaborative traits', enabled: false },
      { type: 'technical', label: 'Technical Aptitude', description: 'React, TypeScript, and web fundamentals', enabled: true },
      { type: 'ai-interview', label: 'AI Interview', description: 'Structured video interview scored by AI', enabled: false },
    ],
    assessmentSettings: {
      opensOn: 'Immediately after application',
      deadline: '14 days after opening',
      insightReleased: 'After vacancy closes',
      proctoringLevel: 'Standard',
    },
  },
  {
    vacancyId: 'rv-11',
    level: 'Mid-level',
    type: 'Full-time',
    positions: 1,
    salaryRange: 'Rp 18.000.000 – Rp 26.000.000',
    openedDate: '2026-04-25',
    decisionByDate: '2026-06-12',
    aboutRole:
      'We are hiring a Product Manager to own the roadmap and delivery for one of our core product areas. You will work with design, engineering, and business stakeholders to define, prioritise, and ship features that create measurable user value.',
    requirements: [
      'Bachelor degree in Business, Computer Science, or related field',
      'Minimum 3 years product management experience on a digital product',
      'Strong analytical skills with experience in A/B testing and data-driven decision making',
      'Excellent written and verbal communication skills',
      'Experience working in an agile/scrum environment',
    ],
    applicationQuestions: [
      'Tell us about a product decision you made that was later proven wrong. How did you handle it?',
      'How do you balance short-term feature requests with long-term platform health?',
      'Describe how you work with a design team to define a great user experience.',
    ],
    assessmentTypes: [
      { type: 'cognitive', label: 'Cognitive Reasoning', description: 'Measures strategic and analytical thinking', enabled: true },
      { type: 'personality', label: 'Personality Profile', description: 'Maps leadership and collaboration style', enabled: true },
      { type: 'technical', label: 'Technical Aptitude', description: 'Product management frameworks and methods', enabled: false },
      { type: 'ai-interview', label: 'AI Interview', description: 'Structured video interview scored by AI', enabled: true },
    ],
    assessmentSettings: {
      opensOn: 'Immediately after application',
      deadline: '21 days after opening',
      insightReleased: 'After vacancy closes',
      proctoringLevel: 'Basic',
    },
  },
];
