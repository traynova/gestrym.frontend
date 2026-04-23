/**
 * ExerciseCardSkeleton - Skeleton para ejercicios durante la carga
 */

import { motion } from "framer-motion";

export function ExerciseCardSkeleton() {
  return (
    <motion.div
      className="rounded-lg border border-slate-700 bg-slate-800 overflow-hidden"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Imagen skeleton */}
      <div className="h-48 w-full bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 animate-pulse" />

      {/* Contenido skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-6 bg-slate-700 rounded w-3/4" />
        <div className="h-4 bg-slate-700 rounded w-1/2" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-4 bg-slate-700 rounded" />
          <div className="h-4 bg-slate-700 rounded" />
        </div>
      </div>
    </motion.div>
  );
}

// Mostrar múltiples skeletons
interface ExerciseSkeletonGridProps {
  count?: number;
}

export function ExerciseSkeletonGrid({ count = 12 }: ExerciseSkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ExerciseCardSkeleton key={i} />
      ))}
    </div>
  );
}
