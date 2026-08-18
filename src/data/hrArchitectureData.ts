import { SystemNode, LifecyclePhase, ProcessSimulationScenario, EmployeeJourneyPersona, AnalyticsMetric } from '../types';

export const SYSTEM_NODES: SystemNode[] = [
  {
    id: 'employee',
    name: 'Employee / Candidate',
    shortName: 'Employee',
    code: 'EMP-00',
    layer: 'employee',
    category: 'Portal & Gateway',
    description: 'Central actor across all HR interactions — applicants, new hires, active workforce, managers, and transitioning alumni.',
    executiveSummary: 'Initiates self-service requests, completes mandatory compliance, submits development plans, and consumes HR benefits.',
    keyFeatures: [
      'Self-service profile and life-event updates',
      'Mobile and desktop responsive access',
      'Unified single sign-on (SSO) authentication',
      'Real-time task and notification center'
    ],
    ownerDepartment: 'Global Workforce / End Users',
    techStack: 'Mobile App (iOS/Android), Web Browser, Microsoft Teams integration',
    protocols: ['HTTPS', 'OIDC', 'SAML 2.0', 'Push Notifications'],
    managedEntities: ['User Sessions', 'Task Approvals', 'Course Enrollments', 'Service Tickets'],
    upstreamSystems: [],
    downstreamSystems: ['myhr_portal'],
    supportedLifecycleStages: ['hire', 'onboard', 'develop', 'retain', 'transition'],
    sla: {
      targetUptime: '99.99%',
      avgLatency: '18ms',
      status: 'Operational',
      availability: 99.99,
      activeUsersToday: 142850
    },
    iconName: 'Users',
    colorScheme: {
      bg: 'from-blue-600/20 to-indigo-600/20',
      border: 'border-blue-500/40',
      text: 'text-blue-400',
      accent: 'bg-blue-500',
      badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      glow: 'shadow-[0_0_25px_rgba(59,130,246,0.25)]'
    },
    gridPosition: { col: 2, row: 1 }
  },
  {
    id: 'myhr_portal',
    name: 'MyHR Portal (HRcore)',
    shortName: 'HRcore Portal',
    code: 'HRC-01',
    layer: 'portal',
    category: 'Portal & Gateway',
    description: 'The central enterprise HR service portal and employee lifecycle spine connecting all downstream specialist platforms.',
    executiveSummary: 'Single entry point for employee self-service (ESS), manager self-service (MSS), digital employee records, and master HR data orchestration.',
    keyFeatures: [
      'Centralized digital employee record (Single Source of Truth)',
      'Intelligent service catalog and automated routing',
      'Contract lifecycle, role transfers, and org hierarchy',
      'Federated cross-platform navigation bar'
    ],
    ownerDepartment: 'Corporate HR IT & Digital Experience',
    techStack: 'SAP SuccessFactors / Enterprise Cloud Core, Next.js Frontend, Node.js Gateway',
    protocols: ['REST API', 'GraphQL', 'OData v4', 'Kafka Event Bus', 'OAuth 2.0 / SAML'],
    managedEntities: ['Master Personnel Record', 'Job Architecture', 'Organization Tree', 'Employment Contracts', 'Work Schedule'],
    upstreamSystems: ['employee'],
    downstreamSystems: ['onboarding_app', 'learnhub_trainm', 'hr_services_admin'],
    supportedLifecycleStages: ['hire', 'onboard', 'develop', 'retain', 'transition'],
    sla: {
      targetUptime: '99.95%',
      avgLatency: '45ms',
      status: 'Operational',
      availability: 99.97,
      activeUsersToday: 98420
    },
    iconName: 'Compass',
    colorScheme: {
      bg: 'from-purple-600/20 to-pink-600/20',
      border: 'border-purple-500/40',
      text: 'text-purple-300',
      accent: 'bg-purple-500',
      badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.25)]'
    },
    gridPosition: { col: 2, row: 2 }
  },
  {
    id: 'onboarding_app',
    name: 'Onboarding App',
    shortName: 'Onboarding App',
    code: 'ONB-02',
    layer: 'applications',
    category: 'Onboarding & Identity',
    description: 'Dedicated digital onboarding workflow management platform guiding candidates from contract signing through Day 90.',
    executiveSummary: 'Automates pre-boarding document submission, welcome kits, manager checklists, buddy assignment, and initial orientation schedules.',
    keyFeatures: [
      'Pre-boarding digital document collection & e-signature',
      'Personalized welcome hub & team introductions',
      'Day 1 to Day 90 milestone checklists with manager alerts',
      'Automated trigger to OneIDM for zero-touch credentialing'
    ],
    ownerDepartment: 'Talent Acquisition & People Operations',
    techStack: 'React Native Web, Spring Boot Microservices, PostgreSQL',
    protocols: ['REST API', 'Webhooks', 'SCIM 2.0 Client', 'Kafka Topics'],
    managedEntities: ['Onboarding Tasks', 'New Hire Dossier', 'Buddy Pairings', 'Equipment Delivery Status', 'I-9 / Legal Compliance'],
    upstreamSystems: ['myhr_portal'],
    downstreamSystems: ['oneid_itsp', 'hr_reporting_pbi'],
    supportedLifecycleStages: ['hire', 'onboard'],
    sla: {
      targetUptime: '99.90%',
      avgLatency: '62ms',
      status: 'Operational',
      availability: 99.94,
      activeUsersToday: 4120
    },
    iconName: 'UserCheck',
    colorScheme: {
      bg: 'from-emerald-600/20 to-teal-600/20',
      border: 'border-emerald-500/40',
      text: 'text-emerald-300',
      accent: 'bg-emerald-500',
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]'
    },
    gridPosition: { col: 1, row: 3 }
  },
  {
    id: 'oneid_itsp',
    name: 'OneID / OneIDM & ITSP',
    shortName: 'OneID & ITSP',
    code: 'IDM-03',
    layer: 'infrastructure',
    category: 'Onboarding & Identity',
    description: 'Enterprise identity & access management (OneIDM) synchronized with IT Service Portal (ITSP) for automated provisioning.',
    executiveSummary: 'Automates Active Directory, Entra ID, email creation, security badge provisioning, hardware asset shipping, and software licensing.',
    keyFeatures: [
      'Zero-touch automated account & email provisioning (Day -7)',
      'Role-based access control (RBAC) & attribute-based access (ABAC)',
      'Hardware bundle ordering (Laptop, accessories, mobile tokens)',
      'Automated deprovisioning and access revocation during transition'
    ],
    ownerDepartment: 'Enterprise IT Identity & Infrastructure Security',
    techStack: 'SailPoint IdentityNow / Microsoft Entra ID / ServiceNow ITSM',
    protocols: ['SCIM 2.0', 'SAML 2.0', 'OIDC', 'LDAP / Kerberos', 'REST API'],
    managedEntities: ['Digital Identity (OneID)', 'Security Groups', 'Hardware Requisitions', 'Software Entitlements', 'MFA Tokens'],
    upstreamSystems: ['onboarding_app'],
    downstreamSystems: ['hr_reporting_pbi'],
    supportedLifecycleStages: ['onboard', 'retain', 'transition'],
    sla: {
      targetUptime: '99.99%',
      avgLatency: '32ms',
      status: 'Operational',
      availability: 99.99,
      activeUsersToday: 135000
    },
    iconName: 'ShieldCheck',
    colorScheme: {
      bg: 'from-cyan-600/20 to-blue-600/20',
      border: 'border-cyan-500/40',
      text: 'text-cyan-300',
      accent: 'bg-cyan-500',
      badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      glow: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]'
    },
    gridPosition: { col: 1, row: 4 }
  },
  {
    id: 'learnhub_trainm',
    name: 'LearnHUB (TrainM)',
    shortName: 'LearnHUB / LMS',
    code: 'LMS-04',
    layer: 'applications',
    category: 'Learning & Growth',
    description: 'Enterprise Learning Management System (LMS) delivering digital courses, compliance curriculums, and certifications.',
    executiveSummary: 'Hosts global learning catalog, tracks statutory compliance certifications, provides AI-driven course recommendations, and manages virtual classrooms.',
    keyFeatures: [
      'Automated assignment of mandatory compliance (Cyber, Code of Conduct)',
      'Content library integration (Coursera, LinkedIn Learning, internal assets)',
      'Certification tracking and automated expiry re-certifications',
      'Virtual instructor-led training (VILT) and attendance logging'
    ],
    ownerDepartment: 'Corporate Learning & Development',
    techStack: 'Cornerstone OnDemand / SAP SuccessFactors Learning / xAPI Engine',
    protocols: ['SCORM 2004', 'xAPI (Tin Can)', 'REST API', 'OData', 'LTI 1.3'],
    managedEntities: ['Course Catalog', 'Learning Transcripts', 'Compliance Badges', 'Training Hours', 'Classroom Schedules'],
    upstreamSystems: ['myhr_portal'],
    downstreamSystems: ['cptm_competence', 'hr_academy', 'hr_reporting_pbi'],
    supportedLifecycleStages: ['onboard', 'develop', 'retain'],
    sla: {
      targetUptime: '99.92%',
      avgLatency: '54ms',
      status: 'Operational',
      availability: 99.95,
      activeUsersToday: 42100
    },
    iconName: 'BookOpen',
    colorScheme: {
      bg: 'from-amber-600/20 to-orange-600/20',
      border: 'border-amber-500/40',
      text: 'text-amber-300',
      accent: 'bg-amber-500',
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]'
    },
    gridPosition: { col: 2, row: 3 }
  },
  {
    id: 'cptm_competence',
    name: 'Competence Management (CptM)',
    shortName: 'CptM Skills Matrix',
    code: 'CPT-05',
    layer: 'infrastructure',
    category: 'Learning & Growth',
    description: 'Enterprise skills taxonomy and competence profiling platform mapping workforce capabilities against future role profiles.',
    executiveSummary: 'Evaluates employee skills vs target job profiles, conducts skill gap analyses, fuels succession planning, and guides project staffing.',
    keyFeatures: [
      'Global competency taxonomy & standardized proficiency levels (1-5)',
      'Target vs actual skill gap radar visualizer',
      'Internal talent marketplace & AI-powered project matching',
      'Succession planning & critical capability risk modeling'
    ],
    ownerDepartment: 'Strategic Workforce Planning & Competency Development',
    techStack: 'Custom Microservices, Neo4j Graph DB (Skills Ontologies), Python ML',
    protocols: ['GraphQL', 'gRPC', 'REST API', 'Kafka Streams'],
    managedEntities: ['Skill Taxonomy', 'Employee Competence Profiles', 'Job Target Profiles', 'Skill Gap Scores', 'Talent Pools'],
    upstreamSystems: ['learnhub_trainm'],
    downstreamSystems: ['hr_academy', 'hr_reporting_pbi'],
    supportedLifecycleStages: ['develop', 'retain'],
    sla: {
      targetUptime: '99.90%',
      avgLatency: '78ms',
      status: 'Operational',
      availability: 99.91,
      activeUsersToday: 18450
    },
    iconName: 'Target',
    colorScheme: {
      bg: 'from-yellow-600/20 to-amber-600/20',
      border: 'border-yellow-500/40',
      text: 'text-yellow-300',
      accent: 'bg-yellow-500',
      badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
      glow: 'shadow-[0_0_25px_rgba(234,179,8,0.25)]'
    },
    gridPosition: { col: 2, row: 4 }
  },
  {
    id: 'hr_academy',
    name: 'HR Academy',
    shortName: 'HR Academy',
    code: 'ACD-06',
    layer: 'infrastructure',
    category: 'Learning & Growth',
    description: 'Specialized executive leadership acceleration, HR mastery programs, and talent accelerator school.',
    executiveSummary: 'Curates elite leadership development tracks, executive coaching, change management programs, and HR business partner accreditation.',
    keyFeatures: [
      'High-potential (HiPo) leadership pipelines and cohorts',
      '1-on-1 executive coaching & mentorship orchestration',
      'Leadership 360-degree assessment feedback integrations',
      'Strategic HR certification & business partnering mastery'
    ],
    ownerDepartment: 'Global Executive Leadership & HR Academy',
    techStack: 'Canvas LMS Engine / Video Collaboration SDK / Mentorship Matcher',
    protocols: ['REST API', 'SAML 2.0', 'Webhooks'],
    managedEntities: ['Leadership Cohorts', 'Executive Assessments', 'Mentorship Engagements', 'Leadership Credentials'],
    upstreamSystems: ['learnhub_trainm', 'cptm_competence'],
    downstreamSystems: ['hr_reporting_pbi'],
    supportedLifecycleStages: ['develop', 'retain'],
    sla: {
      targetUptime: '99.85%',
      avgLatency: '90ms',
      status: 'Operational',
      availability: 99.88,
      activeUsersToday: 3200
    },
    iconName: 'Award',
    colorScheme: {
      bg: 'from-orange-600/20 to-red-600/20',
      border: 'border-orange-500/40',
      text: 'text-orange-300',
      accent: 'bg-orange-500',
      badge: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
      glow: 'shadow-[0_0_25px_rgba(249,115,22,0.25)]'
    },
    gridPosition: { col: 3, row: 4 }
  },
  {
    id: 'hr_services_admin',
    name: 'HR Services Administration',
    shortName: 'HR Services Admin',
    code: 'SRV-07',
    layer: 'applications',
    category: 'Operations & Administration',
    description: 'Shared service operations processing transactional lifecycle events, payroll coordination, benefits, contracts, and ticketing.',
    executiveSummary: 'Handles high-volume operational HR requests, leaves of absence, salary amendments, international transfers, and offboarding administration.',
    keyFeatures: [
      'Multi-tiered HR Service Desk ticketing & SLA tracking',
      'Payroll input orchestration & benefits enrollment processing',
      'Contract amendments, promotion letters, and job transfers',
      'Exit protocol management and legal separation clearance'
    ],
    ownerDepartment: 'Global HR Shared Services (HR SSC)',
    techStack: 'ServiceNow HR Service Delivery / SAP Payroll / DocuSign API',
    protocols: ['REST API', 'SOAP / OData', 'Secure SFTP (Payroll)', 'Webhooks'],
    managedEntities: ['HR Service Tickets', 'Payroll Input Files', 'Benefits Records', 'Leave Entitlements', 'Separation Documents'],
    upstreamSystems: ['myhr_portal'],
    downstreamSystems: ['hr_reporting_pbi'],
    supportedLifecycleStages: ['hire', 'onboard', 'develop', 'retain', 'transition'],
    sla: {
      targetUptime: '99.95%',
      avgLatency: '40ms',
      status: 'Operational',
      availability: 99.96,
      activeUsersToday: 67300
    },
    iconName: 'Briefcase',
    colorScheme: {
      bg: 'from-blue-600/20 to-cyan-600/20',
      border: 'border-blue-500/40',
      text: 'text-blue-300',
      accent: 'bg-blue-500',
      badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      glow: 'shadow-[0_0_25px_rgba(59,130,246,0.25)]'
    },
    gridPosition: { col: 3, row: 3 }
  },
  {
    id: 'hr_reporting_pbi',
    name: 'HR Reporting Platform (Power BI)',
    shortName: 'HR Reporting (Power BI)',
    code: 'PBI-08',
    layer: 'analytics',
    category: 'Analytics & BI',
    description: 'Enterprise business intelligence and workforce analytics engine aggregating cross-system operational telemetry.',
    executiveSummary: 'Delivers executive dashboards, headcount forecasting, diversity metrics, turnover analytics, skills gap heatmaps, and process SLA monitoring.',
    keyFeatures: [
      'Executive KPI scorecards with drill-down to business unit level',
      'Predictive attrition modeling and flight-risk alerts',
      'Cross-system SLA compliance and process cycle time analytics',
      'Interactive workforce demographic, skills, and payroll cost modeling'
    ],
    ownerDepartment: 'People Analytics & Strategic HR Controlling',
    techStack: 'Microsoft Power BI Embedded, Azure Synapse Analytics, Fabric Lakehouse',
    protocols: ['OData Feeds', 'DirectQuery', 'REST API (Power BI REST API)', 'Azure Data Factory'],
    managedEntities: ['Workforce Semantic Model', 'Daily Snapshot Lakehouse', 'KPI Aggregates', 'Executive Reports', 'Audit Telemetry'],
    upstreamSystems: ['onboarding_app', 'oneid_itsp', 'learnhub_trainm', 'cptm_competence', 'hr_academy', 'hr_services_admin'],
    downstreamSystems: [],
    supportedLifecycleStages: ['hire', 'onboard', 'develop', 'retain', 'transition'],
    sla: {
      targetUptime: '99.98%',
      avgLatency: '120ms (Query Refresh)',
      status: 'Operational',
      availability: 99.98,
      activeUsersToday: 12400
    },
    iconName: 'BarChart3',
    colorScheme: {
      bg: 'from-rose-600/20 to-red-600/20',
      border: 'border-rose-500/40',
      text: 'text-rose-300',
      accent: 'bg-rose-500',
      badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      glow: 'shadow-[0_0_25px_rgba(244,63,94,0.25)]'
    },
    gridPosition: { col: 2, row: 5 }
  }
];

export const LIFECYCLE_PHASES: LifecyclePhase[] = [
  {
    id: 'hire',
    name: '1. Hire',
    order: 1,
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    durationAvg: '14 - 30 Days',
    summary: 'Candidate selection, offer letter generation, digital acceptance, and pre-hire record creation in HRcore.',
    description: 'The foundation of the employee relationship. Captures applicant credentials, generates standardized employment contracts, triggers pre-employment compliance screenings, and initializes the central employee record.',
    primarySystems: ['myhr_portal', 'hr_services_admin'],
    secondarySystems: ['onboarding_app'],
    keyMilestones: [
      {
        title: 'Offer Generation & Approval',
        system: 'MyHR Portal',
        isAutomated: true,
        slaHours: 4,
        description: 'Recruiter submits salary and grade; system validates against compensation bands and routes for director e-sign.'
      },
      {
        title: 'Candidate E-Signature & Data Capture',
        system: 'HR Services Admin',
        isAutomated: true,
        slaHours: 24,
        description: 'Candidate reviews offer on secure portal, signs contract, and uploads preliminary tax/identification documents.'
      },
      {
        title: 'Pre-Hire Profile Creation',
        system: 'MyHR Portal (HRcore)',
        isAutomated: true,
        slaHours: 1,
        description: 'HRcore generates unique Global Employee ID and initiates downstream data synchronization queues.'
      }
    ],
    kpis: [
      { label: 'Time to Offer Acceptance', value: '3.4 Days', benchmark: '4.5 Days', status: 'good' },
      { label: 'Contract E-sign Rate', value: '98.2%', benchmark: '95.0%', status: 'good' },
      { label: 'Offer Fall-through Rate', value: '4.1%', benchmark: '6.0%', status: 'good' }
    ],
    painPoints: [
      'Manual verification of international degree credentials and work permits',
      'Delayed background check responses in specific regulated jurisdictions'
    ],
    bestPractices: [
      'Automated compensation matrix validation within MyHR Portal',
      'Instant trigger to pre-boarding app upon contract signing'
    ]
  },
  {
    id: 'onboard',
    name: '2. Onboard',
    order: 2,
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    durationAvg: 'Day -14 to Day 90',
    summary: 'Pre-boarding engagement, automated identity/hardware provisioning, Day 1 orientation, and 90-day ramp-up.',
    description: 'Transforms a new hire into an engaged, productive team member. Coordinates IT hardware delivery, system credentials, buddy introduction, team welcoming, and mandatory compliance learning.',
    primarySystems: ['onboarding_app', 'oneid_itsp', 'myhr_portal'],
    secondarySystems: ['learnhub_trainm', 'hr_reporting_pbi'],
    keyMilestones: [
      {
        title: 'Pre-Boarding Tasks & Welcome Hub',
        system: 'Onboarding App',
        isAutomated: true,
        slaHours: 24,
        description: 'New hire completes profile photo, bio, emergency contacts, and selects hardware preferences.'
      },
      {
        title: 'Automated Identity & Hardware Dispatch',
        system: 'OneID & ITSP',
        isAutomated: true,
        slaHours: 48,
        description: 'OneIDM provisions corporate email and Active Directory; ITSP dispatches pre-configured laptop to home address.'
      },
      {
        title: 'Day 1 System Access & Buddy Sync',
        system: 'Onboarding App / MyHR Portal',
        isAutomated: true,
        slaHours: 2,
        description: 'Single sign-on active; new hire meets designated onboarding mentor and attends interactive orientation.'
      },
      {
        title: 'Mandatory Compliance Curriculum',
        system: 'LearnHUB (TrainM)',
        isAutomated: true,
        slaHours: 72,
        description: 'Automated enrollment into Cybersecurity, Safety, and Corporate Integrity training paths.'
      }
    ],
    kpis: [
      { label: 'Day-1 IT Readiness', value: '99.4%', benchmark: '98.0%', status: 'good' },
      { label: '30-Day Onboarding Satisfaction', value: '94.6%', benchmark: '90.0%', status: 'good' },
      { label: 'Avg Time to 1st Contribution', value: '16.2 Days', benchmark: '21.0 Days', status: 'good' }
    ],
    painPoints: [
      'Logistics delivery delays for remote hardware shipments across customs borders',
      'Information overload during the initial 48 hours of orientation'
    ],
    bestPractices: [
      'Micro-learning bite-sized modules in LearnHUB during week 1',
      'Continuous pulse check surveys at Day 7, Day 30, and Day 90 logged into Power BI'
    ]
  },
  {
    id: 'develop',
    name: '3. Develop',
    order: 3,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    durationAvg: 'Continuous (Quarterly Cycles)',
    summary: 'Skill assessment, competency mapping, personalized learning paths, and leadership acceleration.',
    description: 'Empowers continuous professional growth. Leverages Competence Management (CptM) to identify skill gaps, assigns courses through LearnHUB, and elevates high-potential talent via the HR Academy.',
    primarySystems: ['learnhub_trainm', 'cptm_competence', 'hr_academy'],
    secondarySystems: ['myhr_portal', 'hr_reporting_pbi'],
    keyMilestones: [
      {
        title: 'Competence Assessment & Gap Radar',
        system: 'Competence Management (CptM)',
        isAutomated: false,
        slaHours: 120,
        description: 'Employee and manager assess current proficiency vs target job profile to generate personalized learning index.'
      },
      {
        title: 'Adaptive Learning Path Assignment',
        system: 'LearnHUB (TrainM)',
        isAutomated: true,
        slaHours: 6,
        description: 'AI recommendation engine maps identified skill gaps to interactive courses, certifications, and workshops.'
      },
      {
        title: 'Leadership Academy Nomination',
        system: 'HR Academy',
        isAutomated: false,
        slaHours: 48,
        description: 'Top performers and emerging leads are invited to cohort-based executive accelerator programs.'
      }
    ],
    kpis: [
      { label: 'Avg Training Hours / Year', value: '38.4 hrs', benchmark: '32.0 hrs', status: 'good' },
      { label: 'Critical Skill Coverage', value: '87.6%', benchmark: '85.0%', status: 'good' },
      { label: 'Internal Promotion Rate', value: '68.2%', benchmark: '60.0%', status: 'good' }
    ],
    painPoints: [
      'Balancing day-to-day operational deadlines with dedicated learning time',
      'Keeping skills taxonomy synchronized with emerging tech (GenAI, Cloud native)'
    ],
    bestPractices: [
      'Dedicated monthly learning Fridays sponsored by leadership',
      'Direct synchronization of LearnHUB credentials into CptM talent profiles'
    ]
  },
  {
    id: 'retain',
    name: '4. Retain',
    order: 4,
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    durationAvg: 'Continuous (Annual Review)',
    summary: 'Competitive benefits, career mobility, engagement monitoring, and retention risk mitigation.',
    description: 'Maximizes workforce retention and engagement. Integrates HR Services administration for benefits and compensation with Power BI predictive workforce analytics to identify retention risks early.',
    primarySystems: ['myhr_portal', 'hr_services_admin', 'hr_reporting_pbi'],
    secondarySystems: ['cptm_competence'],
    keyMilestones: [
      {
        title: 'Annual Total Rewards & Merit Review',
        system: 'HR Services Admin / MyHR Portal',
        isAutomated: true,
        slaHours: 72,
        description: 'Automated calculation of market benchmark adjustments, bonuses, and equity grants.'
      },
      {
        title: 'Internal Talent Mobility Matching',
        system: 'Competence Management (CptM)',
        isAutomated: true,
        slaHours: 12,
        description: 'Cross-department project staffing and internal job openings automatically matched to employee skills.'
      },
      {
        title: 'Workforce Retention Risk Telemetry',
        system: 'HR Reporting (Power BI)',
        isAutomated: true,
        slaHours: 24,
        description: 'Predictive ML model highlights flight risk factors (tenure, time-since-promotion, compensation delta) for HR Business Partners.'
      }
    ],
    kpis: [
      { label: 'Voluntary Turnover Rate', value: '5.8%', benchmark: '8.5%', status: 'good' },
      { label: 'Employee Net Promoter (eNPS)', value: '+54', benchmark: '+40', status: 'good' },
      { label: 'Internal Mobility Fill Rate', value: '42.8%', benchmark: '35.0%', status: 'good' }
    ],
    painPoints: [
      'Cross-border compensation equity across high-inflation regions',
      'Manager engagement variance across business units'
    ],
    bestPractices: [
      'Proactive stay interviews for critical skill holders flagged by Power BI',
      'Dynamic flexibility in fringe benefits selection via MyHR Portal'
    ]
  },
  {
    id: 'transition',
    name: '5. Transition',
    order: 5,
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    durationAvg: '14 - 30 Days',
    summary: 'Separation notice, knowledge transfer, automated access revocation, hardware return, and alumni integration.',
    description: 'Ensures compliant, respectful, and security-hardened employee offboarding. Automates immediate access shutdown in OneID upon last day, settles payroll in HR Services, and conducts analytics on exit insights.',
    primarySystems: ['myhr_portal', 'oneid_itsp', 'hr_services_admin'],
    secondarySystems: ['hr_reporting_pbi'],
    keyMilestones: [
      {
        title: 'Resignation / Retirement Initiation',
        system: 'MyHR Portal',
        isAutomated: true,
        slaHours: 2,
        description: 'Initiates workflow with manager acknowledgment and triggers exit task checklists.'
      },
      {
        title: 'Automated Identity Deprovisioning',
        system: 'OneID & ITSP',
        isAutomated: true,
        slaHours: 1,
        description: 'SCIM 2.0 command locks SSO accounts, revokes VPN and email access, and generates prepaid hardware return label.'
      },
      {
        title: 'Final Settlement & Tax Clearance',
        system: 'HR Services Admin',
        isAutomated: true,
        slaHours: 48,
        description: 'Calculates accrued vacation payouts, severance calculations, and issues official reference letters.'
      },
      {
        title: 'Exit Analytics & Alumni Network Invite',
        system: 'HR Reporting (Power BI)',
        isAutomated: true,
        slaHours: 24,
        description: 'Aggregates confidential exit survey feedback into Power BI turnover sentiment models.'
      }
    ],
    kpis: [
      { label: 'Zero-Day Access Revocation', value: '100.0%', benchmark: '100.0%', status: 'good' },
      { label: 'Hardware Recovery Rate', value: '97.4%', benchmark: '92.0%', status: 'good' },
      { label: 'Exit Survey Participation', value: '88.5%', benchmark: '80.0%', status: 'good' }
    ],
    painPoints: [
      'Manual knowledge transfer documentation before final departure date',
      'Tracking hardware return status for remote international employees'
    ],
    bestPractices: [
      'Automated reminder triggers for team knowledge handovers 10 days prior',
      'OneID immediate credential lockout at 18:00 on the contractual separation date'
    ]
  }
];

export const PROCESS_SIMULATION_SCENARIOS: ProcessSimulationScenario[] = [
  {
    id: 'scenario_new_hire',
    title: 'Scenario A: Global Software Architect New Hire',
    lifecycleStage: 'onboard',
    description: 'Simulates the complete pre-boarding through Day 1 provisioning flow for a newly hired Senior Software Architect in Berlin.',
    triggerEvent: 'Offer signed by candidate in MyHR Portal',
    actor: 'Candidate: Dr. Elena Fischer',
    durationEstimated: '48 Hours Simulated',
    steps: [
      {
        stepNumber: 1,
        title: 'Contract Acceptance & Event Publish',
        sourceSystemId: 'employee',
        targetSystemId: 'myhr_portal',
        actionDescription: 'Elena e-signs employment contract. MyHR Portal generates Global ID #884920 and publishes Event: NewHire.Confirmed.',
        protocol: 'Kafka Event Bus (JSON)',
        payloadSample: {
          event: 'NewHire.Confirmed',
          employeeId: '884920',
          fullName: 'Dr. Elena Fischer',
          department: 'Automotive Cloud AI',
          startDate: '2026-09-01',
          workLocation: 'DE-BER-01'
        },
        statusDelayMs: 600,
        stateChange: 'Record status set to PRE_HIRE_ACTIVE in HRcore'
      },
      {
        stepNumber: 2,
        title: 'Onboarding Dossier Creation',
        sourceSystemId: 'myhr_portal',
        targetSystemId: 'onboarding_app',
        actionDescription: 'MyHR Portal pushes employee metadata to Onboarding App to generate pre-boarding checklist and welcome hub access.',
        protocol: 'REST API POST /v2/onboarding/dossiers',
        payloadSample: {
          dossierId: 'DOS-2026-9932',
          employeeId: '884920',
          assignedBuddy: 'Marcus Vance (VP Cloud)',
          checklistTemplates: ['DEV_SR_ARCHITECT_KIT', 'EU_COMPLIANCE_TIER1']
        },
        statusDelayMs: 700,
        stateChange: 'Welcome email with secure magic link dispatched to Elena'
      },
      {
        stepNumber: 3,
        title: 'OneID Identity & IT Hardware Trigger',
        sourceSystemId: 'onboarding_app',
        targetSystemId: 'oneid_itsp',
        actionDescription: 'Onboarding App invokes OneID SCIM 2.0 endpoint to provision user account, email alias (elena.fischer@company.com), and ship MacBook Pro M4.',
        protocol: 'SCIM 2.0 / REST API',
        payloadSample: {
          userName: 'fischer_elena_884920',
          email: 'elena.fischer@company.com',
          groups: ['cloud-architects-eu', 'git-enterprise-committers', 'aws-prod-readonly'],
          hardwarePackageId: 'HW-DE-MACBOOK-PRO-32GB',
          shippingAddress: 'Kantstrasse 42, 10625 Berlin'
        },
        statusDelayMs: 900,
        stateChange: 'Active Directory account staged; DHL tracking number generated'
      },
      {
        stepNumber: 4,
        title: 'Compliance Learning Curriculum Staging',
        sourceSystemId: 'myhr_portal',
        targetSystemId: 'learnhub_trainm',
        actionDescription: 'LearnHUB automatically enrolls Elena into statutory courses: Cyber Security 2026, GDPR Data Handling, and Cloud Architecture Standards.',
        protocol: 'OData v4 Event Sync',
        payloadSample: {
          employeeId: '884920',
          mandatoryCourses: ['SEC-101', 'GDPR-202', 'ARCH-301'],
          dueDate: '2026-09-14'
        },
        statusDelayMs: 650,
        stateChange: '3 courses assigned with calendar sync in Outlook'
      },
      {
        stepNumber: 5,
        title: 'Reporting Metric Ingestion',
        sourceSystemId: 'onboarding_app',
        targetSystemId: 'hr_reporting_pbi',
        actionDescription: 'Onboarding telemetry pushes SLA timestamp (Time from Offer to Provision: 18m). Power BI updates live Onboarding SLA dashboard.',
        protocol: 'Power BI REST Streaming API',
        payloadSample: {
          metric: 'Onboarding.ProvisioningLatencyMinutes',
          value: 18,
          status: 'SUCCESS_AHEAD_OF_SLA',
          unit: 'Automotive Cloud AI'
        },
        statusDelayMs: 500,
        stateChange: 'Power BI KPI refreshed (+1 successful zero-touch onboarding)'
      }
    ]
  },
  {
    id: 'scenario_leadership_promo',
    title: 'Scenario B: Senior Engineer Promotion to Leadership Track',
    lifecycleStage: 'develop',
    description: 'Simulates the promotion of a high-performing engineer into Engineering Manager, involving Competence Management (CptM) and the HR Academy.',
    triggerEvent: 'Manager submits promotion nomination in MyHR Portal',
    actor: 'Employee: Alex Chen (Staff Engineer)',
    durationEstimated: '5 Steps Simulated',
    steps: [
      {
        stepNumber: 1,
        title: 'Promotion Proposal & Org Re-assignment',
        sourceSystemId: 'myhr_portal',
        targetSystemId: 'hr_services_admin',
        actionDescription: 'MyHR Portal forwards approved promotion request to HR Services Admin for title update and compensation tier adjustment.',
        protocol: 'REST API POST /api/v1/promotions/process',
        payloadSample: {
          employeeId: '710492',
          oldTitle: 'Staff Software Engineer (Grade T7)',
          newTitle: 'Engineering Manager (Grade M1)',
          salaryIncreasePercent: 14.5,
          effectiveDate: '2026-10-01'
        },
        statusDelayMs: 700,
        stateChange: 'Contract amendment queued and digital addendum generated'
      },
      {
        stepNumber: 2,
        title: 'Competency Framework Target Update',
        sourceSystemId: 'myhr_portal',
        targetSystemId: 'cptm_competence',
        actionDescription: 'CptM updates Alex\'s target job profile from Technical Individual Contributor to Engineering Leadership.',
        protocol: 'GraphQL Mutation updateTargetProfile',
        payloadSample: {
          employeeId: '710492',
          targetProfile: 'ENG_LEAD_M1',
          requiredCompetencies: [
            { skill: 'People Coaching', targetProficiency: 4 },
            { skill: 'Strategic Roadmap Planning', targetProficiency: 4 },
            { skill: 'Budget & Headcount Management', targetProficiency: 3 }
          ]
        },
        statusDelayMs: 800,
        stateChange: 'Skill Gap Radar highlights 2 development priorities'
      },
      {
        stepNumber: 3,
        title: 'HR Academy Executive Cohort Enrollment',
        sourceSystemId: 'cptm_competence',
        targetSystemId: 'hr_academy',
        actionDescription: 'CptM gap score triggers automated nomination to the HR Academy "Emerging Leaders Program (ELP-2026-Q4)".',
        protocol: 'REST API POST /v1/cohorts/nominations',
        payloadSample: {
          cohortCode: 'ELP-2026-Q4',
          candidateId: '710492',
          mentorAssigned: 'Dr. Katharina Meier (VP Global R&D)',
          coachingHoursAllocated: 24
        },
        statusDelayMs: 850,
        stateChange: 'Academy portal credentials issued; 360-degree assessment launched'
      },
      {
        stepNumber: 4,
        title: 'LMS Specialized Leadership Catalog Access',
        sourceSystemId: 'hr_academy',
        targetSystemId: 'learnhub_trainm',
        actionDescription: 'LearnHUB unlocks executive management content library, OKR masterclass, and inclusive leadership simulators.',
        protocol: 'xAPI / SCORM Integration',
        payloadSample: {
          unlockedTracks: ['LEAD-401-PEOPLE', 'FIN-302-BUDGETING', 'HR-501-TALENT-STRATEGY']
        },
        statusDelayMs: 600,
        stateChange: 'Learning dashboard transformed to Management Track view'
      },
      {
        stepNumber: 5,
        title: 'Succession & Leadership Pipeline Analytics Update',
        sourceSystemId: 'hr_academy',
        targetSystemId: 'hr_reporting_pbi',
        actionDescription: 'Power BI records new qualified successor in Engineering division, reducing key-person talent risk index.',
        protocol: 'DirectQuery Semantic Sync',
        payloadSample: {
          department: 'Enterprise AI & Platform',
          leadershipReadinessIndex: '+3.2%',
          successionBenchStrength: 'STRONG (Ratio 2.4:1)'
        },
        statusDelayMs: 500,
        stateChange: 'Power BI Leadership Readiness Gauge updated in real-time'
      }
    ]
  },
  {
    id: 'scenario_transition_offboarding',
    title: 'Scenario C: Compliant Security Offboarding & Transition',
    lifecycleStage: 'transition',
    description: 'Simulates the zero-day security deprovisioning, knowledge handover, asset return, and final settlement flow.',
    triggerEvent: 'Employee initiates resignation in MyHR Portal',
    actor: 'Employee: David Miller (Senior DevOps)',
    durationEstimated: '4 Steps Simulated',
    steps: [
      {
        stepNumber: 1,
        title: 'Resignation Notice & Transition Workflow Trigger',
        sourceSystemId: 'employee',
        targetSystemId: 'myhr_portal',
        actionDescription: 'David submits resignation with 30-day notice. Manager acknowledges and initiates departure clearance workflow.',
        protocol: 'REST API POST /api/offboarding/initiate',
        payloadSample: {
          employeeId: '552190',
          departureDate: '2026-09-30',
          reason: 'Career Opportunity - External',
          status: 'OFFBOARDING_SCHEDULED'
        },
        statusDelayMs: 650,
        stateChange: 'Offboarding task checklist dispatched to Manager and IT'
      },
      {
        stepNumber: 2,
        title: 'Settlement & Leave Balance Reconciliation',
        sourceSystemId: 'myhr_portal',
        targetSystemId: 'hr_services_admin',
        actionDescription: 'HR Services Admin audits remaining paid time off (PTO: 4.5 days) and schedules final payroll calculation.',
        protocol: 'Secure SFTP / Payroll OData',
        payloadSample: {
          employeeId: '552190',
          unusedPtoDays: 4.5,
          severanceApplicable: false,
          finalPaymentDate: '2026-09-30'
        },
        statusDelayMs: 750,
        stateChange: 'Final payroll run locked in SAP Payroll interface'
      },
      {
        stepNumber: 3,
        title: 'OneID Automated Zero-Day Access Lockout',
        sourceSystemId: 'hr_services_admin',
        targetSystemId: 'oneid_itsp',
        actionDescription: 'OneID executes automated scheduled kill-switch at 18:00 CET on final day: revokes OAuth tokens, terminates Active Directory, and locks laptop.',
        protocol: 'SCIM 2.0 DELETE /Users/552190',
        payloadSample: {
          action: 'REVOKE_ALL_ACCESS',
          userId: '552190',
          revokedTokensCount: 14,
          returnLabelCreated: true,
          trackingNumber: 'DHL-EXPRESS-RET-991204'
        },
        statusDelayMs: 900,
        stateChange: 'Zero credentials remaining; system audit log cryptographically signed'
      },
      {
        stepNumber: 4,
        title: 'Exit Telemetry & Turnover Sentiment Analysis',
        sourceSystemId: 'myhr_portal',
        targetSystemId: 'hr_reporting_pbi',
        actionDescription: 'Confidential exit survey responses fed into Power BI NLP model to analyze department turnover driver factors.',
        protocol: 'Power BI REST Ingestion',
        payloadSample: {
          department: 'Cloud Platform DevOps',
          primaryExitDriver: 'Compensation & Growth',
          recommendCompanyScore: 8,
          alumniNetworkEnrolled: true
        },
        statusDelayMs: 550,
        stateChange: 'Power BI Turnover & Retention insights updated'
      }
    ]
  }
];

export const SAMPLE_EMPLOYEES: EmployeeJourneyPersona[] = [
  {
    id: 'emp_elena',
    name: 'Dr. Elena Fischer',
    role: 'Staff Cloud Solutions Architect',
    department: 'Automotive Software & Cloud AI',
    location: 'Berlin, Germany',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinDate: '2026-09-01',
    currentStage: 'onboard',
    currentProgress: 65,
    historyLog: [
      { timestamp: '2026-08-10 09:30', stage: 'hire', system: 'MyHR Portal', event: 'Offer letter generated and sent', status: 'completed' },
      { timestamp: '2026-08-11 14:15', stage: 'hire', system: 'HR Services Admin', event: 'Employment contract e-signed by candidate', status: 'completed' },
      { timestamp: '2026-08-12 10:00', stage: 'onboard', system: 'Onboarding App', event: 'Welcome hub activated & bio uploaded', status: 'completed' },
      { timestamp: '2026-08-14 16:40', stage: 'onboard', system: 'OneID & ITSP', event: 'Active Directory & MacBook Pro dispatched', status: 'completed' },
      { timestamp: '2026-08-17 11:20', stage: 'onboard', system: 'LearnHUB', event: 'Cybersecurity & GDPR compliance in progress', status: 'in_progress' }
    ]
  },
  {
    id: 'emp_alex',
    name: 'Alex Chen',
    role: 'Engineering Manager (Former Staff Eng)',
    department: 'Autonomous Mobility Systems',
    location: 'Stuttgart, Germany',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinDate: '2023-03-15',
    currentStage: 'develop',
    currentProgress: 80,
    historyLog: [
      { timestamp: '2023-03-15', stage: 'onboard', system: 'Onboarding App', event: 'Completed 90-day engineering ramp-up', status: 'completed' },
      { timestamp: '2025-06-20', stage: 'develop', system: 'Competence Management', event: 'Achieved Level 5 in Distributed Cloud Computing', status: 'completed' },
      { timestamp: '2026-07-01', stage: 'develop', system: 'HR Academy', event: 'Enrolled in Executive Leadership Acceleration Track', status: 'in_progress' },
      { timestamp: '2026-08-01', stage: 'retain', system: 'MyHR Portal', event: 'Promoted to Engineering Manager (M1)', status: 'completed' }
    ]
  },
  {
    id: 'emp_sarah',
    name: 'Sarah Jenkins',
    role: 'Senior People Analytics Partner',
    department: 'Corporate HR & Workforce Strategy',
    location: 'Chicago, United States',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinDate: '2022-01-10',
    currentStage: 'retain',
    currentProgress: 95,
    historyLog: [
      { timestamp: '2022-01-10', stage: 'hire', system: 'MyHR Portal', event: 'Joined HR Shared Services Chicago', status: 'completed' },
      { timestamp: '2024-04-12', stage: 'develop', system: 'LearnHUB', event: 'Power BI Advanced Data Modeling Certification', status: 'completed' },
      { timestamp: '2025-11-05', stage: 'retain', system: 'Competence Management', event: 'Key talent retention stay interview completed', status: 'completed' },
      { timestamp: '2026-06-30', stage: 'retain', system: 'HR Reporting', event: 'Designed Enterprise HR Process Architecture Dashboard', status: 'completed' }
    ]
  }
];

export const WORKFORCE_ANALYTICS_METRICS: AnalyticsMetric[] = [
  {
    id: 'm1',
    label: 'Total Active Headcount',
    value: '142,850',
    changePercent: 4.2,
    isPositive: true,
    timeframe: 'vs last year',
    category: 'workforce'
  },
  {
    id: 'm2',
    label: 'Avg Onboarding SLA (Days)',
    value: '16.2',
    changePercent: -18.5,
    isPositive: true, // Lower is better
    timeframe: 'vs industry 21.0d',
    category: 'onboarding'
  },
  {
    id: 'm3',
    label: 'Critical Skill Coverage',
    value: '87.6%',
    changePercent: 5.4,
    isPositive: true,
    timeframe: 'vs target 85.0%',
    category: 'learning'
  },
  {
    id: 'm4',
    label: 'Zero-Touch IT Provisioning',
    value: '99.4%',
    changePercent: 2.1,
    isPositive: true,
    timeframe: 'Day-1 readiness rate',
    category: 'system'
  },
  {
    id: 'm5',
    label: 'Annual Retention Rate',
    value: '94.2%',
    changePercent: 1.8,
    isPositive: true,
    timeframe: 'Voluntary turnover 5.8%',
    category: 'workforce'
  },
  {
    id: 'm6',
    label: 'Cross-System API Health',
    value: '99.96%',
    changePercent: 0.04,
    isPositive: true,
    timeframe: 'Mean Latency 46ms',
    category: 'system'
  }
];

export const MONTHLY_LIFECYCLE_VOLUME = [
  { month: 'Jan', newHires: 1240, onloaded: 1180, trainingCompletions: 4800, promotions: 320, transitions: 180 },
  { month: 'Feb', newHires: 1420, onloaded: 1390, trainingCompletions: 5200, promotions: 380, transitions: 195 },
  { month: 'Mar', newHires: 1850, onloaded: 1780, trainingCompletions: 6400, promotions: 450, transitions: 210 },
  { month: 'Apr', newHires: 1620, onloaded: 1590, trainingCompletions: 5900, promotions: 410, transitions: 205 },
  { month: 'May', newHires: 1780, onloaded: 1740, trainingCompletions: 6800, promotions: 490, transitions: 220 },
  { month: 'Jun', newHires: 2100, onloaded: 2040, trainingCompletions: 7600, promotions: 540, transitions: 240 },
  { month: 'Jul', newHires: 1950, onloaded: 1910, trainingCompletions: 7200, promotions: 510, transitions: 230 },
  { month: 'Aug', newHires: 2280, onloaded: 2210, trainingCompletions: 8400, promotions: 580, transitions: 250 }
];

export const COMPETENCY_GAP_BY_DIVISION = [
  { division: 'Automotive AI', targetLevel: 94, actualLevel: 88, gap: 6, certifiedRatio: 92 },
  { division: 'Cloud & DevOps', targetLevel: 92, actualLevel: 89, gap: 3, certifiedRatio: 95 },
  { division: 'Hardware R&D', targetLevel: 88, actualLevel: 84, gap: 4, certifiedRatio: 88 },
  { division: 'HR & People Ops', targetLevel: 90, actualLevel: 87, gap: 3, certifiedRatio: 94 },
  { division: 'Global Supply Chain', targetLevel: 85, actualLevel: 78, gap: 7, certifiedRatio: 82 },
  { division: 'Sales & Marketing', targetLevel: 86, actualLevel: 83, gap: 3, certifiedRatio: 89 }
];

export const PLATFORM_API_TRAFFIC_DATA = [
  { platform: 'MyHR (HRcore)', requestsPerMin: 42500, avgLatencyMs: 45, errorRatePercent: 0.02 },
  { platform: 'OneID & ITSP', requestsPerMin: 38200, avgLatencyMs: 32, errorRatePercent: 0.01 },
  { platform: 'LearnHUB LMS', requestsPerMin: 29400, avgLatencyMs: 54, errorRatePercent: 0.04 },
  { platform: 'HR Services', requestsPerMin: 21100, avgLatencyMs: 40, errorRatePercent: 0.03 },
  { platform: 'CptM Matrix', requestsPerMin: 14800, avgLatencyMs: 78, errorRatePercent: 0.05 },
  { platform: 'Onboarding App', requestsPerMin: 9800, avgLatencyMs: 62, errorRatePercent: 0.02 },
  { platform: 'Power BI Feeds', requestsPerMin: 8600, avgLatencyMs: 120, errorRatePercent: 0.01 }
];
