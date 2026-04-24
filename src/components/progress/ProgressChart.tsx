import React, { useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { progressService } from '@/api/progressService';
import { ChartPoint } from '@/types/progress';
import { motion } from 'framer-motion';
import { TrendingUp, Activity } from 'lucide-react';

interface ProgressChartProps {
  userId: number | string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ userId }) => {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await progressService.getUserChart(userId);
        
        // Format dates for the chart
        const formattedData = response.points.map((pt) => ({
          ...pt,
          displayDate: new Date(pt.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        }));
        
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchChartData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full h-72 flex items-center justify-center bg-gray-900/50 rounded-2xl border border-gray-800 animate-pulse">
        <Activity className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-72 flex flex-col items-center justify-center bg-gray-900/50 rounded-2xl border border-gray-800">
        <Activity className="w-12 h-12 text-gray-600 mb-4" />
        <p className="text-gray-400">Aún no hay datos suficientes para graficar.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Evolución de Peso
          </h3>
          <p className="text-sm text-gray-400">Historial en el tiempo (kg)</p>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="displayDate" 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#111827', 
                border: '1px solid #374151',
                borderRadius: '0.75rem',
                color: '#fff'
              }}
              itemStyle={{ color: '#818cf8' }}
            />
            <Area 
              type="monotone" 
              dataKey="weight" 
              stroke="#818cf8" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorWeight)" 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
