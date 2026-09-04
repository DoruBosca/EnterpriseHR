import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { NodeDetailDrawer } from './components/NodeDetailDrawer';
import { LifecycleExplorer } from './components/LifecycleExplorer';
import { ReportingAnalytics } from './components/ReportingAnalytics';
import { IntegrationMatrix } from './components/IntegrationMatrix';
import { ProcessSimulator } from './components/ProcessSimulator';
import { AIAdvisorModal } from './components/AIAdvisorModal';

import { 
  SYSTEM_NODES, 
  LIFECYCLE_PHASES, 
  PROCESS_SIMULATION_SCENARIOS, 
  SAMPLE_EMPLOYEES 
} from './data/hrArchitectureData';
import { SystemNode, LifecycleStageId, UserPersona } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'lifecycle' | 'analytics' | 'matrix' | 'simulator'>('architecture');
  const [currentPersona, setCurrentPersona] = useState<UserPersona>('HR Specialist');
  const [selectedLifecycleFilter, setSelectedLifecycleFilter] = useState<LifecycleStageId | 'all'>('all');
  
  // Selected system for inspection drawer
  const [selectedNode, setSelectedNode] = useState<SystemNode | null>(null);
  
  // Active lifecycle stage in Lifecycle Explorer
  const [activeLifecycleStage, setActiveLifecycleStage] = useState<LifecycleStageId>('onboard');

  // Active scenario in Simulator
  const [activeScenarioId, setActiveScenarioId] = useState<string>('scenario_new_hire');

  // AI Advisor modal visibility
  const [isAdvisorOpen, setIsAdvisorOpen] = useState<boolean>(false);

  // Health count
  const operationalCount = SYSTEM_NODES.filter(s => s.sla.status === 'Operational').length;

  const handleLaunchSimulationForSystem = (systemId: string) => {
    setSelectedNode(null);
    if (systemId === 'onboarding_app' || systemId === 'oneid_itsp') {
      setActiveScenarioId('scenario_new_hire');
    } else if (systemId === 'cptm_competence' || systemId === 'hr_academy' || systemId === 'learnhub_trainm') {
      setActiveScenarioId('scenario_leadership_promo');
    } else {
      setActiveScenarioId('scenario_transition_offboarding');
    }
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white font-sans antialiased">
      
      {/* Top Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentPersona={currentPersona}
        setCurrentPersona={setCurrentPersona}
        selectedLifecycleFilter={selectedLifecycleFilter}
        setSelectedLifecycleFilter={setSelectedLifecycleFilter}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        systemStatusCount={{ operational: operationalCount, total: SYSTEM_NODES.length }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Interactive Architecture Blueprint */}
        {activeTab === 'architecture' && (
          <ArchitectureDiagram
            systems={SYSTEM_NODES}
            selectedNode={selectedNode}
            onSelectNode={(node) => setSelectedNode(node)}
            selectedLifecycleFilter={selectedLifecycleFilter}
            currentPersona={currentPersona}
            onSimulateScenario={(id) => {
              setActiveScenarioId(id);
              setActiveTab('simulator');
            }}
          />
        )}

        {/* Tab 2: Employee Lifecycle Explorer (5 Stages) */}
        {activeTab === 'lifecycle' && (
          <LifecycleExplorer
            phases={LIFECYCLE_PHASES}
            activePhaseId={activeLifecycleStage}
            onSelectPhase={(phaseId) => setActiveLifecycleStage(phaseId)}
            employees={SAMPLE_EMPLOYEES}
            allSystems={SYSTEM_NODES}
            onSelectSystem={(sys) => setSelectedNode(sys)}
          />
        )}

        {/* Tab 3: Power BI Style Analytics Dashboard */}
        {activeTab === 'analytics' && (
          <ReportingAnalytics />
        )}

        {/* Tab 4: Integration Matrix & Systems Catalog */}
        {activeTab === 'matrix' && (
          <IntegrationMatrix
            systems={SYSTEM_NODES}
            onSelectSystem={(sys) => setSelectedNode(sys)}
            selectedLifecycleFilter={selectedLifecycleFilter}
          />
        )}

        {/* Tab 5: Live Process & Workflow Simulator */}
        {activeTab === 'simulator' && (
          <ProcessSimulator
            scenarios={PROCESS_SIMULATION_SCENARIOS}
            activeScenarioId={activeScenarioId}
            onSelectScenario={(id) => setActiveScenarioId(id)}
            allSystems={SYSTEM_NODES}
            onSelectSystem={(sys) => setSelectedNode(sys)}
          />
        )}

      </main>

      {/* Node Detail Drawer for in-depth system inspection */}
      <NodeDetailDrawer
        system={selectedNode}
        onClose={() => setSelectedNode(null)}
        allSystems={SYSTEM_NODES}
        onSelectOtherSystem={(sys) => setSelectedNode(sys)}
        onLaunchSimulationForSystem={handleLaunchSimulationForSystem}
      />

      {/* AI Systems & Process Advisor Modal */}
      <AIAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        allSystems={SYSTEM_NODES}
        currentLifecycleFilter={selectedLifecycleFilter}
        currentPersona={currentPersona}
      />

      {/* Enterprise Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>Hire → Onboard → Develop → Retain → Transition (99.96% SLA)</span>
        </div>
      </footer>

    </div>
  );
}
