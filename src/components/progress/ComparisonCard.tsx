import React, { useEffect, useState } from 'react';
import { progressService } from '@/api/progressService';
import { ComparisonResponse } from '@/types/progress';
import { motion } from 'framer-motion';
import { ImageIcon, Scale, Activity } from 'lucide-react';

interface ComparisonCardProps {
  userId: number | string;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ userId }) => {
  const [data, setData] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        setLoading(true);
        const response = await progressService.getUserComparison(userId);
        setData(response);
      } catch (error) {
        console.error('Error fetching comparison:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchComparison();
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-900/50 rounded-2xl border border-gray-800 animate-pulse">
        <Activity className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!data || (!data.firstPhoto && !data.latestPhoto)) {
    return (
      <div className="w-full p-8 flex flex-col items-center justify-center bg-gray-900/50 rounded-2xl border border-gray-800">
        <ImageIcon className="w-12 h-12 text-gray-600 mb-4" />
        <p className="text-gray-400">Sube fotos de progreso para ver tu comparativa.</p>
      </div>
    );
  }

  // Helper para mostrar si subió o bajó
  const weightDiff = data.latestMetrics?.weight && data.firstMetrics?.weight
    ? data.latestMetrics.weight - data.firstMetrics.weight
    : 0;
  const isWeightDown = weightDiff < 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 overflow-hidden shadow-2xl"
    >
      <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Antes vs Ahora</h3>
        
        {data.firstMetrics && data.latestMetrics && (
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
              <Scale className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">
                <span className="line-through text-gray-500 mr-2">{data.firstMetrics.weight}kg</span>
                <span className="font-bold text-white">{data.latestMetrics.weight}kg</span>
              </span>
              {weightDiff !== 0 && (
                <span className={`text-xs font-bold ${isWeightDown ? 'text-green-400' : 'text-red-400'}`}>
                  ({weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)}kg)
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-1 bg-gray-800">
        {/* Antes */}
        <div className="relative group overflow-hidden bg-black aspect-[3/4]">
          {data.firstPhoto?.imageUrl ? (
            <img 
              src={data.firstPhoto.imageUrl} 
              alt="Antes" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <span className="text-gray-500">Sin foto inicial</span>
            </div>
          )}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-gray-700/50">
            <span className="text-xs font-bold text-gray-200 tracking-wider uppercase">
              Primer Registro
            </span>
          </div>
          {data.firstPhoto?.date && (
            <div className="absolute bottom-4 left-4 text-sm font-medium text-white/90 drop-shadow-md">
              {new Date(data.firstPhoto.date).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Ahora */}
        <div className="relative group overflow-hidden bg-black aspect-[3/4]">
          {data.latestPhoto?.imageUrl ? (
            <img 
              src={data.latestPhoto.imageUrl} 
              alt="Ahora" 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <span className="text-gray-500">Sin foto actual</span>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-md px-3 py-1 rounded-full border border-primary/50 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <span className="text-xs font-bold text-white tracking-wider uppercase">
              Actual
            </span>
          </div>
          {data.latestPhoto?.date && (
            <div className="absolute bottom-4 right-4 text-sm font-medium text-white/90 drop-shadow-md">
              {new Date(data.latestPhoto.date).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
