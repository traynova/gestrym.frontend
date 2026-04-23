/**
 * Zustand Store para Training (Entrenamientos)
 * Maneja el estado de planes de entrenamiento y ejercicios
 */

import { create } from "zustand";
import { TrainingPlan, Exercise, ExerciseFilters } from "@/types/training";
import { trainingPlansService } from "@/api/trainingPlansService";
import { exercisesService } from "@/api/exercisesService";

interface TrainingState {
  // Estado de Planes
  trainingPlans: TrainingPlan[];
  currentPlan: TrainingPlan | null;
  isLoadingPlans: boolean;
  errorPlans: string | null;

  // Estado de Ejercicios
  exercises: Exercise[];
  currentExercise: Exercise | null;
  isLoadingExercises: boolean;
  errorExercises: string | null;
  totalExercises: number;
  currentPage: number;

  // Estado general
  isLoading: boolean;
  error: string | null;

  // Acciones - Planes
  fetchTrainingPlans: (userId: string) => Promise<void>;
  fetchTrainingPlanById: (id: string) => Promise<void>;
  createTrainingPlan: (data: any) => Promise<TrainingPlan>;
  updateTrainingPlan: (id: string, data: any) => Promise<void>;
  deleteTrainingPlan: (id: string) => Promise<void>;
  assignTrainingPlan: (id: string, userId: string, startDate?: string) => Promise<void>;
  completeTrainingDay: (planId: string, dayId: string) => Promise<void>;
  adaptTrainingPlan: (planId: string, userId: string) => Promise<void>;

  // Acciones - Ejercicios
  fetchExercises: (filters?: ExerciseFilters) => Promise<void>;
  fetchExerciseById: (id: string) => Promise<void>;
  searchExercises: (query: string) => Promise<void>;
  getFilterOptions: () => Promise<any>;

  // Acciones de limpieza
  clearError: () => void;
  clearPlans: () => void;
  clearExercises: () => void;
  clearCurrentPlan: () => void;
}

export const useTrainingStore = create<TrainingState>((set) => ({
  // Estado inicial
  trainingPlans: [],
  currentPlan: null,
  isLoadingPlans: false,
  errorPlans: null,

  exercises: [],
  currentExercise: null,
  isLoadingExercises: false,
  errorExercises: null,
  totalExercises: 0,
  currentPage: 1,

  isLoading: false,
  error: null,

  // ============ ACCIONES - PLANES ============

  fetchTrainingPlans: async (userId: string) => {
    set({ isLoadingPlans: true, errorPlans: null });
    try {
      const response = await trainingPlansService.getTrainingPlansByUser(userId);
      set({
        trainingPlans: response.data,
        isLoadingPlans: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al cargar planes";
      set({
        errorPlans: message,
        isLoadingPlans: false,
      });
    }
  },

  fetchTrainingPlanById: async (id: string) => {
    set({ isLoadingPlans: true, errorPlans: null });
    try {
      const plan = await trainingPlansService.getTrainingPlanById(id);
      set({
        currentPlan: plan,
        isLoadingPlans: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al cargar plan";
      set({
        errorPlans: message,
        isLoadingPlans: false,
      });
    }
  },

  createTrainingPlan: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newPlan = await trainingPlansService.createTrainingPlan(data);
      set((state) => ({
        trainingPlans: [...state.trainingPlans, newPlan],
        isLoading: false,
      }));
      return newPlan;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al crear plan";
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  updateTrainingPlan: async (id: string, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPlan = await trainingPlansService.updateTrainingPlan(id, data);
      set((state) => ({
        trainingPlans: state.trainingPlans.map((p) =>
          p.id === id ? updatedPlan : p
        ),
        currentPlan: state.currentPlan?.id === id ? updatedPlan : state.currentPlan,
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al actualizar plan";
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTrainingPlan: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await trainingPlansService.deleteTrainingPlan(id);
      set((state) => ({
        trainingPlans: state.trainingPlans.filter((p) => p.id !== id),
        currentPlan: state.currentPlan?.id === id ? null : state.currentPlan,
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al eliminar plan";
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  assignTrainingPlan: async (id: string, userId: string, startDate?: string) => {
    set({ isLoading: true, error: null });
    try {
      await trainingPlansService.assignTrainingPlan(id, {
        userId,
        startDate,
      });
      set({ isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al asignar plan";
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  completeTrainingDay: async (planId: string, dayId: string) => {
    set({ isLoading: true, error: null });
    try {
      await trainingPlansService.completeTrainingDay(planId, dayId);

      // Actualizar el plan actual en el estado
      set((state) => {
        if (state.currentPlan?.id === planId) {
          return {
            currentPlan: {
              ...state.currentPlan,
              days: state.currentPlan.days.map((d) =>
                d.id === dayId
                  ? { ...d, isCompleted: true, completedAt: new Date().toISOString() }
                  : d
              ),
            },
            isLoading: false,
          };
        }
        return { isLoading: false };
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al completar día";
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  adaptTrainingPlan: async (planId: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const adaptedPlan = await trainingPlansService.adaptTrainingPlan(
        planId,
        userId
      );
      set((state) => ({
        trainingPlans: [...state.trainingPlans, adaptedPlan],
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al adaptar plan";
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  // ============ ACCIONES - EJERCICIOS ============

  fetchExercises: async (filters?: ExerciseFilters) => {
    set({ isLoadingExercises: true, errorExercises: null });
    try {
      const response = await exercisesService.getExercises(filters);
      set({
        exercises: response.data,
        totalExercises: response.total,
        currentPage: response.page,
        isLoadingExercises: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al cargar ejercicios";
      set({
        errorExercises: message,
        isLoadingExercises: false,
      });
    }
  },

  fetchExerciseById: async (id: string) => {
    set({ isLoadingExercises: true, errorExercises: null });
    try {
      const exercise = await exercisesService.getExerciseById(id);
      set({
        currentExercise: exercise,
        isLoadingExercises: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al cargar ejercicio";
      set({
        errorExercises: message,
        isLoadingExercises: false,
      });
    }
  },

  searchExercises: async (query: string) => {
    set({ isLoadingExercises: true, errorExercises: null });
    try {
      const response = await exercisesService.searchExercises(query);
      set({
        exercises: response.data,
        totalExercises: response.total,
        isLoadingExercises: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error en búsqueda";
      set({
        errorExercises: message,
        isLoadingExercises: false,
      });
    }
  },

  getFilterOptions: async () => {
    try {
      return await exercisesService.getFilterOptions();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al cargar filtros";
      set({ errorExercises: message });
      throw error;
    }
  },

  // ============ ACCIONES DE LIMPIEZA ============

  clearError: () => {
    set({ error: null, errorExercises: null, errorPlans: null });
  },

  clearPlans: () => {
    set({
      trainingPlans: [],
      currentPlan: null,
      errorPlans: null,
      isLoadingPlans: false,
    });
  },

  clearExercises: () => {
    set({
      exercises: [],
      currentExercise: null,
      errorExercises: null,
      isLoadingExercises: false,
    });
  },

  clearCurrentPlan: () => {
    set({ currentPlan: null });
  },
}));
