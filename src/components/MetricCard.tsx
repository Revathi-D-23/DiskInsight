import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  color: string;
  trend?: number;
}

export default function MetricCard({ title, value, unit, icon: Icon, color, trend }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-zinc-500 text-sm font-medium">{title}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
          <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
}
