import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Compass, 
  UserCheck, 
  ShieldCheck, 
  BookOpen, 
  Target, 
  Award, 
  Briefcase, 
  BarChart3, 
  ArrowDown, 
  Activity, 
  Zap, 
  Search, 
  SlidersHorizontal,
  Info, 
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Flame,
  Thermometer,
  HelpCircle,
  TrendingUp,
  Workflow,
  CheckCircle2
} from 'lucide-react';
import { SystemNode, LifecycleStageId, UserPersona } from '../types';
import { LIFECYCLE_PHASES } from '../data/hrArchitectureData';

interface ArchitectureDiagramProps {
  systems: SystemNode[];
  selectedNode: SystemNode | null;
  onSelectNode: (node: SystemNode) => void;
  selectedLifecycleFilter: LifecycleStageId | 'all';
  currentPersona: UserPersona;
  onSimulateScenario: (scenarioId: string) => void;
  onSelectLifecycleFilter?: (stage: LifecycleStageId | 'all') => void;
}

export type HeatTier = 'extreme' | 'high' | 'moderate' | 'low' | 'cold';

export interface SystemHeatInfo {
  score: number; // 0 - 100
  tier: HeatTier;
  roleInPhase: string;
  isPrimary: boolean;
  isSecondary: boolean;
  isSupported: boolean;
  heatLabel: string;
  transactionLoad: string;
  activeUsersStage: string;
  badgeStyle: string;
  glowStyle: string;
  borderStyle: string;
  bgGradient: string;
  barGradient: string;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  systems,
  selectedNode,
  onSelectNode,
  selectedLifecycleFilter,
  currentPersona,
  onSimulateScenario,
  onSelectLifecycleFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnimationActive, setIsAnimationActive] = useState(true);
  const [showTechnicalMetrics, setShowTechnicalMetrics] = useState(true);
  
  // Heat Map Overlay state
  const [isHeatmapActive, setIsHeatmapActive] = useState(true);
  const [hideColdSystems, setHideColdSystems] = useState(false);
  const [showHeatmapInfoModal, setShowHeatmapInfoModal] = useState(false);

  // Map icon names to Lucide icons
  const renderIcon = (name: string, className = "w-5 h-5") => {
    switch (name) {
      case 'Users': return <Users className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'UserCheck': return <UserCheck className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Target': return <Target className={className} />;
      case 'Award': return <Award className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'BarChart3': return <BarChart3 className={className} />;
      default: return <Activity className={className} />;
    }
  };

  // Helper to find system by id
  const getSystem = (id: string) => systems.find(s => s.id === id);

  // Get active lifecycle phase metadata
  const currentPhaseMeta = useMemo(() => {
    if (selectedLifecycleFilter === 'all') return null;
    return LIFECYCLE_PHASES.find(p => p.id === selectedLifecycleFilter) || null;
  }, [selectedLifecycleFilter]);

  // Compute Heat Map info for a system based on selectedLifecycleFilter & SYSTEM_NODES data
  const getSystemHeat = (system: SystemNode): SystemHeatInfo => {
    const isSupported = system.supportedLifecycleStages.includes(
      selectedLifecycleFilter === 'all' ? 'onboard' : selectedLifecycleFilter
    );

    // If ALL stages selected: calculate total lifecycle footprint & enterprise core load
    if (selectedLifecycleFilter === 'all') {
      const coverageCount = system.supportedLifecycleStages.length;
      let score = 50;
      let role = 'Enterprise Lifecycle Participant';
      let load = '12.4k ops/hr';

      if (system.id === 'myhr_portal') {
        score = 100;
        role = 'Central Enterprise Spine & Master SSO Gateway (All 5 Stages)';
        load = '98.4k req/hr';
      } else if (system.id === 'employee') {
        score = 98;
        role = 'Primary Self-Service User Gateway (All 5 Stages)';
        load = '142.8k active/day';
      } else if (system.id === 'hr_services_admin') {
        score = 92;
        role = 'Transactional Operations & Payroll Interface (All 5 Stages)';
        load = '48.6k events/hr';
      } else if (system.id === 'hr_reporting_pbi') {
        score = 88;
        role = 'Convergent Workforce Analytics & Lakehouse ETL (All 5 Stages)';
        load = '12.4k query/hr';
      } else if (system.id === 'oneid_itsp') {
        score = 78;
        role = 'Identity & Access Management Engine (3 Stages: Onboard, Retain, Transition)';
        load = '24.1k scim/hr';
      } else if (system.id === 'learnhub_trainm') {
        score = 75;
        role = 'Enterprise LMS & Certification Engine (3 Stages: Onboard, Develop, Retain)';
        load = '18.3k completions/mo';
      } else if (system.id === 'onboarding_app') {
        score = 68;
        role = 'New Hire Pre-Boarding & Day 1-90 Hub (2 Stages: Hire, Onboard)';
        load = '4.1k dossiers/mo';
      } else if (system.id === 'cptm_competence') {
        score = 64;
        role = 'Skills Taxonomy & Talent Mobility Matrix (2 Stages: Develop, Retain)';
        load = '8.9k profile evals/mo';
      } else if (system.id === 'hr_academy') {
        score = 58;
        role = 'Executive Leadership Acceleration Academy (2 Stages: Develop, Retain)';
        load = '3.2k cohort sessions/mo';
      }

      return {
        score,
        tier: score >= 90 ? 'extreme' : score >= 75 ? 'high' : score >= 50 ? 'moderate' : 'low',
        roleInPhase: role,
        isPrimary: score >= 85,
        isSecondary: score >= 65 && score < 85,
        isSupported: true,
        heatLabel: `🔥 Lifecycle Coverage: ${coverageCount}/5 Stages (${score}%)`,
        transactionLoad: load,
        activeUsersStage: `${(system.sla.activeUsersToday / 1000).toFixed(1)}k users`,
        badgeStyle: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        glowStyle: 'shadow-[0_0_25px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/50',
        borderStyle: 'border-rose-500/60',
        bgGradient: 'from-rose-500/15 via-amber-500/10 to-transparent',
        barGradient: 'from-amber-400 via-rose-500 to-red-500'
      };
    }

    // Specific Lifecycle Stage selected (hire | onboard | develop | retain | transition)
    const stageId = selectedLifecycleFilter;
    const isStageSupported = system.supportedLifecycleStages.includes(stageId);
    const isPrimary = currentPhaseMeta?.primarySystems.includes(system.id) || false;
    const isSecondary = currentPhaseMeta?.secondarySystems.includes(system.id) || false;

    // Determine Stage-Specific Score, Role & Telemetry
    let score = 0;
    let role = 'Dormant in this lifecycle stage';
    let load = '0 req/hr';
    let tier: HeatTier = 'cold';

    if (!isStageSupported) {
      score = 0;
      tier = 'cold';
      role = `Dormant • Not engaged during ${currentPhaseMeta?.name || stageId}`;
      load = 'Standby (0 ops)';
    } else {
      // Stage: 1. HIRE
      if (stageId === 'hire') {
        if (system.id === 'myhr_portal') {
          score = 98;
          tier = 'extreme';
          role = 'Primary Engine: Requisition Validation, Global Employee ID & Pre-Hire Record';
          load = '18.4k req/hr';
        } else if (system.id === 'hr_services_admin') {
          score = 95;
          tier = 'extreme';
          role = 'Primary Engine: Digital Employment Contracts, E-Sign & Doc Verification';
          load = '14.2k e-sign/hr';
        } else if (system.id === 'employee') {
          score = 90;
          tier = 'high';
          role = 'Candidate Portal: Offer Acceptance, Data Submission & Identity Upload';
          load = '9.8k candidate sessions/hr';
        } else if (system.id === 'onboarding_app') {
          score = 75;
          tier = 'high';
          role = 'Secondary Gateway: Pre-Boarding Queue Creation & Welcome Packet Prep';
          load = '3.5k pre-board tasks/hr';
        } else if (system.id === 'hr_reporting_pbi') {
          score = 45;
          tier = 'low';
          role = 'Telemetry Sink: Time-to-Hire & Offer Acceptance SLA Dashboards';
          load = '1.2k queries/hr';
        }
      } 
      // Stage: 2. ONBOARD
      else if (stageId === 'onboard') {
        if (system.id === 'onboarding_app') {
          score = 99;
          tier = 'extreme';
          role = 'Primary Driver: Day 1-90 Milestone Engine, Buddy Pairing & Checklists';
          load = '28.6k task events/hr';
        } else if (system.id === 'oneid_itsp') {
          score = 97;
          tier = 'extreme';
          role = 'Primary Driver: Zero-Touch SCIM 2.0 Identity & Automated Laptop Dispatch';
          load = '22.1k scim sync/hr';
        } else if (system.id === 'employee') {
          score = 94;
          tier = 'extreme';
          role = 'New Hire Active Hub: Profile Setup, Buddy Sync & Orientation Tasks';
          load = '42.0k interactive events/hr';
        } else if (system.id === 'myhr_portal') {
          score = 88;
          tier = 'high';
          role = 'Master Backbone: Personnel Sync, SSO Gateway & Org Hierarchy';
          load = '34.5k api req/hr';
        } else if (system.id === 'learnhub_trainm') {
          score = 80;
          tier = 'high';
          role = 'Secondary Driver: Mandatory Statutory Compliance & Cyber Certification';
          load = '14.2k enrollments/hr';
        } else if (system.id === 'hr_services_admin') {
          score = 74;
          tier = 'moderate';
          role = 'Operations: Bank/Payroll Interface Activation & Benefits Enrollment';
          load = '11.8k ticket ops/hr';
        } else if (system.id === 'hr_reporting_pbi') {
          score = 62;
          tier = 'moderate';
          role = 'Analytics: Day-1 IT Readiness & 30-Day New Hire Ramp-Up Telemetry';
          load = '4.5k queries/hr';
        }
      }
      // Stage: 3. DEVELOP
      else if (stageId === 'develop') {
        if (system.id === 'learnhub_trainm') {
          score = 99;
          tier = 'extreme';
          role = 'Primary Engine: AI Course Delivery, Digital Learning Catalog & xAPI Transcripts';
          load = '36.4k lesson runs/hr';
        } else if (system.id === 'cptm_competence') {
          score = 97;
          tier = 'extreme';
          role = 'Primary Engine: Skills Taxonomy Graph, 1-5 Competency Radar & Gap Analysis';
          load = '19.2k skill evals/hr';
        } else if (system.id === 'hr_academy') {
          score = 93;
          tier = 'extreme';
          role = 'Primary Engine: Executive Leadership Cohorts, HiPo Pipelines & 360 Feedback';
          load = '8.4k cohort interactions/hr';
        } else if (system.id === 'employee') {
          score = 88;
          tier = 'high';
          role = 'Active Learner: Development Goals, Course Completion & Skill Self-Assessments';
          load = '26.1k active learning/hr';
        } else if (system.id === 'myhr_portal') {
          score = 76;
          tier = 'high';
          role = 'Secondary Sync: Career Development Records & Performance Sync';
          load = '15.8k records/hr';
        } else if (system.id === 'hr_reporting_pbi') {
          score = 68;
          tier = 'moderate';
          role = 'Secondary Analytics: Critical Skill Coverage & Annual Training Hours BI';
          load = '5.6k queries/hr';
        } else if (system.id === 'hr_services_admin') {
          score = 55;
          tier = 'moderate';
          role = 'Operations Support: Tuition Reimbursement & Education Approvals';
          load = '3.1k tickets/hr';
        }
      }
      // Stage: 4. RETAIN
      else if (stageId === 'retain') {
        if (system.id === 'hr_services_admin') {
          score = 98;
          tier = 'extreme';
          role = 'Primary Driver: Total Rewards, Bonus Allocation, Merit Reviews & Payroll';
          load = '38.2k payroll ops/hr';
        } else if (system.id === 'myhr_portal') {
          score = 95;
          tier = 'extreme';
          role = 'Primary Driver: Role Transfers, Compensation Statement & Manager Reviews';
          load = '41.0k req/hr';
        } else if (system.id === 'hr_reporting_pbi') {
          score = 94;
          tier = 'extreme';
          role = 'Primary Analytics: Predictive Flight-Risk Modeling, eNPS & Turnover Telemetry';
          load = '16.8k model queries/hr';
        } else if (system.id === 'cptm_competence') {
          score = 84;
          tier = 'high';
          role = 'Secondary Driver: Internal Talent Marketplace & Project Staffing AI Match';
          load = '12.5k match ops/hr';
        } else if (system.id === 'employee') {
          score = 88;
          tier = 'high';
          role = 'Workforce Engagement: Rewards Review, Flexible Benefits & Career Mobility';
          load = '32.4k interactions/hr';
        } else if (system.id === 'hr_academy') {
          score = 72;
          tier = 'moderate';
          role = 'Targeted Retention: Senior Leadership Coaching & Executive Mentorship';
          load = '4.2k mentoring hrs/mo';
        } else if (system.id === 'learnhub_trainm') {
          score = 66;
          tier = 'moderate';
          role = 'Continuous Upskilling: Recertifications & Professional Micro-Credentials';
          load = '9.1k completions/hr';
        } else if (system.id === 'oneid_itsp') {
          score = 58;
          tier = 'moderate';
          role = 'Access Updates: Internal Job Transfer Permissions & ABAC Role Changes';
          load = '4.8k access updates/hr';
        }
      }
      // Stage: 5. TRANSITION
      else if (stageId === 'transition') {
        if (system.id === 'oneid_itsp') {
          score = 100;
          tier = 'extreme';
          role = 'Primary Driver: Instant Zero-Day SCIM Account Lockdown & Asset Recovery Return';
          load = '18.9k instant scim ops/hr';
        } else if (system.id === 'hr_services_admin') {
          score = 98;
          tier = 'extreme';
          role = 'Primary Driver: Final Settlement, Accrued Vacation Payouts & Reference Letters';
          load = '22.4k exit files/hr';
        } else if (system.id === 'myhr_portal') {
          score = 92;
          tier = 'extreme';
          role = 'Primary Driver: Resignation Routing, Separation Date Sync & Manager Handover';
          load = '19.5k workflow ops/hr';
        } else if (system.id === 'employee') {
          score = 86;
          tier = 'high';
          role = 'Transitioning User: Exit Survey, Knowledge Handover & Alumni Sign-up';
          load = '8.2k exit events/hr';
        } else if (system.id === 'hr_reporting_pbi') {
          score = 74;
          tier = 'moderate';
          role = 'Secondary Analytics: Exit Sentiment NLP Modeling & Turnover Root Cause';
          load = '6.4k queries/hr';
        }
      }
    }

    // Determine heat styling based on tier
    let badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';
    let glowStyle = '';
    let borderStyle = 'border-slate-700/60';
    let bgGradient = 'from-slate-800/40 to-slate-900/40';
    let barGradient = 'from-slate-600 to-slate-400';
    let heatLabel = `❄️ Cold (0%) • Inactive in this stage`;

    if (tier === 'extreme') {
      badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold animate-pulse';
      glowStyle = 'shadow-[0_0_35px_rgba(244,63,94,0.35)] ring-2 ring-rose-500/70';
      borderStyle = 'border-rose-500';
      bgGradient = 'from-rose-500/25 via-amber-500/15 to-transparent';
      barGradient = 'from-amber-400 via-rose-500 to-red-500';
      heatLabel = `🔥 High Heat (${score}%) • Primary Engine`;
    } else if (tier === 'high') {
      badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold';
      glowStyle = 'shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/60';
      borderStyle = 'border-amber-500/70';
      bgGradient = 'from-amber-500/20 via-orange-500/10 to-transparent';
      barGradient = 'from-yellow-400 via-amber-500 to-orange-500';
      heatLabel = `🔥 High Heat (${score}%) • Active Driver`;
    } else if (tier === 'moderate') {
      badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      glowStyle = 'shadow-[0_0_20px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40';
      borderStyle = 'border-emerald-500/60';
      bgGradient = 'from-emerald-500/15 via-teal-500/10 to-transparent';
      barGradient = 'from-teal-400 via-emerald-500 to-cyan-500';
      heatLabel = `⚡ Moderate Heat (${score}%) • Supporting Sync`;
    } else if (tier === 'low') {
      badgeStyle = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      glowStyle = 'shadow-[0_0_15px_rgba(6,182,212,0.15)]';
      borderStyle = 'border-cyan-500/40';
      bgGradient = 'from-cyan-500/10 to-transparent';
      barGradient = 'from-blue-400 to-cyan-500';
      heatLabel = `📡 Low Heat (${score}%) • Telemetry Feed`;
    } else {
      // Cold
      badgeStyle = 'bg-slate-850 text-slate-400 border-slate-750';
      glowStyle = '';
      borderStyle = 'border-slate-800';
      bgGradient = 'from-slate-950/80 to-slate-900/80';
      barGradient = 'from-slate-700 to-slate-600';
      heatLabel = `❄️ Cold (0%) • Dormant in Stage`;
    }

    return {
      score,
      tier,
      roleInPhase: role,
      isPrimary,
      isSecondary,
      isSupported: isStageSupported,
      heatLabel,
      transactionLoad: load,
      activeUsersStage: `${(system.sla.activeUsersToday / 1000).toFixed(1)}k users`,
      badgeStyle,
      glowStyle,
      borderStyle,
      bgGradient,
      barGradient
    };
  };

  // Stage Summary Breakdown
  const stageHeatSummary = useMemo(() => {
    const heats = systems.map(s => getSystemHeat(s));
    const extremeAndHigh = heats.filter(h => h.tier === 'extreme' || h.tier === 'high').length;
    const moderate = heats.filter(h => h.tier === 'moderate').length;
    const low = heats.filter(h => h.tier === 'low').length;
    const cold = heats.filter(h => h.tier === 'cold').length;
    const avgScore = Math.round(heats.reduce((acc, h) => acc + h.score, 0) / heats.length);

    return {
      extremeAndHigh,
      moderate,
      low,
      cold,
      avgScore,
      total: systems.length
    };
  }, [systems, selectedLifecycleFilter]);

  // Check if system matches search
  const matchesSearch = (system: SystemNode) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      system.name.toLowerCase().includes(q) ||
      system.shortName.toLowerCase().includes(q) ||
      system.code.toLowerCase().includes(q) ||
      system.description.toLowerCase().includes(q) ||
      system.category.toLowerCase().includes(q) ||
      system.protocols.some(p => p.toLowerCase().includes(q))
    );
  };

  // Lifecycle stage buttons
  const lifecycleTabs: { id: LifecycleStageId | 'all'; label: string; number: string; color: string }[] = [
    { id: 'all', label: 'All Lifecycle Phases', number: 'ALL', color: 'bg-slate-700 text-slate-200' },
    { id: 'hire', label: 'Hire', number: '01', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
    { id: 'onboard', label: 'Onboard', number: '02', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    { id: 'develop', label: 'Develop', number: '03', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    { id: 'retain', label: 'Retain', number: '04', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    { id: 'transition', label: 'Transition', number: '05', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  ];

  // Helper to switch lifecycle filter
  const handleStageSelect = (stageId: LifecycleStageId | 'all') => {
    if (onSelectLifecycleFilter) {
      onSelectLifecycleFilter(stageId);
    }
  };

  // Render System Card with Heatmap & Standard Modes
  const renderSystemCard = (systemId: string, customClasses = "") => {
    const system = getSystem(systemId);
    if (!system) return null;

    const isSelected = selectedNode?.id === system.id;
    const heat = getSystemHeat(system);
    const matches = matchesSearch(system);

    // If "hide cold systems" is enabled in heatmap mode, hide cold ones
    if (isHeatmapActive && hideColdSystems && heat.tier === 'cold') {
      return null;
    }

    const isDimmed = !matches || (isHeatmapActive && heat.tier === 'cold' && !isSelected);

    return (
      <div
        id={`node-${system.id}`}
        onClick={() => onSelectNode(system)}
        className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer border text-left ${customClasses} ${
          isSelected 
            ? 'ring-2 ring-blue-500 shadow-2xl scale-[1.02] border-blue-400 bg-slate-800 z-20' 
            : isHeatmapActive
              ? `${heat.borderStyle} ${heat.glowStyle} bg-slate-850 hover:bg-slate-800`
              : 'hover:border-slate-500/80 hover:bg-slate-800/90 bg-slate-850/80 shadow-md border-slate-700/60'
        } ${isDimmed ? 'opacity-40 grayscale-[60%] hover:opacity-80 hover:grayscale-0' : 'opacity-100'}`}
      >
        {/* Ambient Gradient Overlay */}
        <div 
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
            isHeatmapActive ? heat.bgGradient : system.colorScheme.bg
          } opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none`} 
        />

        {/* Heat Map Floating Temperature Badge (Top Right) */}
        {isHeatmapActive && (
          <div className="absolute -top-2.5 right-3 z-10">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-md flex items-center space-x-1 border ${heat.badgeStyle}`}>
              {heat.tier === 'extreme' || heat.tier === 'high' ? (
                <Flame className="w-3 h-3 text-rose-400 animate-bounce" />
              ) : heat.tier === 'moderate' ? (
                <Zap className="w-3 h-3 text-emerald-400" />
              ) : heat.tier === 'low' ? (
                <Activity className="w-3 h-3 text-cyan-400" />
              ) : (
                <span className="text-[10px]">❄️</span>
              )}
              <span>{heat.heatLabel}</span>
            </span>
          </div>
        )}

        {/* Card Header */}
        <div className="relative flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-inner ${
              isHeatmapActive && (heat.tier === 'extreme' || heat.tier === 'high')
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/20'
                : system.colorScheme.badge
            }`}>
              {renderIcon(system.iconName, `w-5 h-5 ${
                isHeatmapActive && (heat.tier === 'extreme' || heat.tier === 'high')
                  ? 'text-rose-300'
                  : system.colorScheme.text
              }`)}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-mono font-bold text-slate-400">{system.code}</span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] text-slate-400 font-medium">{system.category}</span>
              </div>
              <h3 className="font-bold text-sm text-white tracking-tight group-hover:text-blue-300 transition-colors">
                {system.name}
              </h3>
            </div>
          </div>

          {/* Status Indicator */}
          {!isHeatmapActive && (
            <div className="flex items-center space-x-1">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
          )}
        </div>

        {/* Heat Map: Active Stage Responsibility Callout */}
        {isHeatmapActive ? (
          <div className="relative my-2.5 p-2 rounded-xl bg-slate-900/90 border border-slate-750/80 text-[11px] leading-relaxed">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span className="font-semibold text-slate-300 flex items-center space-x-1">
                <Workflow className="w-3 h-3 text-blue-400" />
                <span>Stage Workflow Execution:</span>
              </span>
              <span className={heat.tier === 'cold' ? 'text-slate-400' : 'text-emerald-400 font-bold'}>
                {heat.transactionLoad}
              </span>
            </div>
            <p className={`font-medium ${heat.tier === 'cold' ? 'text-slate-400 italic' : 'text-slate-200'}`}>
              {heat.roleInPhase}
            </p>

            {/* Thermal Progress Bar */}
            <div className="mt-2 pt-1 border-t border-slate-800/80">
              <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                <span>Thermal Intensity</span>
                <span className="font-bold text-white">{heat.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${heat.barGradient} transition-all duration-500 rounded-full`}
                  style={{ width: `${heat.score}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Standard Description Summary */
          <p className="relative text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
            {system.executiveSummary}
          </p>
        )}

        {/* Technical Badges or Metrics */}
        {showTechnicalMetrics && (
          <div className="relative pt-2 border-t border-slate-750/80 flex items-center justify-between text-[11px]">
            <div className="flex items-center space-x-2 text-slate-400 font-mono">
              <span>SLA: <strong className="text-emerald-400">{system.sla.targetUptime}</strong></span>
              <span>•</span>
              <span>{system.sla.avgLatency}</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <Users className="w-3 h-3 text-slate-400" />
              <span>{(system.sla.activeUsersToday / 1000).toFixed(1)}k/d</span>
            </div>
          </div>
        )}

        {/* Supported Lifecycle Tags */}
        <div className="relative mt-2 flex flex-wrap gap-1">
          {system.supportedLifecycleStages.map(stage => {
            const isHighlight = selectedLifecycleFilter === stage;
            return (
              <span
                key={stage}
                className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider transition-colors ${
                  isHighlight 
                    ? 'bg-rose-500 text-white font-bold shadow-sm' 
                    : 'bg-slate-750 text-slate-400'
                }`}
              >
                {stage}
              </span>
            );
          })}
        </div>

        {/* Click indicator */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Info className="w-4 h-4 text-blue-400" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Architecture Controls & Context Banner */}
      <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search & Platforms Count */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search platforms, protocols (SCIM, REST)..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            <strong className="text-white">{systems.length}</strong> core platforms
          </div>
        </div>

        {/* Heat Map Overlay & View Options Toggles */}
        <div className="flex flex-wrap items-center space-x-2 w-full md:w-auto justify-end gap-y-2">
          {/* Heat Map Mode Toggle Button */}
          <button
            onClick={() => setIsHeatmapActive(!isHeatmapActive)}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-md active:scale-95 ${
              isHeatmapActive 
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white border-rose-500/50 shadow-rose-500/20' 
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
            }`}
          >
            <Flame className={`w-4 h-4 ${isHeatmapActive ? 'text-amber-200 animate-pulse' : 'text-slate-400'}`} />
            <span>{isHeatmapActive ? 'Heat Map Overlay: ON' : 'Enable Heat Map'}</span>
          </button>

          {/* Hide Cold Systems in Heatmap Toggle */}
          {isHeatmapActive && selectedLifecycleFilter !== 'all' && (
            <button
              onClick={() => setHideColdSystems(!hideColdSystems)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                hideColdSystems 
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Filter out systems that are dormant during the active lifecycle stage"
            >
              {hideColdSystems ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{hideColdSystems ? 'Active Only' : 'Show All'}</span>
            </button>
          )}

          {/* Data Flow Animation Toggle */}
          <button
            onClick={() => setIsAnimationActive(!isAnimationActive)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isAnimationActive 
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isAnimationActive ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
            <span>{isAnimationActive ? 'Flow Live' : 'Flow Paused'}</span>
          </button>

          {/* Tech SLAs Toggle */}
          <button
            onClick={() => setShowTechnicalMetrics(!showTechnicalMetrics)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showTechnicalMetrics 
                ? 'bg-slate-700 text-slate-200 border-slate-600' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Tech SLAs</span>
          </button>
        </div>
      </div>

      {/* Interactive Lifecycle Phase Stepper & Heat Map Scorecard */}
      <div className="bg-slate-800/95 rounded-2xl p-4 border border-slate-700/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/80 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Thermometer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Lifecycle Stage Thermal Engagement Matrix
              </h3>
              <p className="text-[11px] text-slate-400">
                Select a stage to inspect active workflow orchestrators, zero-touch provisioning engines, and telemetry sinks
              </p>
            </div>
          </div>

          {/* Live Heat Stats Capsule */}
          <div className="flex items-center space-x-2 text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-750">
            <span className="text-rose-400 font-bold flex items-center">
              <Flame className="w-3.5 h-3.5 mr-1 text-rose-500" />
              {stageHeatSummary.extremeAndHigh} Primary
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-medium">
              {stageHeatSummary.moderate + stageHeatSummary.low} Supporting
            </span>
            {selectedLifecycleFilter !== 'all' && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">
                  {stageHeatSummary.cold} Dormant
                </span>
              </>
            )}
          </div>
        </div>

        {/* 5 Stage Interactive Stepper Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {lifecycleTabs.map((tab) => {
            const isSelected = selectedLifecycleFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleStageSelect(tab.id)}
                className={`group relative p-2.5 rounded-xl text-left border transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-600/30 to-amber-600/20 border-rose-500 text-white shadow-md shadow-rose-500/20 scale-[1.02]'
                    : 'bg-slate-850 hover:bg-slate-750 border-slate-750 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-rose-400' : 'text-slate-400'}`}>
                    {tab.number}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  )}
                </div>
                <div className="font-bold text-xs truncate group-hover:text-rose-300 transition-colors">
                  {tab.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Diagram Canvas */}
      <div className="relative bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl bg-tech-grid overflow-hidden">
        {/* Background Ambient Heat Glows */}
        {isHeatmapActive ? (
          <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-gradient-to-br from-rose-600/15 to-amber-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        {/* Architectural Tree Structure */}
        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          
          {/* ========================================================
              LAYER 1: EMPLOYEE / CANDIDATE LAYER (Top Level)
             ======================================================== */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md">
              {renderSystemCard('employee', 'border-blue-500/40 shadow-blue-500/10')}
            </div>

            {/* Vertical Flow Connector: Employee -> MyHR Portal */}
            <div className="relative flex flex-col items-center my-2">
              <div className={`w-0.5 h-8 ${
                isHeatmapActive 
                  ? 'bg-gradient-to-b from-rose-500 via-amber-500 to-purple-500' 
                  : 'bg-gradient-to-b from-blue-500 to-purple-500'
              } relative`}>
                {isAnimationActive && (
                  <div className={`absolute top-0 -left-1 w-2.5 h-2.5 rounded-full ${
                    isHeatmapActive ? 'bg-amber-400' : 'bg-blue-400'
                  } animate-ping opacity-75`} />
                )}
              </div>
              <div className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center space-x-1">
                <span>SSO / OIDC Gateway</span>
                <ArrowDown className={`w-3 h-3 ${isHeatmapActive ? 'text-amber-400' : 'text-blue-400'}`} />
              </div>
              <div className="w-0.5 h-4 bg-purple-500" />
            </div>
          </div>

          {/* ========================================================
              LAYER 2: CENTRAL GATEWAY - MyHR PORTAL (HRcore)
             ======================================================== */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-xl">
              {renderSystemCard('myhr_portal', 'border-purple-500/50 shadow-purple-500/15')}
            </div>

            {/* 3-Way Fork Connector from MyHR Portal to 3 Functional Streams */}
            <div className="w-full max-w-4xl relative my-4">
              {/* Central Trunk Down */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-5 bg-purple-500" />
              </div>

              {/* Horizontal Distribution Rail */}
              <div className="relative h-4 flex items-center justify-center">
                <div className={`w-full h-0.5 ${
                  isHeatmapActive 
                    ? 'bg-gradient-to-r from-emerald-500 via-rose-500 to-amber-500' 
                    : 'bg-gradient-to-r from-emerald-500 via-amber-500 to-blue-500'
                } relative`}>
                  {/* Dynamic pulse markers */}
                  {isAnimationActive && (
                    <>
                      <div className="absolute -top-1 left-1/4 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ${
                        isHeatmapActive ? 'bg-rose-400 animate-ping' : 'bg-amber-400 animate-pulse'
                      }`} />
                      <div className="absolute -top-1 right-1/4 w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                    </>
                  )}
                </div>
              </div>

              {/* 3 Drops to Downstream Pillars */}
              <div className="grid grid-cols-3 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-emerald-500" />
                  <span className="text-[10px] font-mono text-emerald-400 bg-slate-850 px-2 py-0.5 rounded border border-emerald-500/30">
                    Onboarding Stream
                  </span>
                  <div className="w-0.5 h-4 bg-emerald-500" />
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-amber-500" />
                  <span className="text-[10px] font-mono text-amber-400 bg-slate-850 px-2 py-0.5 rounded border border-amber-500/30">
                    Learning & Growth Stream
                  </span>
                  <div className="w-0.5 h-4 bg-amber-500" />
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-blue-500" />
                  <span className="text-[10px] font-mono text-blue-400 bg-slate-850 px-2 py-0.5 rounded border border-blue-500/30">
                    HR Operations Stream
                  </span>
                  <div className="w-0.5 h-4 bg-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              LAYER 3: 3 CORE FUNCTIONAL PILLARS
              - Left: Onboarding App -> OneID & ITSP
              - Center: LearnHUB (TrainM) -> CptM & HR Academy
              - Right: HR Services Administration
             ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* PILLAR 1: ONBOARDING & IDENTITY */}
            <div className="space-y-4 p-4 rounded-3xl bg-slate-850/50 border border-emerald-500/20">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Stream 1: Onboarding & Identity
                </span>
                <span className="text-[10px] text-slate-400 font-mono">SCIM 2.0 / ITSP</span>
              </div>

              {/* Onboarding App */}
              {renderSystemCard('onboarding_app')}

              {/* Downward connector to OneID / ITSP */}
              <div className="flex flex-col items-center my-1">
                <div className={`w-0.5 h-5 ${
                  isHeatmapActive ? 'bg-gradient-to-b from-rose-500 to-amber-500' : 'bg-gradient-to-b from-emerald-500 to-cyan-500'
                }`} />
                <div className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-300">
                  Zero-Touch SCIM Trigger
                </div>
                <div className="w-0.5 h-5 bg-cyan-500" />
              </div>

              {/* OneID / OneIDM & ITSP */}
              {renderSystemCard('oneid_itsp')}
            </div>

            {/* PILLAR 2: LEARNING & DEVELOPMENT */}
            <div className="space-y-4 p-4 rounded-3xl bg-slate-850/50 border border-amber-500/20">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Stream 2: Learning & Growth
                </span>
                <span className="text-[10px] text-slate-400 font-mono">xAPI / Skills Matrix</span>
              </div>

              {/* LearnHUB / TrainM */}
              {renderSystemCard('learnhub_trainm')}

              {/* Dual Downward Connector to CptM & HR Academy */}
              <div className="relative my-1">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-amber-500" />
                </div>
                <div className="w-full h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500" />
                <div className="grid grid-cols-2 text-center mt-1">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-yellow-500" />
                    <span className="text-[9px] font-mono text-yellow-400">Skill Taxonomy</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-orange-500" />
                    <span className="text-[9px] font-mono text-orange-400">Leadership Track</span>
                  </div>
                </div>
              </div>

              {/* Nested 2-Card Grid: Competence Management (CptM) + HR Academy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderSystemCard('cptm_competence')}
                {renderSystemCard('hr_academy')}
              </div>
            </div>

            {/* PILLAR 3: HR SERVICES ADMINISTRATION */}
            <div className="space-y-4 p-4 rounded-3xl bg-slate-850/50 border border-blue-500/20 h-full flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Stream 3: HR Operations
                </span>
                <span className="text-[10px] text-slate-400 font-mono">ServiceNow / SAP</span>
              </div>

              {/* HR Services Administration */}
              <div className="flex-1">
                {renderSystemCard('hr_services_admin', 'h-full flex flex-col justify-between')}
              </div>

              <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-xs text-slate-400 space-y-1.5">
                <div className="font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span>Operations Coverage</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Processes master employee tickets, contract addendums, payroll interfaces, benefit options, and separation settlements.
                </p>
              </div>
            </div>

          </div>

          {/* ========================================================
              LAYER 4: CONVERGENCE TO HR REPORTING PLATFORM (POWER BI)
             ======================================================== */}
          <div className="flex flex-col items-center pt-2">
            {/* Collector Rail from All Systems to Analytics */}
            <div className="w-full max-w-4xl relative my-2">
              <div className="relative h-4 flex items-center justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-500 relative">
                  {isAnimationActive && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-rose-400 animate-ping" />
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-0.5 h-6 bg-gradient-to-b from-rose-400 to-rose-600" />
                <div className="px-3 py-0.5 rounded-full bg-slate-800 border border-rose-500/40 text-[10px] font-mono text-rose-300 flex items-center space-x-1.5">
                  <span>Cross-Platform ETL / OData Ingestion</span>
                  <ArrowDown className="w-3 h-3 text-rose-400" />
                </div>
                <div className="w-0.5 h-4 bg-rose-600" />
              </div>
            </div>

            {/* HR Reporting Platform (Power BI) Node */}
            <div className="w-full max-w-2xl">
              {renderSystemCard('hr_reporting_pbi', 'border-rose-500/50 shadow-rose-500/20')}
            </div>
          </div>

        </div>

        {/* Heat Map Legend & Thermal Spectrum Key Bar */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400">
          
          {/* Thermal Tiers Key */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-white flex items-center space-x-1">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              <span>Thermal Key:</span>
            </span>

            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              <span className="font-semibold text-[11px]">80-100% Primary Engine</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-semibold text-[11px]">50-79% Active Sync</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="font-semibold text-[11px]">20-49% Telemetry Feed</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              <span className="text-[11px]">0% Dormant</span>
            </div>
          </div>

          <div className="text-slate-400 italic text-[11px]">
            *Heat intensities derived from supported lifecycle stages, automation SLA limits, and transactional orchestration.
          </div>
        </div>

      </div>
    </div>
  );
};

