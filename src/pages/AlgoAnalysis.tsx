import { useState } from "react";
import { Terminal, Zap, Clock, Code2, Search } from "lucide-react";
import { motion } from "motion/react";

export default function AlgoAnalysis() {
  const [dataSize, setDataSize] = useState(100);

  const algorithms = [
    { name: "Quick Sort (C)", complexity: "O(n log n)", color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { name: "Binary Search (C)", complexity: "O(log n)", color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { name: "Selection Sort", complexity: "O(n²)", color: "text-rose-400", bg: "bg-rose-400/10" },
    { name: "Linear Search", complexity: "O(n)", color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white uppercase flex items-center gap-3">
          <Terminal className="text-indigo-500" />
          Algorithmic Analysis
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Benchmarking DAA implementations in low-level OS environments.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {algorithms.map((algo) => (
          <div key={algo.name} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <div className={`w-10 h-10 rounded-xl ${algo.bg} ${algo.color} flex items-center justify-center mb-4`}>
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-white mb-1">{algo.name}</h3>
            <p className="text-xs text-zinc-500 font-mono">{algo.complexity}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="font-bold">Performance Simulation</h2>
            <div className="flex gap-2">
              {[10, 100, 1000, 10000].map(size => (
                <button 
                  key={size}
                  onClick={() => setDataSize(size)}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase ${dataSize === size ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-500"}`}
                >
                  N={size}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">Quick Sort Execution Time</span>
                <span className="text-indigo-400 font-mono">{(dataSize * Math.log2(dataSize) / 10000).toFixed(4)} ms</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(Math.log2(dataSize) / Math.log2(10000)) * 100}%` }}
                   className="bg-indigo-500 h-full" 
                 />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">Binary Search Execution Time</span>
                <span className="text-emerald-400 font-mono">{(Math.log2(dataSize) / 10000).toFixed(6)} ms</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(Math.log2(dataSize) / 20) * 100}%` }}
                   className="bg-emerald-500 h-full" 
                 />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center gap-4">
                 <Clock className="text-zinc-500" size={24} />
                 <div>
                   <p className="text-[10px] text-zinc-500 uppercase font-bold">Avg. Latency</p>
                   <p className="text-lg font-bold text-white">0.024ms</p>
                 </div>
              </div>
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center gap-4">
                 <Code2 className="text-zinc-500" size={24} />
                 <div>
                   <p className="text-[10px] text-zinc-500 uppercase font-bold">Compiled via</p>
                   <p className="text-lg font-bold text-white">GCC v13</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col">
          <h2 className="font-bold mb-4">Implementation Snippet</h2>
          <div className="bg-black rounded-xl p-4 flex-1 overflow-auto">
            <pre className="text-[10px] text-zinc-400 leading-relaxed font-mono">
{`// C Implementation: Quick Sort
void quickSort(Log arr[], int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

// Complexity Analysis
// Average: O(n log n)
// Space: O(log n) stack`}
            </pre>
          </div>
          <button className="mt-4 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-lg transition-colors items-center flex justify-center gap-2">
            <Search size={14} />
            View Full Source
          </button>
        </div>
      </div>
    </div>
  );
}
