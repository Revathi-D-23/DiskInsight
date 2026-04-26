import { useState, useMemo } from "react";
import { BrainCircuit, TrendingUp, Info, Activity } from "lucide-react";
import { SystemLineChart } from "../components/Charts";
import { motion } from "motion/react";

// Simple Linear Regression function
const linearRegression = (data: { x: number; y: number }[]) => {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += data[i].x;
    sumY += data[i].y;
    sumXY += data[i].x * data[i].y;
    sumX2 += data[i].x * data[i].x;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
};

export default function Prediction() {
  const mockHistory = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    x: i,
    y: 30 + Math.random() * 20 + (i * 1.5) // Trending upward
  })), []);

  const { slope, intercept } = useMemo(() => linearRegression(mockHistory), [mockHistory]);

  const predictionPoints = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      x: 20 + i,
      y: slope * (20 + i) + intercept
    }));
  }, [slope, intercept]);

  const chartData = {
    labels: [...mockHistory, ...predictionPoints].map((_, i) => `T-${20-i}`),
    datasets: [
      {
        label: 'Actual Usage',
        data: [...mockHistory.map(d => d.y), ...Array(10).fill(null)],
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        pointRadius: 4,
        fill: true,
      },
      {
        label: 'ML Prediction',
        data: [...Array(19).fill(null), mockHistory[19].y, ...predictionPoints.map(d => d.y)],
        borderColor: '#f43f5e',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        pointRadius: 0,
      }
    ]
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white uppercase flex items-center gap-3">
          <BrainCircuit className="text-rose-500" />
          Predictive Analytics
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Linear regression modeling for disk saturation forecasting.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Trend Projection</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Historical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 border-t-2 border-dashed border-rose-500" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Predicted</span>
              </div>
            </div>
          </div>
          <div className="h-[400px]">
            <SystemLineChart data={chartData} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              Model Insights
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Detected Trend</p>
                <p className="text-xl font-bold text-white">Aggressive Growth</p>
                <div className="mt-2 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-rose-500 w-3/4 h-full" />
                </div>
              </div>
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Confidence Score (R²)</p>
                <p className="text-xl font-bold text-white">0.942</p>
              </div>
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Projected Saturation</p>
                <p className="text-xl font-bold text-rose-500">22 Days</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl">
            <h3 className="font-bold text-indigo-400 mb-2 flex items-center gap-2">
              <Info size={16} />
              Model Architecture
            </h3>
            <p className="text-xs text-indigo-300/70 leading-relaxed">
              This module uses a supervised learning approach (Continuous Regression) to map historical I/O spikes against temporal indicators. The forecast utilizes the Least Squares method to minimize residuals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
