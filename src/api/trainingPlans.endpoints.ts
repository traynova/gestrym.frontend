/**
 * Endpoints de la API para Planes de Entrenamiento
 * Estructura tipo auth.endpoints.ts
 */

import {
  TrainingPlan,
  TrainingPlansListResponse,
  CreateTrainingPlanDTO,
  AssignTrainingPlanDTO,
} from "@/types/training";

export const trainingPlansEndpoints = {
  // GET /private/training-plans/user/:userId - Obtener planes del usuario
  getTrainingPlansByUser: {
    method: "GET" as const,
    url: (userId: string) => `/private/training-plans/user/${userId}`,
  },

  // GET /private/training-plans/:id - Obtener plan específico
  getTrainingPlanById: {
    method: "GET" as const,
    url: (id: string) => `/private/training-plans/${id}`,
  },

  // POST /private/training-plans - Crear nuevo plan
  createTrainingPlan: {
    method: "POST" as const,
    url: "/private/training-plans",
  },

  // PUT /private/training-plans/:id - Actualizar plan
  updateTrainingPlan: {
    method: "PUT" as const,
    url: (id: string) => `/private/training-plans/${id}`,
  },

  // DELETE /private/training-plans/:id - Eliminar plan
  deleteTrainingPlan: {
    method: "DELETE" as const,
    url: (id: string) => `/private/training-plans/${id}`,
  },

  // POST /private/training-plans/:id/assign - Asignar plan a usuario
  assignTrainingPlan: {
    method: "POST" as const,
    url: (id: string) => `/private/training-plans/${id}/assign`,
  },

  // PATCH /private/training-plans/:id/days/:dayId/complete - Marcar día como completado
  completeTrainingDay: {
    method: "PATCH" as const,
    url: (planId: string, dayId: string) =>
      `/private/training-plans/${planId}/days/${dayId}/complete`,
  },

  // POST /private/training-plans/adapt - Adaptar plan con IA
  adaptTrainingPlan: {
    method: "POST" as const,
    url: "/private/training-plans/adapt",
  },
};

// Tipos de solicitud/respuesta
export interface GetTrainingPlansByUserRequest {
  userId: string;
}

export interface GetTrainingPlansByUserResponse extends TrainingPlansListResponse {}

export interface GetTrainingPlanByIdRequest {
  id: string;
}

export interface GetTrainingPlanByIdResponse {
  data: TrainingPlan;
}

export interface CreateTrainingPlanRequest extends CreateTrainingPlanDTO {}

export interface CreateTrainingPlanResponse {
  data: TrainingPlan;
}

export interface UpdateTrainingPlanRequest {
  id: string;
  data: Partial<CreateTrainingPlanDTO>;
}

export interface UpdateTrainingPlanResponse {
  data: TrainingPlan;
}

export interface DeleteTrainingPlanRequest {
  id: string;
}

export interface AssignTrainingPlanRequest {
  id: string;
  data: AssignTrainingPlanDTO;
}

export interface AssignTrainingPlanResponse {
  data: TrainingPlan;
}

export interface CompleteTrainingDayRequest {
  planId: string;
  dayId: string;
}

export interface CompleteTrainingDayResponse {
  data: {
    dayId: string;
    isCompleted: boolean;
    completedAt: string;
  };
}

export interface AdaptTrainingPlanRequest {
  planId: string;
  userId: string;
}

export interface AdaptTrainingPlanResponse {
  data: TrainingPlan;
}
