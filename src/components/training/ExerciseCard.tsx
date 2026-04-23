/**
 * ExerciseCard - Componente para mostrar un ejercicio individual
 */

import { Exercise } from "@/types/training";
import { motion } from "framer-motion";
import { Dumbbell, Target, Zap } from "lucide-react";
import clsx from "clsx";

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: (exercise: Exercise) => void;
  isSelected?: boolean;
  isAddable?: boolean;
}

export function ExerciseCard({
  exercise,
  onClick,
  isSelected = false,
  isAddable = false,
}: ExerciseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(exercise)}
      className={clsx(
        "group relative rounded-lg border overflow-hidden cursor-pointer transition-all",
        isSelected
          ? "border-red-600 bg-red-600/10 ring-2 ring-red-600"
          : "border-slate-700 bg-slate-800 hover:border-red-600"
      )}
    >
      {/* Imagen del ejercicio */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        {exercise.gifUrl ? (
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <Dumbbell className="h-16 w-16 text-slate-600" />
          </div>
        )}

        {/* Dificultad badge */}
        {exercise.difficulty && (
          <div
            className={clsx(
              "absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold capitalize",
              exercise.difficulty === "beginner"
                ? "bg-green-500/20 text-green-400"
                : exercise.difficulty === "intermediate"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
            )}
          >
            {exercise.difficulty}
          </div>
        )}

        {/* Badge seleccionado */}
        {isSelected && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ✓ Seleccionado
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-white mb-2 line-clamp-2">
          {exercise.name}
        </h3>

        {/* Meta/Grupo muscular */}
        <div className="flex items-center gap-2 mb-3 text-sm text-slate-300">
          <Target className="h-4 w-4 text-red-600" />
          <span className="capitalize">{exercise.target}</span>
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <Zap className="h-3 w-3 text-yellow-500" />
            <span className="capitalize">{exercise.bodyPart}</span>
          </div>
          <div className="text-slate-400 capitalize">
            {exercise.equipment}
          </div>
        </div>
      </div>

      {/* Botón flotante para agregar */}
      {isAddable && !isSelected && (
        <motion.div
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
          whileHover={{ opacity: 1 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            + Agregar
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
