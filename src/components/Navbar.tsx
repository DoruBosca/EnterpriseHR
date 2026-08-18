import React from 'react';
import { 
  Network, 
  Workflow, 
  BarChart3, 
  Cpu, 
  PlayCircle, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Activity,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { UserPersona, LifecycleStageId } from '../types';

interface NavbarProps {
  activeTab: 'architecture' | 'lifecycle' | 'analytics' | 'matrix' | 'simulator';
  setActiveTab: (tab: 'architecture' | 'lifecycle' | 'analytics' | 'matrix' | 'simulator') => void;
  currentPersona: UserPersona;
  setCurrentPersona: (persona: UserPersona) => void;
  selectedLifecycleFilter: LifecycleStageId | 'all';
  setSelectedLifecycleFilter: (stage: LifecycleStageId | 'all') => void;
  onOpenAdvisor: () => void;
  systemStatusCount: { operational: number; total: number };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentPersona,
  setCurrentPersona,
  selectedLifecycleFilter,
  setSelectedLifecycleFilter,
  onOpenAdvisor,
  systemStatusCount,
}) => {
  const personas: UserPersona[] = [
    'Employee',
    'HR Specialist',
    'HR Director',
    'IT & Security Admin',
    'System Architect'
  ];

  const lifecycleStages: { id: LifecycleStageId | 'all'; label: string; color: string }[] = [
    { id: 'all', label: 'All Lifecycle Phases', color: 'bg-slate-700 text-slate-200' },
    { id: 'hire', label: '1. Hire', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
    { id: 'onboard', label: '2. Onboard', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    { id: 'develop', label: '3. Develop', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    { id: 'retain', label: '4. Retain', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    { id: 'transition', label: '5. Transition', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
      {/* Top Bar: Brand, Status, Persona & AI Advisor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Application Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-white/20">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg text-white tracking-tight">
                  HR Process & Architecture
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  Enterprise Blueprint
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Hire → Onboard → Develop → Retain → Transition Lifecycle Map
              </p>
            </div>
          </div>

          {/* Right Action Center */}
          <div className="flex items-center space-x-3">
            {/* Live System Health Badge */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">
                {systemStatusCount.operational}/{systemStatusCount.total} Systems Operational
              </span>
              <span className="text-emerald-400 font-semibold">(99.96% SLA)</span>
            </div>

            {/* Persona Switcher Dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 cursor-pointer hover:bg-slate-750 transition-colors">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400">View as:</span>
                <span className="font-semibold text-white">{currentPersona}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="absolute right-0 mt-1 w-48 py-1 bg-slate-800 rounded-lg shadow-xl border border-slate-700 hidden group-hover:block z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Perspective
                </div>
                {personas.map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPersona(p)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-700/80 transition-colors ${
                      currentPersona === p ? 'text-blue-400 font-semibold bg-blue-500/10' : 'text-slate-300'
                    }`}
                  >
                    <span>{p}</span>
                    {currentPersona === p && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Architecture & Process Advisor Trigger */}
            <button
              onClick={onOpenAdvisor}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-600/20 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>AI Advisor</span>
            </button>
          </div>
        </div>

        {/* Secondary Bar: Navigation Tabs & Lifecycle Phase Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between py-2 border-t border-slate-800/80 gap-2">
          {/* Main Module Tabs */}
          <nav className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Architecture Blueprint</span>
            </button>

            <button
              onClick={() => setActiveTab('lifecycle')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'lifecycle'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Employee Lifecycle (5 Stages)</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Power BI Workforce Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'matrix'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Integration Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'simulator'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Process Simulator</span>
            </button>
          </nav>

          {/* Quick Lifecycle Stage Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] text-slate-400 font-medium hidden lg:inline">Phase Highlight:</span>
            {lifecycleStages.map((stage) => {
              const isSelected = selectedLifecycleFilter === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedLifecycleFilter(stage.id)}
                  className={`px-2.5 py-1 text-[11px] rounded-full border transition-all whitespace-nowrap font-medium ${
                    isSelected
                      ? `${stage.color} ring-1 ring-white/30 font-semibold scale-105 shadow-sm`
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
