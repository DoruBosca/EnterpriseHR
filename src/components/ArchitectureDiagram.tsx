import React, { useState } from 'react';
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
  Eye
} from 'lucide-react';
import { SystemNode, LifecycleStageId, UserPersona } from '../types';

interface ArchitectureDiagramProps {
  systems: SystemNode[];
  selectedNode: SystemNode | null;
  onSelectNode: (node: SystemNode) => void;
  selectedLifecycleFilter: LifecycleStageId | 'all';
  currentPersona: UserPersona;
  onSimulateScenario: (scenarioId: string) => void;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  systems,
  selectedNode,
  onSelectNode,
  selectedLifecycleFilter,
  currentPersona,
  onSimulateScenario,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnimationActive, setIsAnimationActive] = useState(true);
  const [showTechnicalMetrics, setShowTechnicalMetrics] = useState(true);

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

  // Check if system is active under current lifecycle filter
  const isSystemActiveInFilter = (system: SystemNode) => {
    if (selectedLifecycleFilter === 'all') return true;
    return system.supportedLifecycleStages.includes(selectedLifecycleFilter);
  };

  // Filter systems by search query
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

  // Node Component for reusable rendering
  const renderSystemCard = (systemId: string, customClasses = "") => {
    const system = getSystem(systemId);
    if (!system) return null;

    const isSelected = selectedNode?.id === system.id;
    const isActiveInFilter = isSystemActiveInFilter(system);
    const matches = matchesSearch(system);
    const isDimmed = (!isActiveInFilter || !matches);

    return (
      <div
        id={`node-${system.id}`}
        onClick={() => onSelectNode(system)}
        className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer border text-left ${customClasses} ${
          isSelected 
            ? 'ring-2 ring-blue-500 shadow-xl shadow-blue-500/20 scale-[1.02] border-blue-400 bg-slate-800' 
            : 'hover:border-slate-500/80 hover:bg-slate-800/90 bg-slate-850/80 shadow-md border-slate-700/60'
        } ${isDimmed ? 'opacity-35 grayscale-[50%]' : 'opacity-100'}`}
      >
        {/* Glow effect on hover or selection */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${system.colorScheme.bg} opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none`} />

        {/* Card Header */}
        <div className="relative flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-inner ${system.colorScheme.badge}`}>
              {renderIcon(system.iconName, `w-5 h-5 ${system.colorScheme.text}`)}
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
          <div className="flex items-center space-x-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        </div>

        {/* Description Summary */}
        <p className="relative text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
          {system.executiveSummary}
        </p>

        {/* Technical Badges or Metrics */}
        {showTechnicalMetrics && (
          <div className="relative pt-2.5 border-t border-slate-750/80 flex items-center justify-between text-[11px]">
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
                className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                  isHighlight 
                    ? 'bg-blue-500 text-white font-bold' 
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
        {/* Search & Filter */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search platforms, protocols (SCIM, REST, OData)..."
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
            Showing <strong className="text-white">{systems.length}</strong> core platforms
          </div>
        </div>

        {/* View Options & Live Flow Toggles */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsAnimationActive(!isAnimationActive)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isAnimationActive 
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm' 
                : 'bg-slate-750 text-slate-400 border-slate-700'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isAnimationActive ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
            <span>{isAnimationActive ? 'Data Flow Live' : 'Data Flow Paused'}</span>
          </button>

          <button
            onClick={() => setShowTechnicalMetrics(!showTechnicalMetrics)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
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

      {/* Main Interactive Diagram Canvas */}
      <div className="relative bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl bg-tech-grid overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

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
              <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 relative">
                {isAnimationActive && (
                  <div className="absolute top-0 -left-1 w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping opacity-75" />
                )}
              </div>
              <div className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                <span>SSO / OIDC Authentication</span>
                <ArrowDown className="w-3 h-3 text-blue-400" />
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
                <div className="w-full h-0.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-blue-500 relative">
                  {/* Dynamic pulse markers traveling left, center, right */}
                  {isAnimationActive && (
                    <>
                      <div className="absolute -top-1 left-1/4 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
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
                <div className="w-0.5 h-5 bg-gradient-to-b from-emerald-500 to-cyan-500" />
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

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-400 space-y-1.5">
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

        {/* Legend / Quick Guide in Bottom Left */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-slate-300">Integration Architecture:</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>OIDC / SAML SSO</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>SCIM 2.0 Provisioning</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>xAPI / OData Sync</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Power BI Lakehouse</span>
            </div>
          </div>

          <div className="text-slate-400 italic">
            *Click on any system card to inspect data entities, APIs, and real-time SLA metrics.
          </div>
        </div>
      </div>
    </div>
  );
};
