import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImagePlus, Activity, UploadCloud } from 'lucide-react';
import { progressService } from '@/api/progressService';
import { UploadPhotoDto } from '@/types/progress';

const photoSchema = z.object({
  type: z.enum(['front', 'back', 'side'], { required_error: 'El tipo de foto es requerido' }),
  date: z.string().min(1, 'La fecha es requerida'),
  file: z.any().refine((file) => file instanceof File, 'La imagen es obligatoria'),
});

type PhotoFormValues = z.infer<typeof photoSchema>;

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddPhotoModal: React.FC<AddPhotoModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<PhotoFormValues>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      type: 'front',
      date: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = async (data: PhotoFormValues) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const payload: UploadPhotoDto = {
        file: data.file,
        type: data.type,
        date: data.date,
      };

      await progressService.uploadPhoto(payload);
      
      reset();
      setPreviewUrl(null);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al subir la foto. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('file', file, { shouldValidate: true });
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
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
                <ImagePlus className="w-5 h-5 text-primary" />
                Subir Foto de Progreso
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Fecha</label>
                  <input
                    type="date"
                    {...register('date')}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tipo de Vista</label>
                  <select
                    {...register('type')}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="front">Frente</option>
                    <option value="back">Espalda</option>
                    <option value="side">Perfil</option>
                  </select>
                  {errors.type && <p className="text-red-400 text-xs mt-1">{errors.type.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Fotografía</label>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                    errors.file ? 'border-red-500/50 bg-red-500/5' : 'border-gray-700 hover:border-primary/50 hover:bg-gray-800/50 bg-gray-950'
                  }`}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 text-gray-500 mb-2" />
                      <p className="text-gray-400 font-medium">Click para seleccionar imagen</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG (Max. 5MB)</p>
                    </>
                  )}
                </div>
                {errors.file && <p className="text-red-400 text-xs mt-1">{errors.file.message?.toString()}</p>}
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
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Activity className="w-5 h-5 animate-spin" /> Subiendo...
                    </>
                  ) : (
                    'Subir Foto'
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
