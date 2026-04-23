/**
 * Servicio de Ejercicios (Exercises Service)
 * Capa de alto nivel para interactuar con la API de ejercicios
 */

import { axiosInstance as axiosPublic } from "./axios";
import { handleApiError as errorHandler } from "@/lib/errors/errorHandler";
import {
  Exercise,
  ExercisesResponse,
  ExerciseFilters,
} from "@/types/training";

export const exercisesService = {
  /**
   * Obtener lista de ejercicios con filtros opcionales
   * @param filters - Filtros para búsqueda (bodyPart, equipment, etc.)
   * @returns Promise con lista de ejercicios
   */
  async getExercises(
    filters?: ExerciseFilters
  ): Promise<ExercisesResponse> {
    try {
      const params = {
        bodyPart: filters?.bodyPart,
        equipment: filters?.equipment,
        target: filters?.target,
        difficulty: filters?.difficulty,
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 20,
      };

      // Filtrar parámetros undefined
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined)
      );

      const response = await axiosPublic.get<ExercisesResponse>(
        "/public/exercises",
        { params: cleanParams }
      );

      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  /**
   * Obtener un ejercicio específico por ID
   * @param id - ID del ejercicio
   * @returns Promise con datos del ejercicio
   */
  async getExerciseById(id: string): Promise<Exercise> {
    try {
      const response = await axiosPublic.get<{ data: Exercise }>(
        `/public/exercises/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  /**
   * Buscar ejercicios por nombre
   * @param query - Término de búsqueda
   * @returns Promise con lista de ejercicios encontrados
   */
  async searchExercises(query: string): Promise<ExercisesResponse> {
    try {
      const response = await axiosPublic.get<ExercisesResponse>(
        "/public/exercises/search",
        { params: { q: query } }
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  /**
   * Obtener opciones de filtros disponibles
   * @returns Promise con arrays de opciones (bodyParts, equipment, etc.)
   */
  async getFilterOptions(): Promise<{
    bodyParts: string[];
    equipment: string[];
    targets: string[];
    difficulties: string[];
  }> {
    try {
      const response = await axiosPublic.get<{
        data: {
          bodyParts: string[];
          equipment: string[];
          targets: string[];
          difficulties: string[];
        };
      }>("/public/exercises/filters/options");
      return response.data.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },
};
