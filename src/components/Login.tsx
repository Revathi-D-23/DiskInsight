import { useState } from "react";
import { auth } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Activity, ShieldCheck, Cpu } from "lucide-react";
import { motion } from "motion/react";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
            <Activity className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2 uppercase">DiskInsight AI</h1>
          <p className="text-zinc-500 text-sm">Professional ML-Based Disk I/O Performance Analysis Suite</p>
        </div>

        <div className="space-y-4 mb-10">
          <div className="flex items-start gap-4 p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800/50">
            <ShieldCheck className="text-indigo-400 mt-1 shrink-0" size={20} />
            <div>
              <p className="text-sm font-semibold text-zinc-100">Secure DBMS Storage</p>
              <p className="text-xs text-zinc-500">Persistent OS metrics via Firebase Cloud Firestore.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800/50">
            <Cpu className="text-emerald-400 mt-1 shrink-0" size={20} />
            <div>
              <p className="text-sm font-semibold text-zinc-100">Low-level C Integration</p>
              <p className="text-xs text-zinc-500">High-performance DAA algorithm ranking.</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>
        
        <p className="text-center mt-6 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
           Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
}
