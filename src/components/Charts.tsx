import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler,
  BarElement
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#18181b',
      titleColor: '#a1a1aa',
      bodyColor: '#fff',
      borderColor: '#27272a',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#71717a',
        font: { size: 10 }
      }
    },
    y: {
      grid: {
        color: '#27272a'
      },
      ticks: {
        color: '#71717a',
        font: { size: 10 }
      }
    }
  }
};

interface ChartProps {
  data: any;
  options?: any;
  height?: number;
}

export function SystemLineChart({ data, options = defaultOptions, height = 300 }: ChartProps) {
  return (
    <div style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
}

export function SystemBarChart({ data, options = defaultOptions, height = 300 }: ChartProps) {
  return (
    <div style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
}
