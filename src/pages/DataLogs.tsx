import { useState, useEffect } from "react";
import { Search, ArrowUpDown, Filter, Download, Database } from "lucide-react";
import { motion } from "motion/react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

interface LogEntry {
  value: number;
  timestamp: string;
}

export default function DataLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSorting, setIsSorting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    const path = "metrics";
    try {
      const q = query(collection(db, path), orderBy("createdAt", "desc"), limit(50));
      const querySnapshot = await getDocs(q);
      const fetchedLogs = querySnapshot.docs.map(doc => ({
        value: doc.data().disk,
        timestamp: doc.data().timestamp
      }));
      setLogs(fetchedLogs);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSort = async () => {
    setIsSorting(true);
    try {
      const res = await fetch("/api/algo/sort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: logs })
      });
      const sortedData = await res.json();
      if (!sortedData.error) {
        setLogs(sortedData);
      }
    } catch (err) {
      console.error("Sorting failed", err);
    } finally {
      setIsSorting(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.timestamp.includes(searchTerm) || log.value.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase">System Logs</h1>
          <p className="text-zinc-500 text-sm">Persistence layer for OS activity monitoring.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSort}
            disabled={isSorting}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          >
            <ArrowUpDown size={16} />
            {isSorting ? "C-Sort Processing..." : "Quick Sort (C-Alg)"}
          </button>
          <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
            <Download size={18} />
          </button>
        </div>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search logs (timestamp, value)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <Filter size={14} />
            <span>Last 24 Hours</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-950 text-zinc-500 uppercase text-[10px] tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Index</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Metric Value</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-zinc-500 animate-pulse">
                    Retrieving records from DBMS...
                  </td>
                </tr>
              ) : filteredLogs.map((log, idx) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={idx} 
                  className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-zinc-600">{idx + 1}</td>
                  <td className="px-6 py-4 text-zinc-300">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="font-bold text-white">{log.value}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-400 uppercase font-bold tracking-tight">Disk I/O</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-500 hover:text-white">
                      <Database size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-zinc-500">
                    No logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
