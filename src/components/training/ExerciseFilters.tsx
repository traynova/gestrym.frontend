/**
 * ExerciseFilters - Componente para filtrar ejercicios
 */

import { useState, useEffect } from "react";
import { ExerciseFilters as IExerciseFilters } from "@/types/training";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter, X } from "lucide-react";
import clsx from "clsx";
import { useTrainingStore } from "@/store/useTrainingStore";

interface ExerciseFiltersProps {
  onFiltersChange: (filters: IExerciseFilters) => void;
  isLoading?: boolean;
}

export function ExerciseFilters({
  onFiltersChange,
  isLoading = false,
}: ExerciseFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<IExerciseFilters>({});
  const [options, setOptions] = useState<{
    bodyParts: string[];
    equipment: string[];
    targets: string[];
    difficulties: string[];
  }>({
    bodyParts: [],
    equipment: [],
    targets: [],
    difficulties: [],
  });
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const getFilterOptions = useTrainingStore((state) => state.getFilterOptions);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    setIsLoadingOptions(true);
    try {
      const data = await getFilterOptions();
      setOptions(data);
    } catch (error) {
      console.error("Error al cargar opciones de filtros:", error);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const handleFilterChange = (key: string, value: string | undefined) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) {
      delete newFilters[key as keyof IExerciseFilters];
    }
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="mb-6">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:border-red-600 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Filter className="h-4 w-4 text-red-600" />
        <span className="font-medium text-white">Filtros</span>
        {hasActiveFilters && (
          <span className="ml-2 px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded-full font-semibold">
            {Object.keys(filters).length}
          </span>
        )}
        <ChevronDown
          className={clsx(
            "h-4 w-4 transition-transform",
            isOpen ? "rotate-180" : ""
          )}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-3 p-4 bg-slate-800 border border-slate-700 rounded-lg space-y-4"
          >
            {/* Parte del Cuerpo */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Parte del Cuerpo
              </label>
              <select
                value={filters.bodyPart || ""}
                onChange={(e) =>
                  handleFilterChange("bodyPart", e.target.value || undefined)
                }
                disabled={isLoadingOptions || isLoading}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-red-600 focus:outline-none disabled:opacity-50"
              >
                <option value="">Todas</option>
                {options.bodyParts.map((bp) => (
                  <option key={bp} value={bp}>
                    {bp}
                  </option>
                ))}
              </select>
            </div>

            {/* Equipo */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Equipo
              </label>
              <select
                value={filters.equipment || ""}
                onChange={(e) =>
                  handleFilterChange("equipment", e.target.value || undefined)
                }
                disabled={isLoadingOptions || isLoading}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-red-600 focus:outline-none disabled:opacity-50"
              >
                <option value="">Todos</option>
                {options.equipment.map((eq) => (
                  <option key={eq} value={eq}>
                    {eq}
                  </option>
                ))}
              </select>
            </div>

            {/* Grupo Muscular Objetivo */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Objetivo Muscular
              </label>
              <select
                value={filters.target || ""}
                onChange={(e) =>
                  handleFilterChange("target", e.target.value || undefined)
                }
                disabled={isLoadingOptions || isLoading}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-red-600 focus:outline-none disabled:opacity-50"
              >
                <option value="">Todos</option>
                {options.targets.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Dificultad */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Dificultad
              </label>
              <select
                value={filters.difficulty || ""}
                onChange={(e) =>
                  handleFilterChange("difficulty", e.target.value || undefined)
                }
                disabled={isLoading}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-red-600 focus:outline-none disabled:opacity-50"
              >
                <option value="">Todas</option>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>

            {/* Botón Limpiar */}
            {hasActiveFilters && (
              <motion.button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="h-4 w-4" />
                Limpiar Filtros
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
