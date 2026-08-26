import React, { useState, useMemo } from 'react';
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
  Sparkles,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Zap,
  Flame,
  BarChart2,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { SystemNode, LifecycleStageId } from '../types';

interface NodeDetailDrawerProps {
  system: SystemNode | null;
  onClose: () => void;
  allSystems: SystemNode[];
  onSelectOtherSystem: (system: SystemNode) => void;
  onLaunchSimulationForSystem: (systemId: string) => void;
}

interface DayPerformanceSnapshot {
  dayNumber: number;
  date: string;
  shortDate: string;
  uptime: number; // e.g. 99.98
  latency: number; // ms, e.g. 38
  requests: number; // count
  incidents: number; // 0 or 1
  status: 'optimal' | 'normal' | 'degraded';
  outageMinutes: number;
}

/**
 * Deterministically generates realistic 30-day historical performance data for any system node
 */
function generate30DayHistoricalData(system: SystemNode): DayPerformanceSnapshot[] {
  let seed = 0;
  for (let i = 0; i < system.id.length; i++) {
    seed = (seed * 31 + system.id.charCodeAt(i)) % 10000;
  }

  // Parse target uptime (e.g., "99.95%" -> 99.95)
  const baseUptime = parseFloat(system.sla.targetUptime) || 99.95;
  const baseLatency = parseInt(system.sla.avgLatency) || 40;
  const baseTraffic = system.sla.activeUsersToday || 50000;

  const results: DayPerformanceSnapshot[] = [];
  const referenceDate = new Date(2026, 7, 25); // August 25, 2026

  for (let i = 29; i >= 0; i--) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const shortDate = d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });

    // Deterministic pseudo-random variation
    const daySeed = (seed + i * 23 + (i % 7) * 11) % 100;
    
    // Rare slight dip (e.g. routine patch window or transient peak)
    let uptimeDip = 0;
    let latencySpike = 0;
    let incidents = 0;
    let outageMinutes = 0;

    if (daySeed === 13 && system.id !== 'employee') {
      uptimeDip = 0.14; // 99.85%
      latencySpike = 32;
      incidents = 1;
      outageMinutes = 2.1;
    } else if (daySeed === 58 && system.id !== 'employee') {
      uptimeDip = 0.06; // 99.93%
      latencySpike = 16;
      outageMinutes = 0.8;
    } else {
      uptimeDip = (daySeed % 6) * 0.004;
      latencySpike = ((daySeed % 9) - 4) * 1.5;
    }

    const uptimeRaw = baseUptime - uptimeDip + ((daySeed % 4) * 0.003);
    const uptime = Math.min(100, Math.max(99.4, Number(uptimeRaw.toFixed(3))));
    const latency = Math.max(8, Math.round(baseLatency + latencySpike));
    const trafficVariation = Math.round(baseTraffic * (0.88 + (daySeed % 25) / 100));

    let status: 'optimal' | 'normal' | 'degraded' = 'optimal';
    if (uptime < 99.9) {
      status = 'degraded';
    } else if (uptime < 99.97) {
      status = 'normal';
    }

    results.push({
      dayNumber: 30 - i,
      date: dateStr,
      shortDate,
      uptime,
      latency,
      requests: trafficVariation,
      incidents,
      status,
      outageMinutes: Number(outageMinutes.toFixed(1))
    });
  }

  return results;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  system,
  onClose,
  allSystems,
  onSelectOtherSystem,
  onLaunchSimulationForSystem,
}) => {
  if (!system) return null;

  const [timeRange, setTimeRange] = useState<'30D' | '14D' | '7D'>('30D');
  const [activeMetric, setActiveMetric] = useState<'uptime' | 'latency' | 'requests'>('uptime');
  const [hoveredDay, setHoveredDay] = useState<DayPerformanceSnapshot | null>(null);

  // Generate 30-day historical data
  const fullHistoricalData = useMemo(() => {
    return generate30DayHistoricalData(system);
  }, [system]);

  // Filtered slice based on selected time range
  const chartData = useMemo(() => {
    if (timeRange === '7D') return fullHistoricalData.slice(23);
    if (timeRange === '14D') return fullHistoricalData.slice(16);
    return fullHistoricalData;
  }, [fullHistoricalData, timeRange]);

  // Derived 30-day aggregate metrics
  const stats = useMemo(() => {
    const totalUptime = chartData.reduce((sum, d) => sum + d.uptime, 0);
    const avgUptime = (totalUptime / chartData.length).toFixed(3);
    const minUptime = Math.min(...chartData.map(d => d.uptime));
    const avgLatency = Math.round(chartData.reduce((sum, d) => sum + d.latency, 0) / chartData.length);
    const totalOutageMinutes = chartData.reduce((sum, d) => sum + d.outageMinutes, 0).toFixed(1);
    const incidentFreeDays = chartData.filter(d => d.incidents === 0).length;
    const targetUptimeNum = parseFloat(system.sla.targetUptime) || 99.95;
    const isSlaMet = parseFloat(avgUptime) >= targetUptimeNum;

    return {
      avgUptime,
      minUptime,
      avgLatency,
      totalOutageMinutes,
      incidentFreeDays,
      totalDays: chartData.length,
      targetUptimeNum,
      isSlaMet
    };
  }, [chartData, system.sla.targetUptime]);

  const upstreamObjects = system.upstreamSystems
    .map(id => allSystems.find(s => s.id === id))
    .filter(Boolean) as SystemNode[];

  const downstreamObjects = system.downstreamSystems
    .map(id => allSystems.find(s => s.id === id))
    .filter(Boolean) as SystemNode[];

  // Dynamic Y-axis min for uptime to make subtle variations easily observable
  const yAxisUptimeDomain = useMemo(() => {
    const lowest = Math.min(...chartData.map(d => d.uptime));
    const minDomain = Math.max(99.0, Math.floor((lowest - 0.05) * 10) / 10);
    return [minDomain, 100];
  }, [chartData]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="node-detail-drawer">
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
              aria-label="Close drawer"
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

            {/* ============================================================ */}
            {/* 30-DAY HISTORICAL PERFORMANCE & UPTIME SNAPSHOT (RECHARTS)    */}
            {/* ============================================================ */}
            <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-750 shadow-md space-y-3.5">
              
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-750">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200 text-xs flex items-center space-x-1.5">
                      <span>Historical Uptime & SLA Trend</span>
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {stats.isSlaMet ? 'SLA Met' : 'SLA Warning'}
                      </span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {timeRange} snapshot • Target SLA {system.sla.targetUptime}
                    </span>
                  </div>
                </div>

                {/* Range Selector */}
                <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700 self-start sm:self-auto">
                  {(['7D', '14D', '30D'] as const).map(range => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
                        timeRange === range
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metric Toggle Tabs */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveMetric('uptime')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                    activeMetric === 'uptime'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800 border-slate-700/80 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Uptime (%)</span>
                </button>

                <button
                  onClick={() => setActiveMetric('latency')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                    activeMetric === 'latency'
                      ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                      : 'bg-slate-800 border-slate-700/80 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>Latency (ms)</span>
                </button>

                <button
                  onClick={() => setActiveMetric('requests')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                    activeMetric === 'requests'
                      ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                      : 'bg-slate-800 border-slate-700/80 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span>Daily Traffic</span>
                </button>
              </div>

              {/* Recharts Interactive Trend Line Chart */}
              <div className="h-44 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  {activeMetric === 'uptime' ? (
                    <AreaChart 
                      data={chartData} 
                      margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                      onMouseMove={(e: any) => {
                        if (e?.activePayload?.[0]?.payload) {
                          setHoveredDay(e.activePayload[0].payload as DayPerformanceSnapshot);
                        }
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      <defs>
                        <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                      <XAxis 
                        dataKey="shortDate" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                        interval={timeRange === '30D' ? 4 : timeRange === '14D' ? 2 : 0}
                      />
                      <YAxis 
                        domain={yAxisUptimeDomain} 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false}
                        tickFormatter={(val) => `${val.toFixed(1)}%`}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload as DayPerformanceSnapshot;
                            return (
                              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs space-y-1 font-mono">
                                <div className="text-slate-300 font-bold flex items-center justify-between gap-4">
                                  <span>{d.date}</span>
                                  <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase ${
                                    d.status === 'optimal' 
                                      ? 'bg-emerald-500/20 text-emerald-300' 
                                      : d.status === 'normal' 
                                        ? 'bg-cyan-500/20 text-cyan-300' 
                                        : 'bg-rose-500/20 text-rose-300'
                                  }`}>
                                    {d.status}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4 text-emerald-400 font-bold">
                                  <span className="text-slate-400">Uptime:</span>
                                  <span>{d.uptime.toFixed(3)}%</span>
                                </div>
                                <div className="flex justify-between gap-4 text-slate-300">
                                  <span className="text-slate-400">Latency:</span>
                                  <span>{d.latency}ms</span>
                                </div>
                                <div className="flex justify-between gap-4 text-slate-300">
                                  <span className="text-slate-400">Downtime:</span>
                                  <span>{d.outageMinutes > 0 ? `${d.outageMinutes}m` : '0m'}</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }} 
                      />
                      <ReferenceLine 
                        y={stats.targetUptimeNum} 
                        stroke="#f43f5e" 
                        strokeDasharray="3 3" 
                        label={{
                          value: `Target: ${stats.targetUptimeNum}%`,
                          fill: '#f43f5e',
                          fontSize: 9,
                          position: 'top'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="uptime" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill="url(#uptimeGrad)" 
                        activeDot={{ r: 5, stroke: '#34d399', strokeWidth: 2, fill: '#064e3b' }}
                      />
                    </AreaChart>
                  ) : activeMetric === 'latency' ? (
                    <AreaChart 
                      data={chartData} 
                      margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                      <XAxis 
                        dataKey="shortDate" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                        interval={timeRange === '30D' ? 4 : timeRange === '14D' ? 2 : 0}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false}
                        tickFormatter={(val) => `${val}ms`}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload as DayPerformanceSnapshot;
                            return (
                              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs space-y-1 font-mono">
                                <div className="text-slate-300 font-bold">{d.date}</div>
                                <div className="flex justify-between gap-4 text-blue-400 font-bold">
                                  <span className="text-slate-400">Response Latency:</span>
                                  <span>{d.latency}ms</span>
                                </div>
                                <div className="flex justify-between gap-4 text-slate-300">
                                  <span className="text-slate-400">Uptime:</span>
                                  <span>{d.uptime.toFixed(3)}%</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="latency" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill="url(#latencyGrad)" 
                        activeDot={{ r: 5, stroke: '#60a5fa', strokeWidth: 2, fill: '#1e3a8a' }}
                      />
                    </AreaChart>
                  ) : (
                    <AreaChart 
                      data={chartData} 
                      margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                      <XAxis 
                        dataKey="shortDate" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                        interval={timeRange === '30D' ? 4 : timeRange === '14D' ? 2 : 0}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false}
                        tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload as DayPerformanceSnapshot;
                            return (
                              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs space-y-1 font-mono">
                                <div className="text-slate-300 font-bold">{d.date}</div>
                                <div className="flex justify-between gap-4 text-purple-400 font-bold">
                                  <span className="text-slate-400">Transactions:</span>
                                  <span>{d.requests.toLocaleString()} req</span>
                                </div>
                                <div className="flex justify-between gap-4 text-slate-300">
                                  <span className="text-slate-400">Latency:</span>
                                  <span>{d.latency}ms</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="requests" 
                        stroke="#a855f7" 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill="url(#reqGrad)" 
                        activeDot={{ r: 5, stroke: '#c084fc', strokeWidth: 2, fill: '#581c87' }}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* 30-Day Day Status Strip (Heat/Status Bar) */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 font-mono">
                  <span>30-Day Health Ribbon ({stats.incidentFreeDays}/30 Days Incident-Free)</span>
                  <span>100% Operational Today</span>
                </div>
                <div className="flex items-center gap-1 w-full overflow-x-auto pb-1">
                  {fullHistoricalData.map((d) => (
                    <div
                      key={d.dayNumber}
                      title={`${d.date}: ${d.uptime.toFixed(3)}% uptime (${d.status})`}
                      className={`flex-1 h-3.5 min-w-[7px] rounded-sm transition-transform hover:scale-125 cursor-pointer ${
                        d.status === 'optimal'
                          ? 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.5)]'
                          : d.status === 'normal'
                            ? 'bg-cyan-500 hover:bg-cyan-400'
                            : 'bg-rose-500 hover:bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.7)]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Aggregated 30-Day KPI Row */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 block mb-0.5">30D Avg Uptime</span>
                  <span className="font-mono font-bold text-emerald-400 text-xs">{stats.avgUptime}%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Lowest Day</span>
                  <span className="font-mono font-bold text-amber-400 text-xs">{stats.minUptime.toFixed(2)}%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 block mb-0.5">30D Downtime</span>
                  <span className="font-mono font-bold text-slate-200 text-xs">{stats.totalOutageMinutes} min</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 block mb-0.5">SLA Standard</span>
                  <span className="font-mono font-bold text-blue-400 text-xs flex items-center justify-center space-x-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Met</span>
                  </span>
                </div>
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
