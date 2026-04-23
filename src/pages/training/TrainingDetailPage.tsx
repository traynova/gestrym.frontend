/**
 * Página de Detalle del Plan de Entrenamiento
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTrainingStore } from "@/store/useTrainingStore";
import { useAuthStore } from "@/store/useAuthStore";
import { TrainingDayCard } from "@/components/training/TrainingDayCard";
import { TrainingLoadingSpinner, MiniSpinner } from "@/components/training/TrainingLoadingSpinner";
import { TrainingNotification } from "@/components/training/TrainingNotifications";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  AlertCircle,
  Zap,
  Calendar,
  Dumbbell,
  Download,
  Share2,
} from "lucide-react";
import clsx from "clsx";

export function TrainingDetailPage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isCompletingDay, setIsCompletingDay] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState<{
    type: "success" | "error" | "info";
    title: string;
    message?: string;
  } | null>(null);

  const {
    currentPlan,
    isLoadingPlans,
    errorPlans,
    isLoading,
    fetchTrainingPlanById,
    completeTrainingDay,
    adaptTrainingPlan,
  } = useTrainingStore();

  useEffect(() => {
    if (planId) {
      fetchTrainingPlanById(planId);
    }
  }, [planId, fetchTrainingPlanById]);

  if (!planId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-red-600 mr-2" />
        <span className="text-white font-semibold">Plan no encontrado</span>
      </div>
    );
  }

  const handleCompleteDay = async (dayId: string) => {
    if (!planId || !user?.id) return;

    setIsCompletingDay(dayId);
    try {
      // Optimistic update: actualizar inmediatamente
      await completeTrainingDay(planId, dayId);

      setNotificationData({
        type: "success",
        title: "✓ Día completado",
        message: "¡Excelente trabajo! Has completado este día de entrenamiento",
      });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
    } catch (error) {
      setNotificationData({
        type: "error",
        title: "Error al completar día",
        message:
          error instanceof Error ? error.message : "No se pudo completar el día",
      });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } finally {
      setIsCompletingDay(null);
    }
  };

  const handleAdaptPlan = async () => {
    if (!planId || !user?.id) return;

    try {
      await adaptTrainingPlan(planId, user.id.toString());
      setNotificationData({
        type: "success",
        title: "✓ Plan adaptado exitosamente",
        message:
          "Tu nuevo plan personalizado ha sido creado basado en tu progreso",
      });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } catch (error) {
      setNotificationData({
        type: "error",
        title: "Error al adaptar plan",
        message:
          error instanceof Error ? error.message : "No se pudo adaptar el plan",
      });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };

  if (isLoadingPlans) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <TrainingLoadingSpinner message="Cargando plan de entrenamiento..." />
        </div>
      </div>
    );
  }

  if (!currentPlan || errorPlans) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </motion.button>

          <div className="flex flex-col items-center justify-center py-16 bg-slate-800 rounded-lg border border-slate-700">
            <AlertCircle className="h-16 w-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Plan no encontrado
            </h3>
            <p className="text-slate-400 text-center max-w-md">
              {errorPlans || "No pudimos cargar el plan de entrenamiento"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const completedDays = currentPlan.days.filter((d) => d.isCompleted).length;
  const progress = (completedDays / currentPlan.days.length) * 100;

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-600/20 text-green-400 border-green-600";
      case "intermediate":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-600";
      case "advanced":
        return "bg-red-600/20 text-red-400 border-red-600";
      default:
        return "bg-slate-600/20 text-slate-400 border-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Notificación flotante */}
      <AnimatePresence>
        {showNotification && notificationData && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-4 right-4 z-50"
          >
            <TrainingNotification
              type={notificationData.type}
              title={notificationData.title}
              message={notificationData.message}
              autoClose={5000}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-4"
          >
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver
            </motion.button>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                <Download className="h-5 w-5" />
                Descargar
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                <Share2 className="h-5 w-5" />
                Compartir
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información del plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {currentPlan.name}
              </h1>
              {currentPlan.description && (
                <p className="text-slate-400">{currentPlan.description}</p>
              )}
            </div>

            {currentPlan.difficulty && (
              <div
                className={clsx(
                  "px-4 py-2 rounded-full font-semibold capitalize border",
                  getDifficultyColor(currentPlan.difficulty)
                )}
              >
                {currentPlan.difficulty}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Calendar className="h-4 w-4 text-red-600" />
                <span>Duración</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {currentPlan.durationDays}
              </p>
              <p className="text-xs text-slate-500">días</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Dumbbell className="h-4 w-4 text-red-600" />
                <span>Entrenamientos</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {currentPlan.days.length}
              </p>
              <p className="text-xs text-slate-500">días de rutina</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Zap className="h-4 w-4 text-red-600" />
                <span>Completados</span>
              </div>
              <p className="text-2xl font-bold text-white">{completedDays}</p>
              <p className="text-xs text-slate-500">
                de {currentPlan.days.length}
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span>Progreso</span>
              </div>
              <p className="text-2xl font-bold text-white">{progress.toFixed(0)}%</p>
              <p className="text-xs text-slate-500">completado</p>
            </div>
          </div>

          {/* Barra de progreso */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-300">
                Progreso General
              </span>
              <span className="text-sm font-bold text-red-600">
                {completedDays}/{currentPlan.days.length}
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden border border-slate-700">
              <motion.div
                className="h-full bg-gradient-to-r from-red-600 to-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Botón de adaptar plan (solo si está cerca de completarse) */}
        {progress >= 80 && progress < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-600 rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white mb-1">
                  📊 ¿Listo para el siguiente nivel?
                </h3>
                <p className="text-sm text-slate-300">
                  Ya casi terminas este plan. Nuestra IA puede crear uno nuevo
                  personalizado basado en tu progreso.
                </p>
              </div>
              <motion.button
                onClick={handleAdaptPlan}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold whitespace-nowrap ml-4 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <MiniSpinner className="h-4 w-4" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                Adaptar Plan
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Lista de días */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Mis Entrenamientos</h2>

          {currentPlan.days.map((day, idx) => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <TrainingDayCard
                day={day}
                dayNumber={idx + 1}
                totalDays={currentPlan.days.length}
                onComplete={() => handleCompleteDay(day.id)}
                isCompletingDay={isCompletingDay === day.id}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
