/**
 * TrainingLoadingSpinner - Componentes para estados de carga del módulo de entrenamiento
 */

import { motion } from "framer-motion";
import { Loader2, Zap } from "lucide-react";

interface TrainingLoadingSpinnerProps {
  message?: string;
  isAdapting?: boolean;
}

export function TrainingLoadingSpinner({
  message = "Cargando...",
  isAdapting = false,
}: TrainingLoadingSpinnerProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {isAdapting ? (
        <>
          <motion.div
            className="relative w-20 h-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur-md opacity-50" />
            <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center">
              <Zap className="h-8 w-8 text-red-600 animate-pulse" />
            </div>
          </motion.div>

          <motion.div
            className="text-center"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="font-semibold text-white">{message}</p>
            <p className="text-sm text-slate-400 mt-1">
              Nuestra IA está optimizando tu rutina basada en tu progreso...
            </p>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-8 w-8 text-red-600" />
          </motion.div>
          <p className="font-medium text-white">{message}</p>
        </>
      )}
    </motion.div>
  );
}

// Mini spinner para botones
interface MiniSpinnerProps {
  className?: string;
}

export function MiniSpinner({ className = "h-4 w-4" }: MiniSpinnerProps) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 className={className} />
    </motion.div>
  );
}
