/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Database, 
  Terminal, 
  BrainCircuit, 
  ChevronRight, 
  Cpu, 
  HardDrive, 
  Activity,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth } from "./lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import Dashboard from "./pages/Dashboard";
import DataLogs from "./pages/DataLogs";
import Prediction from "./pages/Prediction";
import AlgoAnalysis from "./pages/AlgoAnalysis";
import Login from "./components/Login";

type Page = "dashboard" | "logs" | "prediction" | "algorithms";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleLogout = () => signOut(auth);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "logs", label: "Data Logs", icon: Database },
    { id: "prediction", label: "ML Prediction", icon: BrainCircuit },
    { id: "algorithms", label: "Algorithms", icon: Terminal },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "logs": return <DataLogs />;
      case "prediction": return <Prediction />;
      case "algorithms": return <AlgoAnalysis />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex font-sans">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-zinc-950 border-r border-zinc-800
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"}
      `}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 px-2 mb-10 overflow-hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <Activity className="text-white w-5 h-5" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">DiskInsight AI</span>
            )}
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as Page)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group
                  ${activePage === item.id 
                    ? "bg-indigo-600/10 text-indigo-400" 
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"}
                `}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                {activePage === item.id && sidebarOpen && (
                  <motion.div layoutId="activeInd" className="ml-auto">
                    <ChevronRight size={14} />
                  </motion.div>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-4 space-y-4">
             <button
               onClick={handleLogout}
               className="w-full flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all group"
             >
               <LogOut className="w-5 h-5" />
               {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
             </button>

             <div className="pt-4 border-t border-zinc-900 overflow-hidden">
               <div className="flex items-center gap-3 px-2">
                  <img src={user.photoURL || ""} alt="" className="w-8 h-8 rounded-full bg-zinc-800" />
                  {sidebarOpen && (
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold truncate leading-none">{user.displayName || "User"}</p>
                      <p className="text-[10px] text-zinc-500 truncate mt-1">{user.email}</p>
                    </div>
                  )}
               </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
