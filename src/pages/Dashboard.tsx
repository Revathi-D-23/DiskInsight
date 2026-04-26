import { useState, useEffect } from "react";
import { HardDrive, Cpu, Activity, AlertTriangle, ArrowUpRight, BrainCircuit } from "lucide-react";
import MetricCard from "../components/MetricCard";
import { SystemLineChart } from "../components/Charts";
import { motion } from "motion/react";

interface Metrics {
  disk: number;
  cpu: number;
  memory: number;
  timestamp: string;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics>({ disk: 0, cpu: 0, memory: 0, timestamp: "" });
  const [history, setHistory] = useState<Metrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/metrics");
        const data = await res.json();
        setMetrics(data);
        setHistory(prev => [...prev.slice(-19), data]);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch metrics", err);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: history.map(h => new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })),
    datasets: [
      {
        label: 'CPU Usage',
        data: history.map(h => h.cpu),
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Disk I/O',
        data: history.map(h => h.disk),
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">System Overview</h1>
        <p className="text-zinc-500">Real-time performance monitoring and OS diagnostics.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Disk Usage" 
          value={metrics.disk} 
          unit="%" 
          icon={HardDrive} 
          color="text-amber-400"
          trend={2}
        />
        <MetricCard 
          title="CPU Performance" 
          value={metrics.cpu} 
          unit="%" 
          icon={Cpu} 
          color="text-indigo-400"
          trend={-5}
        />
        <MetricCard 
          title="Memory load" 
          value={Math.round(metrics.memory)} 
          unit="%" 
          icon={Activity} 
          color="text-emerald-400"
          trend={1}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Live Performance Stream</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-xs text-zinc-500">CPU</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs text-zinc-500">Disk</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
             {loading ? (
               <div className="w-full h-full flex items-center justify-center text-zinc-600 animate-pulse">
                 Initializing Stream...
               </div>
             ) : (
                <SystemLineChart data={chartData} />
             )}
          </div>
        </motion.div>

        {/* Alerts & Tasks */}
        <div className="space-y-6">
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <h2 className="text-lg font-bold mb-4">Integrity Monitor</h2>
              <div className="space-y-4">
                {metrics.disk > 80 && (
                  <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex gap-3 items-center">
                    <AlertTriangle className="text-rose-500 shrink-0" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-rose-500">Critical Disk Threshold</p>
                      <p className="text-xs text-rose-500/70">Disk usage has exceeded 80%. Optimization recommended.</p>
                    </div>
                  </div>
                )}
                <div className="bg-zinc-800/50 p-4 rounded-xl flex justify-between items-center group cursor-default">
                  <div>
                    <p className="text-sm font-medium">OS Kernel Status</p>
                    <p className="text-xs text-zinc-500">Linux 6.x / Container Environment</p>
                  </div>
                  <div className="px-2 py-1 bg-zinc-700 rounded text-[10px] font-bold uppercase tracking-wider">Stable</div>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-xl flex justify-between items-center group cursor-default">
                  <div>
                    <p className="text-sm font-medium">DB Connection</p>
                    <p className="text-xs text-zinc-500">Cloud Firestore (Active)</p>
                  </div>
                  <div className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-[10px] font-bold uppercase tracking-wider">Syncing</div>
                </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-2xl text-white">
              <div className="flex justify-between items-start mb-4">
                 <BrainCircuit size={28} />
                 <ArrowUpRight size={20} className="text-indigo-200" />
              </div>
              <h3 className="font-bold text-xl mb-1">AI Trend Analysis</h3>
              <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                Based on current I/O patterns, disk capacity is predicted to reach 90% in 14 days.
              </p>
              <button className="bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-lg text-xs font-bold w-full backdrop-blur-sm">
                 View Detailed Prediction
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
