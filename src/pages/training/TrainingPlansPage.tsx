/**
 * Página de Planes de Entrenamiento del Usuario
 */

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingPlanCard } from "@/components/training/TrainingPlanCard";
import { TrainingLoadingSpinner } from "@/components/training/TrainingLoadingSpinner";
import { TrainingNotification } from "@/components/training/TrainingNotifications";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Plus,
  Zap,
  Calendar,
  BarChart3,
} from "lucide-react";
import clsx from "clsx";

export function TrainingPlansPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "active" | "completed"
  >("all");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState<{
    type: "success" | "error" | "info";
    title: string;
    message?: string;
  } | null>(null);

  const {
    trainingPlans,
    isLoadingPlans,
    errorPlans,
    fetchTrainingPlans,
    deleteTrainingPlan,
    clearError,
  } = useTrainingStore();

  useEffect(() => {
    if (user?.id) {
      fetchTrainingPlans(user.id.toString());
    }
  }, [user?.id, fetchTrainingPlans]);

  // Filtrar planes según el estado
  const filteredPlans = trainingPlans.filter((plan) => {
    if (selectedFilter === "active") {
      const completedPercentage = (
        (plan.days.filter((d) => d.isCompleted).length / plan.days.length) *
        100
      ).toFixed(0);
      return parseInt(completedPercentage) < 100;
    } else if (selectedFilter === "completed") {
      const completedPercentage = (
        (plan.days.filter((d) => d.isCompleted).length / plan.days.length) *
        100
      ).toFixed(0);
      return parseInt(completedPercentage) === 100;
    }
    return true;
  });

  const handleDeletePlan = async (planId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este plan?")) {
      try {
        await deleteTrainingPlan(planId);
        setNotificationData({
          type: "success",
          title: "Plan eliminado",
        });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } catch (error) {
        setNotificationData({
          type: "error",
          title: "Error al eliminar plan",
          message:
            error instanceof Error
              ? error.message
              : "No se pudo eliminar el plan",
        });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }
    }
  };

  // Estadísticas generales
  const totalDays = trainingPlans.reduce((acc, p) => acc + p.days.length, 0);
  const completedDays = trainingPlans.reduce(
    (acc, p) => acc + p.days.filter((d) => d.isCompleted).length,
    0
  );
  const completionPercentage =
    totalDays > 0 ? ((completedDays / totalDays) * 100).toFixed(0) : 0;

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  🎯 Mis Planes de Entrenamiento
                </h1>
                <p className="text-slate-400">
                  Gestiona y realiza un seguimiento de tus rutinas
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/training/create")}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Plus className="h-5 w-5" />
                Nuevo Plan
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <BarChart3 className="h-4 w-4 text-red-600" />
                  <span>Planes Activos</span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">
                  {trainingPlans.length}
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Calendar className="h-4 w-4 text-red-600" />
                  <span>Entrenamientos</span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">
                  {completedDays}/{totalDays}
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Zap className="h-4 w-4 text-red-600" />
                  <span>Progreso General</span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">
                  {completionPercentage}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <motion.div
          className="flex gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {(
            [
              { key: "all", label: "Todos" },
              { key: "active", label: "En Progreso" },
              { key: "completed", label: "Completados" },
            ] as const
          ).map((filter) => (
            <motion.button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={clsx(
                "px-4 py-2 rounded-lg font-semibold transition-all",
                selectedFilter === filter.key
                  ? "bg-red-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              )}
            >
              {filter.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Notificación de error */}
        <AnimatePresence>
          {errorPlans && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <TrainingNotification
                type="error"
                title="Error al cargar planes"
                message={errorPlans}
                onClose={clearError}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenido principal */}
        {isLoadingPlans ? (
          <TrainingLoadingSpinner message="Cargando tus planes..." />
        ) : filteredPlans.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredPlans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <TrainingPlanCard
                  plan={plan}
                  onClick={() => {
                    // Navegar al detalle del plan
                    console.log("Navegar a:", plan.id);
                  }}
                  onEdit={() => {
                    console.log("Editar:", plan.id);
                  }}
                  onDelete={() => handleDeletePlan(plan.id)}
                  onAssign={() => {
                    console.log("Asignar:", plan.id);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Estado vacío
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle className="h-16 w-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {selectedFilter === "all"
                ? "No hay planes de entrenamiento"
                : selectedFilter === "active"
                  ? "No hay planes en progreso"
                  : "No hay planes completados"}
            </h3>
            <p className="text-slate-400 text-center max-w-md mb-6">
              {selectedFilter === "all"
                ? "Crea tu primer plan de entrenamiento para comenzar"
                : "No tienes planes en esa categoría aún"}
            </p>

            {selectedFilter === "all" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Plus className="h-5 w-5" />
                Crear Primer Plan
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
