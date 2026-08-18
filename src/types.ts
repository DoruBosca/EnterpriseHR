export type LifecycleStageId = 'hire' | 'onboard' | 'develop' | 'retain' | 'transition';

export type UserPersona = 'Employee' | 'HR Specialist' | 'HR Director' | 'IT & Security Admin' | 'System Architect';

export interface SystemNode {
  id: string;
  name: string;
  shortName: string;
  code: string;
  layer: 'employee' | 'portal' | 'applications' | 'infrastructure' | 'analytics';
  category: 'Portal & Gateway' | 'Onboarding & Identity' | 'Learning & Growth' | 'Operations & Administration' | 'Analytics & BI';
  description: string;
  executiveSummary: string;
  keyFeatures: string[];
  ownerDepartment: string;
  techStack: string;
  protocols: string[];
  managedEntities: string[];
  upstreamSystems: string[];
  downstreamSystems: string[];
  supportedLifecycleStages: LifecycleStageId[];
  sla: {
    targetUptime: string;
    avgLatency: string;
    status: 'Operational' | 'Degraded' | 'Maintenance';
    availability: number;
    activeUsersToday: number;
  };
  iconName: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    badge: string;
    glow: string;
  };
  gridPosition: {
    col: number;
    row: number;
  };
}

export interface LifecyclePhase {
  id: LifecycleStageId;
  name: string;
  order: number;
  badgeColor: string;
  durationAvg: string;
  summary: string;
  description: string;
  primarySystems: string[];
  secondarySystems: string[];
  keyMilestones: {
    title: string;
    system: string;
    isAutomated: boolean;
    slaHours: number;
    description: string;
  }[];
  kpis: {
    label: string;
    value: string;
    benchmark: string;
    status: 'good' | 'warning' | 'neutral';
  }[];
  painPoints: string[];
  bestPractices: string[];
}

export interface ProcessSimulationScenario {
  id: string;
  title: string;
  lifecycleStage: LifecycleStageId;
  description: string;
  triggerEvent: string;
  actor: string;
  durationEstimated: string;
  steps: {
    stepNumber: number;
    title: string;
    sourceSystemId: string;
    targetSystemId: string;
    actionDescription: string;
    protocol: string;
    payloadSample: Record<string, any>;
    statusDelayMs: number;
    stateChange: string;
  }[];
}

export interface EmployeeJourneyPersona {
  id: string;
  name: string;
  role: string;
  department: string;
  location: string;
  avatarUrl: string;
  joinDate: string;
  currentStage: LifecycleStageId;
  currentProgress: number; // 0 to 100
  historyLog: {
    timestamp: string;
    stage: LifecycleStageId;
    system: string;
    event: string;
    status: 'completed' | 'in_progress' | 'pending';
  }[];
}

export interface AnalyticsMetric {
  id: string;
  label: string;
  value: string | number;
  changePercent: number;
  isPositive: boolean;
  timeframe: string;
  category: 'workforce' | 'onboarding' | 'learning' | 'operations' | 'system';
}
