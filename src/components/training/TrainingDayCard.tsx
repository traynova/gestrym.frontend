/**
 * TrainingDayCard - Componente para mostrar un día del plan
 */

import { TrainingDay } from "@/types/training";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Dumbbell,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

interface TrainingDayCardProps {
  day: TrainingDay;
  dayNumber: number;
  totalDays: number;
  onComplete?: () => void;
  isCompletingDay?: boolean;
}

export function TrainingDayCard({
  day,
  dayNumber,
  totalDays,
  onComplete,
  isCompletingDay = false,
}: TrainingDayCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getExerciseCount = () => {
    return day.workout?.exercises.length || 0;
  };

  const getTotalSets = () => {
    return day.workout?.exercises.reduce(
      (acc, ex) => acc + (ex.sets?.length || 0),
      0
    ) || 0;
  };

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!day.isCompleted && onComplete) {
      onComplete();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={clsx(
        "relative rounded-lg border-2 p-5 cursor-pointer transition-all",
        day.isCompleted
          ? "border-green-600 bg-green-600/10"
          : "border-slate-700 bg-slate-800 hover:border-red-600"
      )}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Checkbox */}
          <motion.button
            onClick={handleComplete}
            disabled={isCompletingDay}
            className={clsx(
              "flex-shrink-0 relative transition-colors",
              day.isCompleted
                ? "text-green-500 cursor-default"
                : "text-slate-400 hover:text-red-600"
            )}
            whileHover={!day.isCompleted ? { scale: 1.2 } : {}}
            whileTap={!day.isCompleted ? { scale: 0.9 } : {}}
          >
            {isCompletingDay ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : day.isCompleted ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : (
              <Circle className="h-6 w-6" />
            )}
          </motion.button>

          {/* Día número */}
          <div>
            <h3 className="font-bold text-lg text-white">
              Día {dayNumber}
              <span className="text-slate-400 text-sm font-normal ml-2">
                de {totalDays}
              </span>
            </h3>
            {day.date && (
              <p className="text-xs text-slate-500">
                {new Date(day.date).toLocaleDateString("es-ES", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        </div>

        {/* Estado */}
        <div
          className={clsx(
            "px-3 py-1 rounded-full text-xs font-semibold",
            day.isCompleted
              ? "bg-green-600/20 text-green-400"
              : "bg-yellow-600/20 text-yellow-400"
          )}
        >
          {day.isCompleted ? "✓ Completado" : "En progreso"}
        </div>
      </div>

      {/* Información del workout */}
      {day.workout && (
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <Dumbbell className="h-4 w-4 text-red-600" />
            <span>{getExerciseCount()} ejercicio(s) • {getTotalSets()} sets</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="h-4 w-4 text-red-600" />
            <span>
              {day.workout.totalDuration || "~45"} min
            </span>
          </div>
        </div>
      )}

      {/* Detalles expandibles */}
      <AnimatePresence>
        {showDetails && day.workout && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-slate-700"
          >
            <div className="space-y-3">
              {day.workout.exercises.map((exercise, idx) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-900/50 rounded p-3 text-sm"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-white">
                      {exercise.exercise?.name || `Ejercicio ${exercise.order}`}
                    </h4>
                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                      {exercise.sets.length} sets
                    </span>
                  </div>

                  {/* Sets */}
                  <div className="mt-2 space-y-1">
                    {exercise.sets.map((set, setIdx) => (
                      <div key={set.id} className="text-xs text-slate-300 ml-2">
                        <span className="font-medium">
                          Set {setIdx + 1}:
                        </span>{" "}
                        <span>
                          {set.reps} reps
                          {set.weight && ` x ${set.weight}kg`}
                          {set.duration && ` x ${set.duration}s`}
                          {set.restTime &&
                            ` - Descanso: ${set.restTime}s`}
                        </span>
                      </div>
                    ))}
                  </div>

                  {exercise.notes && (
                    <div className="mt-2 flex items-start gap-2 text-xs text-blue-300 bg-blue-600/10 p-2 rounded">
                      <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                      <p>{exercise.notes}</p>
                    </div>
                  )}
                </motion.div>
              ))}

              {day.notes && (
                <div className="flex items-start gap-2 text-xs text-slate-300 bg-slate-700/30 p-3 rounded">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>{day.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje de no hay workout */}
      {!day.workout && (
        <p className="text-sm text-slate-400 italic">
          No hay entrenamiento asignado para este día
        </p>
      )}
    </motion.div>
  );
}
