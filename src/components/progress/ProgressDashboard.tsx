import React from 'react';
import { ProgressChart } from './ProgressChart';
import { ComparisonCard } from './ComparisonCard';
import { motion } from 'framer-motion';

interface ProgressDashboardProps {
  userId: number | string;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ userId }) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-3xl font-bold text-white tracking-tight">Tu Progreso</h2>
        <p className="text-gray-400">Mantén el registro de tu evolución y celebra tus logros.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gráfica principal - Toma 7 columnas en pantallas grandes */}
        <div className="lg:col-span-7">
          <ProgressChart userId={userId} />
        </div>

        {/* Comparativa - Toma 5 columnas en pantallas grandes */}
        <div className="lg:col-span-5">
          <ComparisonCard userId={userId} />
        </div>
      </div>
    </div>
  );
};
