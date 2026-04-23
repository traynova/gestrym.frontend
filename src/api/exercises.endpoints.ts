/**
 * Endpoints de la API para Ejercicios
 * Estructura tipo auth.endpoints.ts
 */

import {
  Exercise,
  ExercisesResponse,
  ExerciseFilters,
} from "@/types/training";

export const exercisesEndpoints = {
  // GET /public/exercises - Listar ejercicios con filtros
  getExercises: {
    method: "GET" as const,
    url: "/public/exercises",
    params: (filters?: ExerciseFilters) => ({
      bodyPart: filters?.bodyPart,
      equipment: filters?.equipment,
      target: filters?.target,
      difficulty: filters?.difficulty,
      page: filters?.page || 1,
      pageSize: filters?.pageSize || 20,
    }),
  },

  // GET /public/exercises/:id - Obtener ejercicio específico
  getExerciseById: {
    method: "GET" as const,
    url: (id: string) => `/public/exercises/${id}`,
  },

  // GET /public/exercises/search - Buscar ejercicios por nombre
  searchExercises: {
    method: "GET" as const,
    url: "/public/exercises/search",
    params: (query: string) => ({
      q: query,
    }),
  },

  // GET /public/exercises/filters/options - Obtener opciones de filtros
  getFilterOptions: {
    method: "GET" as const,
    url: "/public/exercises/filters/options",
  },
};

// Tipos de respuesta para TypeScript
export interface GetExercisesRequest {
  filters?: ExerciseFilters;
}

export interface GetExercisesResponse extends ExercisesResponse {}

export interface GetExerciseByIdRequest {
  id: string;
}

export interface GetExerciseByIdResponse {
  data: Exercise;
}

export interface SearchExercisesRequest {
  query: string;
}

export interface SearchExercisesResponse extends ExercisesResponse {}

export interface FilterOptions {
  bodyParts: string[];
  equipment: string[];
  targets: string[];
  difficulties: string[];
}

export interface GetFilterOptionsResponse {
  data: FilterOptions;
}
