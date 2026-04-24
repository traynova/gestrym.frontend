import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Scale, Percent, Ruler } from 'lucide-react';
import { progressService } from '@/api/progressService';
import { CreateMetricsDto } from '@/types/progress';

const metricsSchema = z.object({
  date: z.string().min(1, 'La fecha es obligatoria'),
  weight: z.number().min(1, 'El peso debe ser mayor a 0').max(300, 'Peso inválido'),
  height: z.number().min(50, 'La altura mínima es 50cm').max(300, 'Altura inválida'),
  bodyFat: z.number().min(0, 'El % debe ser positivo').max(100, 'El % máximo es 100'),
  muscleMass: z.number().min(0, 'La masa debe ser positiva').max(100, 'Masa inválida'),
});

type MetricsFormValues = z.infer<typeof metricsSchema>;

interface AddMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddMetricsModal: React.FC<AddMetricsModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<MetricsFormValues>({
    resolver: zodResolver(metricsSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      weight: 0,
      height: 0,
      bodyFat: 0,
      muscleMass: 0,
    }
  });

  const onSubmit = async (data: MetricsFormValues) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const payload: CreateMetricsDto = {
        date: new Date(data.date).toISOString(),
        weight: data.weight,
        height: data.height,
        bodyFat: data.bodyFat,
        muscleMass: data.muscleMass,
      };

      await progressService.createMetric(payload);
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar las métricas. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Registrar Métricas
              </h2>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Fecha</label>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                    <Scale className="w-4 h-4" /> Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('weight', { valueAsNumber: true })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Ej. 75.5"
                  />
                  {errors.weight && <p className="text-red-400 text-xs mt-1">{errors.weight.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                    <Ruler className="w-4 h-4" /> Altura (cm)
                  </label>
                  <input
                    type="number"
                    {...register('height', { valueAsNumber: true })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Ej. 180"
                  />
                  {errors.height && <p className="text-red-400 text-xs mt-1">{errors.height.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                    <Percent className="w-4 h-4" /> Grasa Corporal (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('bodyFat', { valueAsNumber: true })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Ej. 15.2"
                  />
                  {errors.bodyFat && <p className="text-red-400 text-xs mt-1">{errors.bodyFat.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                    <Activity className="w-4 h-4" /> Masa Muscular (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('muscleMass', { valueAsNumber: true })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Ej. 35.5"
                  />
                  {errors.muscleMass && <p className="text-red-400 text-xs mt-1">{errors.muscleMass.message}</p>}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-700 text-white font-medium hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <Activity className="w-5 h-5 animate-spin" />
                  ) : (
                    'Guardar Métricas'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
