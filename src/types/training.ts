/**
 * Tipos para el módulo de Entrenamiento (Training)
 */

// Exercise - Ejercicio individual del catálogo
export interface Exercise {
  id: string;
  name: string;
  target: string; // e.g., "biceps", "chest"
  bodyPart: string; // e.g., "upper body", "lower body"
  equipment: string; // e.g., "dumbbells", "barbell", "bodyweight"
  gifUrl: string;
  description?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
}

// Set - Conjunto de repeticiones de un ejercicio
export interface Set {
  id: string;
  reps: number;
  weight?: number; // en kg
  duration?: number; // en segundos (para cardio)
  restTime?: number; // tiempo de descanso en segundos
  completed?: boolean;
  notes?: string;
}

// WorkoutExercise - Ejercicio dentro de un workout con sus sets
export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise?: Exercise;
  sets: Set[];
  notes?: string;
  order: number;
}

// Workout - Entrenamiento de un día específico
export interface Workout {
  id: string;
  exercises: WorkoutExercise[];
  totalDuration?: number; // en minutos
  difficulty?: "beginner" | "intermediate" | "advanced";
  notes?: string;
}

// TrainingDay - Día dentro de un plan de entrenamiento
export interface TrainingDay {
  id: string;
  dayNumber: number; // 1-7 para semanal, 1-30 para mensual
  date?: string; // ISO date
  workout?: Workout;
  workoutId?: string;
  isCompleted: boolean;
  completedAt?: string; // ISO datetime
  notes?: string;
}

// TrainingPlan - Plan de entrenamiento asignado a un usuario
export interface TrainingPlan {
  id: string;
  name: string;
  description?: string;
  durationDays: number; // 7, 30, 90, etc.
  days: TrainingDay[];
  assignedTo: string; // userId
  createdBy: string; // trainerId
  createdAt: string; // ISO datetime
  startDate: string; // ISO date
  endDate?: string; // ISO date (calculado)
  goal?: string; // "muscle_gain", "fat_loss", "strength", etc.
  difficulty?: "beginner" | "intermediate" | "advanced";
  notes?: string;
  isTemplate?: boolean; // Para plantillas reutilizables
}

// DTO para crear/actualizar plans
export interface CreateTrainingPlanDTO {
  name: string;
  description?: string;
  durationDays: number;
  days: Omit<TrainingDay, "id">[];
  goal?: string;
  difficulty?: string;
}

export interface AssignTrainingPlanDTO {
  userId: string;
  startDate?: string;
}

// Respuestas de API
export interface ExercisesResponse {
  data: Exercise[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TrainingPlanResponse {
  data: TrainingPlan;
}

export interface TrainingPlansListResponse {
  data: TrainingPlan[];
  total: number;
}

// Filtros para búsqueda de ejercicios
export interface ExerciseFilters {
  bodyPart?: string;
  equipment?: string;
  target?: string;
  difficulty?: string;
  page?: number;
  pageSize?: number;
}
