import React, { useState } from 'react';
import { 
  Workflow, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles, 
  Bot, 
  User, 
  Layers, 
  Activity,
  Award,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Zap,
  Play
} from 'lucide-react';
import { LifecyclePhase, LifecycleStageId, EmployeeJourneyPersona, SystemNode } from '../types';

interface LifecycleExplorerProps {
  phases: LifecyclePhase[];
  activePhaseId: LifecycleStageId;
  onSelectPhase: (phaseId: LifecycleStageId) => void;
  employees: EmployeeJourneyPersona[];
  allSystems: SystemNode[];
  onSelectSystem: (system: SystemNode) => void;
}

export const LifecycleExplorer: React.FC<LifecycleExplorerProps> = ({
  phases,
  activePhaseId,
  onSelectPhase,
  employees,
  allSystems,
  onSelectSystem,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id || '');
  const [journeyStepIndex, setJourneyStepIndex] = useState<number>(0);

  const currentPhase = phases.find(p => p.id === activePhaseId) || phases[0];
  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId) || employees[0];

  const getSystem = (id: string) => allSystems.find(s => s.id === id);

  return (
    <div className="space-y-6">
      
      {/* 5-Stage Lifecycle Horizontal Pipeline Ribbon */}
      <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <Workflow className="w-5 h-5 text-blue-400" />
              <span>Employee Lifecycle Process Architecture</span>
            </h2>
            <p className="text-xs text-slate-400">
              Complete end-to-end employee journey mapped across enterprise HR platforms
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-850 px-3 py-1 rounded-lg border border-slate-700">
            Current Focus: <span className="text-blue-400 font-bold">{currentPhase.name}</span>
          </div>
        </div>

        {/* 5 Stage Stepper Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {phases.map((phase) => {
            const isActive = phase.id === activePhaseId;
            return (
              <button
                key={phase.id}
                onClick={() => onSelectPhase(phase.id)}
                className={`group relative p-3.5 rounded-xl text-left border transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                    : 'bg-slate-850 hover:bg-slate-750 border-slate-700/70 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[11px] font-bold font-mono ${isActive ? 'text-blue-400' : 'text-slate-400'}`}>
                    0{phase.order}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {phase.durationAvg}
                  </span>
                </div>
                <div className="font-bold text-sm tracking-tight text-white group-hover:text-blue-300 transition-colors">
                  {phase.name.split('. ')[1] || phase.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-1">
                  {phase.primarySystems.length} Primary Systems
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Stage Detail + Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Selected Stage Deep-Dive & Milestone Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Phase Overview Header Card */}
          <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-md relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentPhase.badgeColor}`}>
                  Stage {currentPhase.order} of 5
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mt-2">
                  {currentPhase.name} Architecture
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Typical Target Duration</span>
                <span className="text-sm font-bold text-white font-mono">{currentPhase.durationAvg}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-4 leading-relaxed bg-slate-850/60 p-4 rounded-xl border border-slate-750">
              {currentPhase.description}
            </p>

            {/* Primary & Secondary Systems In This Phase */}
            <div className="mt-5 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Participating Systems in this Stage:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentPhase.primarySystems.map(sysId => {
                  const sys = getSystem(sysId);
                  if (!sys) return null;
                  return (
                    <button
                      key={sys.id}
                      onClick={() => onSelectSystem(sys)}
                      className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>{sys.name}</span>
                      <span className="text-[10px] text-blue-400/80 font-mono">({sys.code})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stage KPIs */}
            <div className="mt-6 pt-4 border-t border-slate-700/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Key Performance Benchmarks
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentPhase.kpis.map((kpi, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-left">
                    <span className="text-[11px] text-slate-400 block mb-1">{kpi.label}</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-base font-bold text-emerald-400">{kpi.value}</span>
                      <span className="text-[10px] text-slate-400">Target: {kpi.benchmark}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sequential Process Milestones */}
          <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-md">
            <h4 className="text-sm font-bold text-white tracking-tight uppercase mb-4 flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Step-by-Step Stage Milestones & SLA Limits</span>
            </h4>

            <div className="space-y-3">
              {currentPhase.keyMilestones.map((milestone, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-750/80 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center justify-center font-mono shrink-0">
                        {idx + 1}
                      </span>
                      <h5 className="font-bold text-sm text-white">
                        {milestone.title}
                      </h5>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {milestone.isAutomated ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                          <Zap className="w-3 h-3 text-emerald-400" />
                          <span>Automated</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          Human in Loop
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        SLA: {milestone.slaHours}h
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 ml-8 leading-relaxed">
                    {milestone.description}
                  </p>

                  <div className="ml-8 mt-2 flex items-center space-x-2 text-[11px] text-slate-400">
                    <span>Orchestrated by:</span>
                    <span className="font-semibold text-blue-400">{milestone.system}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pain Points & Architecture Best Practices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Common Friction & Latency Risks</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentPhase.painPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2.5">
                <Sparkles className="w-4 h-4" />
                <span>Architectural Best Practices</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentPhase.bestPractices.map((best, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{best}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Interactive Employee Journey Runner */}
        <div className="space-y-6">
          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-bold text-white tracking-tight">
                  Live Employee Journey Runner
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Simulator
              </span>
            </div>

            {/* Persona Switcher Buttons */}
            <div className="space-y-2 mb-4">
              <span className="text-[11px] text-slate-400 font-medium">Select Employee Persona:</span>
              <div className="space-y-1.5">
                {employees.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setSelectedEmployeeId(emp.id);
                      setJourneyStepIndex(0);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left border flex items-center space-x-3 transition-colors ${
                      emp.id === selectedEmployee.id
                        ? 'bg-blue-600/20 border-blue-500/60 text-white'
                        : 'bg-slate-850 hover:bg-slate-750 border-slate-750 text-slate-300'
                    }`}
                  >
                    <img 
                      src={emp.avatarUrl} 
                      alt={emp.name} 
                      className="w-8 h-8 rounded-full object-cover border border-slate-600 shrink-0" 
                    />
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs text-white truncate">{emp.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{emp.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Employee Dossier Card */}
            <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="text-white font-medium">{selectedEmployee.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-white font-medium">{selectedEmployee.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Phase:</span>
                <span className="text-blue-400 font-bold uppercase">{selectedEmployee.currentStage}</span>
              </div>

              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Stage Progress</span>
                  <span className="text-white font-mono font-bold">{selectedEmployee.currentProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${selectedEmployee.currentProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Real-time Event Log */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Audit Timeline Logs ({selectedEmployee.historyLog.length})
              </span>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                {selectedEmployee.historyLog.map((log, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-850/80 border border-slate-750/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{log.timestamp}</span>
                      <span className="font-mono text-blue-400">{log.system}</span>
                    </div>
                    <div className="text-white font-medium text-xs">
                      {log.event}
                    </div>
                    <div className="flex items-center space-x-1.5 pt-0.5">
                      {log.status === 'completed' ? (
                        <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Executed & Verified</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 flex items-center space-x-1 animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>In Processing Queue</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
