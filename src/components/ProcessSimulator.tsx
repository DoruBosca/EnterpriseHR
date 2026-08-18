import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Code2, 
  Activity, 
  Server, 
  Terminal, 
  Clock, 
  Layers,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProcessSimulationScenario, SystemNode } from '../types';

interface ProcessSimulatorProps {
  scenarios: ProcessSimulationScenario[];
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
  allSystems: SystemNode[];
  onSelectSystem: (system: SystemNode) => void;
}

export const ProcessSimulator: React.FC<ProcessSimulatorProps> = ({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  allSystems,
  onSelectSystem,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  const scenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];
  const currentStep = scenario.steps[currentStepIndex] || scenario.steps[0];

  const getSystem = (id: string) => allSystems.find(s => s.id === id);

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStepIndex < scenario.steps.length - 1) {
          handleStepForward();
        } else {
          setIsPlaying(false);
          // Trigger subtle celebration upon scenario complete
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
            });
          } catch (e) {}
        }
      }, currentStep.statusDelayMs * 2.5);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, scenario]);

  const handleStepForward = () => {
    if (currentStepIndex < scenario.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const nextStep = scenario.steps[nextIndex];
      setCurrentStepIndex(nextIndex);
      setExecutionLogs(prev => [
        `[${new Date().toLocaleTimeString()}] STEP ${nextStep.stepNumber}: ${nextStep.title} (${nextStep.protocol}) -> ${nextStep.stateChange}`,
        ...prev
      ]);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setExecutionLogs([
      `[${new Date().toLocaleTimeString()}] Scenario initialized: ${scenario.title}`
    ]);
  };

  // Reset when scenario changes
  useEffect(() => {
    handleReset();
  }, [activeScenarioId]);

  const sourceSys = getSystem(currentStep.sourceSystemId);
  const targetSys = getSystem(currentStep.targetSystemId);

  return (
    <div className="space-y-6">
      
      {/* Header & Scenario Selector */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Play className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                HR Process & Data Flow Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Trigger live simulated enterprise workflows and watch cross-platform events, SCIM payloads, and audit streams
            </p>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                isPlaying 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Workflow' : 'Run Scenario'}</span>
            </button>

            <button
              onClick={handleStepForward}
              disabled={currentStepIndex >= scenario.steps.length - 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 disabled:opacity-40"
              title="Next Step"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scenario Selection Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-4">
          {scenarios.map(sc => (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`p-3 rounded-xl text-left border transition-all ${
                sc.id === scenario.id 
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm' 
                  : 'bg-slate-850 hover:bg-slate-750 border-slate-750 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span className="uppercase font-bold text-blue-400">{sc.lifecycleStage}</span>
                <span>{sc.steps.length} Steps</span>
              </div>
              <div className="font-bold text-xs text-white truncate">
                {sc.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Workflow Stage Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Live Visual Transaction Stepper */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step Progress Bar */}
          <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
              <span>Step {currentStepIndex + 1} of {scenario.steps.length}: <strong className="text-white">{currentStep.title}</strong></span>
              <span className="font-mono text-emerald-400">{Math.round(((currentStepIndex + 1) / scenario.steps.length) * 100)}% Complete</span>
            </div>
            
            <div className="w-full h-2 bg-slate-750 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / scenario.steps.length) * 100}%` }}
              />
            </div>

            {/* Visual Source -> Target Transmission Box */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-750 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                
                {/* Source Node */}
                <div 
                  onClick={() => sourceSys && onSelectSystem(sourceSys)}
                  className="w-full sm:w-56 p-4 rounded-xl bg-slate-850 border border-blue-500/40 text-center cursor-pointer hover:bg-slate-800 transition-colors shadow-lg"
                >
                  <span className="text-[10px] font-mono font-bold text-blue-400 block mb-1">SOURCE SYSTEM</span>
                  <h4 className="font-bold text-sm text-white">{sourceSys?.name || currentStep.sourceSystemId}</h4>
                  <span className="text-[11px] text-slate-400 font-mono mt-1 block">{sourceSys?.code}</span>
                </div>

                {/* Animated Transmission Rail */}
                <div className="flex flex-col items-center justify-center text-center space-y-1">
                  <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono text-amber-300 flex items-center space-x-1 shadow">
                    <Zap className="w-3 h-3 text-amber-400 animate-bounce" />
                    <span>{currentStep.protocol}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <div className="w-12 h-0.5 bg-blue-500 animate-pulse" />
                    <ArrowRight className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <div className="w-12 h-0.5 bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">latency ~{currentStep.statusDelayMs}ms</span>
                </div>

                {/* Target Node */}
                <div 
                  onClick={() => targetSys && onSelectSystem(targetSys)}
                  className="w-full sm:w-56 p-4 rounded-xl bg-slate-850 border border-emerald-500/40 text-center cursor-pointer hover:bg-slate-800 transition-colors shadow-lg"
                >
                  <span className="text-[10px] font-mono font-bold text-emerald-400 block mb-1">TARGET SINK</span>
                  <h4 className="font-bold text-sm text-white">{targetSys?.name || currentStep.targetSystemId}</h4>
                  <span className="text-[11px] text-slate-400 font-mono mt-1 block">{targetSys?.code}</span>
                </div>

              </div>

              {/* Action Description */}
              <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-300 leading-relaxed bg-slate-850/70 p-3.5 rounded-xl">
                <span className="text-white font-bold block mb-1">Transaction Execution:</span>
                {currentStep.actionDescription}
              </div>
            </div>

            {/* State Change Outcome */}
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>State Mutation:</strong> {currentStep.stateChange}</span>
            </div>
          </div>

          {/* Sequential Step Cards */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Complete Scenario Steps ({scenario.steps.length})
            </h4>
            <div className="space-y-2">
              {scenario.steps.map((st, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isCompleted = idx < currentStepIndex;
                return (
                  <div
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : isCompleted
                        ? 'bg-slate-850 border-slate-750 text-slate-300 opacity-80'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                        isCurrent ? 'bg-blue-500 text-white' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {st.stepNumber}
                      </span>
                      <span className="text-xs font-semibold">{st.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{st.protocol}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 1 Column: JSON Payload Inspector & Terminal Audit Stream */}
        <div className="space-y-6">
          
          {/* JSON Payload Inspector */}
          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-3">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live API Payload Inspector
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">JSON</span>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-72 scrollbar-thin">
              {JSON.stringify(currentStep.payloadSample, null, 2)}
            </pre>
          </div>

          {/* Audit Stream Logs */}
          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Real-Time Audit Stream
                </h4>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 animate-pulse">● LIVE</span>
            </div>

            <div className="space-y-1.5 font-mono text-[10px] text-slate-400 max-h-60 overflow-y-auto pr-1">
              {executionLogs.map((log, idx) => (
                <div key={idx} className="p-1.5 rounded bg-slate-950/80 border border-slate-850 text-slate-300">
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
