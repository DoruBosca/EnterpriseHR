import React, { useState } from 'react';
import { 
  Cpu, 
  Search, 
  Filter, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  Database,
  Code2
} from 'lucide-react';
import { SystemNode, LifecycleStageId } from '../types';

interface IntegrationMatrixProps {
  systems: SystemNode[];
  onSelectSystem: (system: SystemNode) => void;
  selectedLifecycleFilter: LifecycleStageId | 'all';
}

export const IntegrationMatrix: React.FC<IntegrationMatrixProps> = ({
  systems,
  onSelectSystem,
  selectedLifecycleFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('all');

  const categories = ['all', 'Portal & Gateway', 'Onboarding & Identity', 'Learning & Growth', 'Operations & Administration', 'Analytics & BI'];
  const allProtocols = Array.from(new Set(systems.flatMap(s => s.protocols)));

  const filteredSystems = systems.filter(sys => {
    const matchesLifecycle = selectedLifecycleFilter === 'all' || sys.supportedLifecycleStages.includes(selectedLifecycleFilter);
    const matchesCat = selectedCategory === 'all' || sys.category === selectedCategory;
    const matchesProt = selectedProtocol === 'all' || sys.protocols.includes(selectedProtocol);
    const matchesSearch = !searchQuery || 
      sys.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sys.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sys.techStack.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sys.managedEntities.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLifecycle && matchesCat && matchesProt && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                HR Enterprise Integration & Systems Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Technical specifications, integration protocols, managed entities, and SLA telemetry
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tech stack, entity, protocol..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Category & Protocol Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Domain:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-850 hover:bg-slate-750 text-slate-400 border border-slate-700/60'
                }`}
              >
                {cat === 'all' ? 'All Domains' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Protocol Filter:</span>
            <select
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Protocols</option>
              {allProtocols.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Systems Table */}
      <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 text-slate-400 font-semibold border-b border-slate-700/80 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">System / Platform</th>
                <th className="py-3.5 px-4">Category & Role</th>
                <th className="py-3.5 px-4">Tech Stack & Protocols</th>
                <th className="py-3.5 px-4">Managed Data Entities</th>
                <th className="py-3.5 px-4">SLA & Latency</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredSystems.map((system) => (
                <tr 
                  key={system.id}
                  onClick={() => onSelectSystem(system)}
                  className="hover:bg-slate-750/70 transition-colors cursor-pointer group"
                >
                  {/* System & Code */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border font-mono font-bold text-xs ${system.colorScheme.badge}`}>
                        {system.code.split('-')[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-blue-300 transition-colors">
                          {system.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {system.ownerDepartment}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-850 border border-slate-700 text-slate-300">
                      {system.category}
                    </span>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                      {system.executiveSummary}
                    </div>
                  </td>

                  {/* Tech Stack & Protocols */}
                  <td className="py-4 px-4">
                    <div className="text-[11px] text-slate-200 font-mono mb-1 truncate max-w-xs">
                      {system.techStack}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {system.protocols.map(p => (
                        <span key={p} className="px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-mono">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Managed Entities */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {system.managedEntities.slice(0, 3).map(ent => (
                        <span key={ent} className="px-1.5 py-0.5 rounded bg-slate-850 text-slate-300 text-[10px] truncate">
                          {ent}
                        </span>
                      ))}
                      {system.managedEntities.length > 3 && (
                        <span className="text-[10px] text-slate-400">
                          +{system.managedEntities.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* SLA & Health */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-bold text-emerald-400 font-mono">{system.sla.targetUptime}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {system.sla.avgLatency} avg
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-right">
                    <button className="p-1.5 rounded-lg bg-slate-850 group-hover:bg-blue-600 text-slate-400 group-hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
