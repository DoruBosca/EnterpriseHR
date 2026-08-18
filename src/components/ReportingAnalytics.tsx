import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Award,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  WORKFORCE_ANALYTICS_METRICS, 
  MONTHLY_LIFECYCLE_VOLUME, 
  COMPETENCY_GAP_BY_DIVISION, 
  PLATFORM_API_TRAFFIC_DATA 
} from '../data/hrArchitectureData';

export const ReportingAnalytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'YTD' | 'Last12M' | 'Q3'>('YTD');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Power BI Executive Summary Report downloaded as PDF.');
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              HR Reporting Platform (Power BI Analytics)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time workforce intelligence, onboarding SLAs, competency heatmaps, and cross-platform telemetry
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Timeframe selector */}
          <div className="flex items-center bg-slate-850 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setSelectedTimeframe('YTD')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedTimeframe === 'YTD' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              YTD 2026
            </button>
            <button
              onClick={() => setSelectedTimeframe('Last12M')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedTimeframe === 'Last12M' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Trailing 12M
            </button>
          </div>

          {/* Export Report */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold shadow-sm transition-colors active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* Top 6 Power BI KPI Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {WORKFORCE_ANALYTICS_METRICS.map((metric) => (
          <div 
            key={metric.id}
            className="p-4 rounded-2xl bg-slate-800/80 border border-slate-750/80 shadow-md text-left flex flex-col justify-between hover:border-slate-600 transition-colors"
          >
            <span className="text-[11px] font-medium text-slate-400 truncate block mb-1">
              {metric.label}
            </span>
            <div className="text-xl font-bold text-white font-mono tracking-tight my-1">
              {metric.value}
            </div>
            <div className="flex items-center space-x-1.5 text-[10px]">
              {metric.isPositive ? (
                <span className="text-emerald-400 font-bold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  +{metric.changePercent}%
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center">
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                  {metric.changePercent}%
                </span>
              )}
              <span className="text-slate-400 truncate">{metric.timeframe}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Monthly Lifecycle Volume & Pipeline Throughput */}
        <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Monthly Lifecycle Pipeline Volume
              </h3>
              <p className="text-[11px] text-slate-400">
                New Hires, Onboarded Employees, and Learning Completions
              </p>
            </div>
            <span className="text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded">
              Aggregated Stream
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_LIFECYCLE_VOLUME} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOnboarded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} 
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="trainingCompletions" name="Training Completions" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCompletions)" />
                <Area type="monotone" dataKey="onloaded" name="Onboarded Employees" stroke="#10b981" fillOpacity={1} fill="url(#colorOnboarded)" />
                <Area type="monotone" dataKey="newHires" name="New Hires" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHires)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Competency Target vs Actual Levels by Division */}
        <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Competency Coverage & Gap Index (CptM)
              </h3>
              <p className="text-[11px] text-slate-400">
                Target vs Actual Capability Score by Strategic Business Unit
              </p>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
              CptM Matrix
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMPETENCY_GAP_BY_DIVISION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="division" stroke="#94a3b8" fontSize={10} angle={-15} textAnchor="end" height={40} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[70, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} 
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="targetLevel" name="Target Benchmark Score" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actualLevel" name="Actual Workforce Score" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Platform API Transaction Volume & System Response Time */}
        <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-md lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                HR Core Platforms — Ingestion Throughput & Response Latency
              </h3>
              <p className="text-[11px] text-slate-400">
                Telemetry monitoring REST, SCIM, OData, and Kafka pipelines feeding into Power BI
              </p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
              Live Gateway Feed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PLATFORM_API_TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="platform" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} 
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="requestsPerMin" name="Requests / Min" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Platform SLA Health List */}
            <div className="space-y-2 p-3 rounded-xl bg-slate-850 border border-slate-750 text-xs">
              <div className="font-bold text-slate-300 pb-1 border-b border-slate-750 flex items-center justify-between">
                <span>Platform Response Time</span>
                <span>Error Rate</span>
              </div>
              {PLATFORM_API_TRAFFIC_DATA.map((plat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
                  <span className="text-slate-300 font-medium truncate max-w-[120px]">{plat.platform}</span>
                  <div className="flex items-center space-x-3 font-mono">
                    <span className="text-blue-400">{plat.avgLatencyMs}ms</span>
                    <span className="text-emerald-400">{plat.errorRatePercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
