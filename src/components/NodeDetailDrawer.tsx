import React from 'react';
import { 
  X, 
  Layers, 
  Cpu, 
  Activity, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Database, 
  Globe, 
  Clock, 
  Users, 
  CheckCircle2, 
  ExternalLink,
  PlayCircle,
  Sparkles
} from 'lucide-react';
import { SystemNode, LifecycleStageId } from '../types';

interface NodeDetailDrawerProps {
  system: SystemNode | null;
  onClose: () => void;
  allSystems: SystemNode[];
  onSelectOtherSystem: (system: SystemNode) => void;
  onLaunchSimulationForSystem: (systemId: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  system,
  onClose,
  allSystems,
  onSelectOtherSystem,
  onLaunchSimulationForSystem,
}) => {
  if (!system) return null;

  const upstreamObjects = system.upstreamSystems
    .map(id => allSystems.find(s => s.id === id))
    .filter(Boolean) as SystemNode[];

  const downstreamObjects = system.downstreamSystems
    .map(id => allSystems.find(s => s.id === id))
    .filter(Boolean) as SystemNode[];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col overflow-y-auto">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-850/70 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-750 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-1">
              <span>{system.code}</span>
              <span>•</span>
              <span className="text-blue-400 font-semibold">{system.category}</span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              {system.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Owned by: <span className="text-slate-200">{system.ownerDepartment}</span>
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 flex-1 text-xs">
            
            {/* Live SLA & Telemetry Scorecard */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="text-center p-2 rounded-xl bg-slate-850">
                <span className="text-[11px] text-slate-400 block mb-1">Target SLA</span>
                <span className="text-sm font-bold text-emerald-400">{system.sla.targetUptime}</span>
              </div>
              <div className="text-center p-2 rounded-xl bg-slate-850">
                <span className="text-[11px] text-slate-400 block mb-1">Avg Latency</span>
                <span className="text-sm font-bold text-blue-400">{system.sla.avgLatency}</span>
              </div>
              <div className="text-center p-2 rounded-xl bg-slate-850">
                <span className="text-[11px] text-slate-400 block mb-1">Daily Traffic</span>
                <span className="text-sm font-bold text-purple-400">
                  {(system.sla.activeUsersToday / 1000).toFixed(1)}k req
                </span>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span>Executive Role & Overview</span>
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs bg-slate-850/60 p-3.5 rounded-xl border border-slate-800">
                {system.description}
              </p>
            </div>

            {/* Key Capabilities */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Core Capabilities</span>
              </h4>
              <ul className="space-y-1.5">
                {system.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-slate-300 bg-slate-850/40 p-2 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Architecture & Protocols */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Technical Stack & Integration Protocols</span>
              </h4>
              
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-850/60 border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">Underlying Platform Stack:</span>
                  <span className="text-slate-200 font-mono font-medium">{system.techStack}</span>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-1.5">Supported Protocols:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {system.protocols.map(protocol => (
                      <span
                        key={protocol}
                        className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono text-[11px]"
                      >
                        {protocol}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Managed Data Entities */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Data Entities & State Managed</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {system.managedEntities.map(entity => (
                  <span
                    key={entity}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs"
                  >
                    {entity}
                  </span>
                ))}
              </div>
            </div>

            {/* Upstream & Downstream Lineage */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Upstream */}
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center space-x-1">
                  <ArrowLeft className="w-3 h-3 text-blue-400" />
                  <span>Upstream Sources ({upstreamObjects.length})</span>
                </div>
                {upstreamObjects.length === 0 ? (
                  <span className="text-slate-400 italic text-[11px]">Primary Source / User Entry</span>
                ) : (
                  <div className="space-y-1">
                    {upstreamObjects.map(up => (
                      <button
                        key={up.id}
                        onClick={() => onSelectOtherSystem(up)}
                        className="w-full text-left p-1.5 rounded bg-slate-800 hover:bg-slate-750 text-blue-300 text-xs font-medium truncate flex items-center justify-between"
                      >
                        <span className="truncate">{up.shortName}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Downstream */}
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center space-x-1">
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                  <span>Downstream Targets ({downstreamObjects.length})</span>
                </div>
                {downstreamObjects.length === 0 ? (
                  <span className="text-slate-400 italic text-[11px]">Terminal Sink / BI Dashboard</span>
                ) : (
                  <div className="space-y-1">
                    {downstreamObjects.map(down => (
                      <button
                        key={down.id}
                        onClick={() => onSelectOtherSystem(down)}
                        className="w-full text-left p-1.5 rounded bg-slate-800 hover:bg-slate-750 text-emerald-300 text-xs font-medium truncate flex items-center justify-between"
                      >
                        <span className="truncate">{down.shortName}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Supported Lifecycle Stages */}
            <div className="space-y-2 pt-2">
              <span className="text-slate-400 font-semibold block text-[11px]">Lifecycle Stages Supported:</span>
              <div className="flex flex-wrap gap-1.5">
                {system.supportedLifecycleStages.map(stage => (
                  <span 
                    key={stage}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-xs uppercase font-bold"
                  >
                    {stage}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-slate-800 bg-slate-850 flex items-center justify-between gap-3">
            <button
              onClick={() => onLaunchSimulationForSystem(system.id)}
              className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Simulate Workflow for {system.shortName}</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs border border-slate-700"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
