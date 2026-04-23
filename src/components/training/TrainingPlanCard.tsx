/**
 * TrainingPlanCard - Componente para mostrar un plan de entrenamiento
 */

import { TrainingPlan } from "@/types/training";
import { motion } from "framer-motion";
import {
  Calendar,
  Dumbbell,
  Target,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

interface TrainingPlanCardProps {
  plan: TrainingPlan;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAssign?: () => void;
}

export function TrainingPlanCard({
  plan,
  onClick,
  onEdit,
  onDelete,
  onAssign,
}: TrainingPlanCardProps) {
  const [showActions, setShowActions] = useState(false);

  const completedDays = plan.days.filter((d) => d.isCompleted).length;
  const progress = (completedDays / plan.days.length) * 100;

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-400 bg-green-500/20";
      case "intermediate":
        return "text-yellow-400 bg-yellow-500/20";
      case "advanced":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-slate-400 bg-slate-500/20";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
      onClick={onClick}
      className="relative group rounded-lg border border-slate-700 bg-slate-800 p-5 hover:border-red-600 transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-white mb-1 line-clamp-2">
            {plan.name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-1">
            {plan.description || "Sin descripción"}
          </p>
        </div>

        {/* Dificultad badge */}
        {plan.difficulty && (
          <div
            className={clsx(
              "ml-3 px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap",
              getDifficultyColor(plan.difficulty)
            )}
          >
            {plan.difficulty}
          </div>
        )}
      </div>

      {/* Información */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="h-4 w-4 text-red-600" />
          <span>{plan.durationDays} días</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Dumbbell className="h-4 w-4 text-red-600" />
          <span>{plan.days.length} entrenamientos</span>
        </div>

        {plan.goal && (
          <div className="flex items-center gap-2 text-slate-300">
            <Target className="h-4 w-4 text-red-600" />
            <span className="capitalize">{plan.goal}</span>
          </div>
        )}
      </div>

      {/* Progreso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400">Progreso</span>
          <span className="text-xs font-bold text-red-600">
            {completedDays}/{plan.days.length}
          </span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-red-600 to-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
        </div>
      </div>

      {/* Fecha */}
      <div className="text-xs text-slate-500">
        Iniciado: {new Date(plan.startDate).toLocaleDateString("es-ES")}
      </div>

      {/* Acciones flotantes */}
      <motion.div
        className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
        animate={showActions ? { opacity: 1 } : { opacity: 0 }}
      >
        <motion.div
          className="flex gap-2"
          initial={{ y: 10 }}
          animate={showActions ? { y: 0 } : { y: 10 }}
        >
          {onAssign && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onAssign();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Asignar
            </motion.button>
          )}
          {onEdit && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              ✎ Editar
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              🗑 Eliminar
            </motion.button>
          )}
          <div className="flex items-center justify-center">
            <ChevronRight className="h-5 w-5 text-white" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
