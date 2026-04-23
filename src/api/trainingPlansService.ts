/**
 * Servicio de Planes de Entrenamiento (Training Plans Service)
 * Capa de alto nivel para interactuar con la API de planes
 */

import { axiosInstance as axios } from "./axios";
import { handleApiError as errorHandler } from "@/lib/errors/errorHandler";
import {
  TrainingPlan,
  TrainingPlansListResponse,
  CreateTrainingPlanDTO,
  AssignTrainingPlanDTO,
} from "@/types/training";

export const trainingPlansService = {
  /**
   * Obtener todos los planes de entrenamiento del usuario
   * @param userId - ID del usuario
   * @returns Promise con lista de planes
   */
  async getTrainingPlansByUser(userId: string): Promise<TrainingPlansListResponse> {
    try {
      const response = await axios.get<TrainingPlansListResponse>(
        `/private/training-plans/user/${userId}`
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  /**
   * Obtener un plan de entrenamiento específico
   * @param id - ID del plan
   * @returns Promise con datos del plan
   */
  async getTrainingPlanById(id: string): Promise<TrainingPlan> {
    try {
      const response = await axios.get<{ data: TrainingPlan }>(
        `/private/training-plans/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  /**
   * Crear un nuevo plan de entrenamiento
   * @param data - Datos del plan a crear
   * @returns Promise con el plan creado
   */
  async createTrainingPlan(data: CreateTrainingPlanDTO): Promise<TrainingPlan> {
    try {
      const response = await axios.post<{ data: TrainingPlan }>(
        "/private/training-plans",
        data
      );
      return response.data.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  /**
   * Actualizar un plan de entrenamiento existente
   * @param id - ID del plan
   * @param data - Datos a actualizar
   * @returns Promise con el plan actualizado
   */
  async updateTrainingPlan(
    id: string,
    data: Partial<CreateTrainingPlanDTO>
  ): Promise<TrainingPlan> {
    try {
      const response = await axios.put<{ data: TrainingPlan }>(
        `/private/training-plans/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  /**
   * Eliminar un plan de entrenamiento
   * @param id - ID del plan
   * @returns Promise<void>
   */
  async deleteTrainingPlan(id: string): Promise<void> {
    try {
      await axios.delete(`/private/training-plans/${id}`);
    } catch (error) {
      throw errorHandler(error);
    }
  },

  /**
   * Asignar un plan de entrenamiento a un usuario
   * @param id - ID del plan (plantilla)
   * @param data - Usuario y fecha de inicio
   * @returns Promise con el plan asignado
   */
  async assignTrainingPlan(
    id: string,
    data: AssignTrainingPlanDTO
  ): Promise<TrainingPlan> {
    try {
      const response = await axios.post<{ data: TrainingPlan }>(
        `/private/training-plans/${id}/assign`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  /**
   * Marcar un día del plan como completado
   * @param planId - ID del plan
   * @param dayId - ID del día
   * @returns Promise con datos de finalización
   */
  async completeTrainingDay(
    planId: string,
    dayId: string
  ): Promise<{ dayId: string; isCompleted: boolean; completedAt: string }> {
    try {
      const response = await axios.patch<{
        data: { dayId: string; isCompleted: boolean; completedAt: string };
      }>(`/private/training-plans/${planId}/days/${dayId}/complete`);
      return response.data.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  /**
   * Adaptar un plan de entrenamiento con IA
   * Basado en el progreso actual del usuario
   * @param planId - ID del plan a adaptar
   * @param userId - ID del usuario
   * @returns Promise con el plan adaptado (clonado)
   */
  async adaptTrainingPlan(planId: string, userId: string): Promise<TrainingPlan> {
    try {
      const response = await axios.post<{ data: TrainingPlan }>(
        "/private/training-plans/adapt",
        { planId, userId }
      );
      return response.data.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },
};
