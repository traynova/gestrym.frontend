/**
 * Página de Exploración y Búsqueda de Ejercicios
 */

import { useState, useEffect } from "react";
import { ExerciseFilters as IExerciseFilters } from "@/types/training";
import { useTrainingStore } from "@/store/useTrainingStore";
import { ExerciseCard } from "@/components/training/ExerciseCard";
import { ExerciseFilters } from "@/components/training/ExerciseFilters";
import { ExerciseSkeletonGrid } from "@/components/training/ExerciseSkeletons";
import { TrainingNotification } from "@/components/training/TrainingNotifications";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<IExerciseFilters>({});
  const [isSearching, setIsSearching] = useState(false);

  const {
    exercises,
    isLoadingExercises,
    errorExercises,
    totalExercises,
    currentPage,
    fetchExercises,
    searchExercises,
    clearError,
  } = useTrainingStore();

  // Cargar ejercicios iniciales
  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async (page = 1) => {
    if (searchQuery.trim()) {
      await searchExercises(searchQuery);
    } else {
      await fetchExercises({ ...filters, page });
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    if (searchQuery.trim()) {
      await searchExercises(searchQuery);
    } else {
      await loadExercises();
    }
    setIsSearching(false);
  };

  const handleFiltersChange = (newFilters: IExerciseFilters) => {
    setFilters(newFilters);
    fetchExercises(newFilters);
  };

  const handleExerciseClick = (exercise: any) => {
    // Aquí se puede abrir un modal con detalles del ejercicio
    console.log("Ejercicio seleccionado:", exercise);
  };

  const totalPages = Math.ceil(totalExercises / 20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              🏋️ Catálogo de Ejercicios
            </h1>
            <p className="text-slate-400">
              Explora y descubre ejercicios para tu rutina de entrenamiento
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barra de búsqueda */}
        <motion.form
          onSubmit={handleSearch}
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busca por nombre del ejercicio..."
              className="w-full px-6 py-3 pl-12 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-red-600 focus:outline-none transition-colors"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
            <motion.button
              type="submit"
              disabled={isSearching || isLoadingExercises}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
            >
              {isSearching ? "..." : "Buscar"}
            </motion.button>
          </div>
        </motion.form>

        {/* Notificación de error */}
        <AnimatePresence>
          {errorExercises && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <TrainingNotification
                type="error"
                title="Error al cargar ejercicios"
                message={errorExercises}
                onClose={clearError}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtros */}
        <ExerciseFilters
          onFiltersChange={handleFiltersChange}
          isLoading={isLoadingExercises}
        />

        {/* Grid de ejercicios o skeleton */}
        {isLoadingExercises ? (
          <ExerciseSkeletonGrid count={12} />
        ) : exercises.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {exercises.map((exercise, idx) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ExerciseCard
                    exercise={exercise}
                    onClick={handleExerciseClick}
                    isAddable={true}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Paginación */}
            {totalPages > 1 && (
              <motion.div
                className="flex items-center justify-center gap-2 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.button
                  disabled={currentPage === 1}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </motion.button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <motion.button
                        key={pageNum}
                        onClick={() => loadExercises(pageNum)}
                        className={
                          pageNum === currentPage
                            ? "px-4 py-2 bg-red-600 text-white rounded-lg font-semibold"
                            : "px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                        }
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}
                </div>

                <motion.button
                  disabled={currentPage === totalPages}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </motion.button>
              </motion.div>
            )}
          </>
        ) : (
          // Estado vacío
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle className="h-16 w-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              No hay ejercicios disponibles
            </h3>
            <p className="text-slate-400 text-center max-w-md">
              {searchQuery
                ? `No encontramos ejercicios que coincidan con "${searchQuery}"`
                : "Intenta con otros filtros o búsqueda"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
