import { apiProgressClient } from './axios.config';
import { PROGRESS_ENDPOINTS } from './progress.endpoints';
import { handleApiError as errorHandler } from '../lib/errors/errorHandler';
import {
  CreateMetricsDto,
  MetricsResponse,
  ChartResponse,
  UploadPhotoDto,
  PhotosResponse,
  ComparisonResponse,
  CreateWorkoutProgressDto,
  WorkoutProgressResponse,
  CreateTrainerNoteDto,
  TrainerNotesResponse,
} from '../types/progress';

export const progressService = {
  // 1. Métricas de Usuario
  async createMetric(data: CreateMetricsDto): Promise<void> {
    try {
      await apiProgressClient.post(PROGRESS_ENDPOINTS.CREATE_METRIC, data);
    } catch (error) {
      throw errorHandler(error);
    }
  },

  async getUserMetrics(userId: number | string, limit: number = 10, offset: number = 0): Promise<MetricsResponse> {
    try {
      const response = await apiProgressClient.get<MetricsResponse>(
        PROGRESS_ENDPOINTS.GET_USER_METRICS(userId),
        { params: { limit, offset } }
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  async getUserChart(userId: number | string): Promise<ChartResponse> {
    try {
      const response = await apiProgressClient.get<ChartResponse>(
        PROGRESS_ENDPOINTS.GET_USER_CHART(userId)
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  // 2. Fotos de Progreso
  async uploadPhoto(data: UploadPhotoDto): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('type', data.type);
      formData.append('date', data.date);

      await apiProgressClient.post(PROGRESS_ENDPOINTS.UPLOAD_PHOTO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      throw errorHandler(error);
    }
  },

  async getUserPhotos(userId: number | string): Promise<PhotosResponse> {
    try {
      const response = await apiProgressClient.get<PhotosResponse>(
        PROGRESS_ENDPOINTS.GET_USER_PHOTOS(userId)
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  // 3. Comparación (Antes vs Ahora)
  async getUserComparison(userId: number | string): Promise<ComparisonResponse> {
    try {
      const response = await apiProgressClient.get<ComparisonResponse>(
        PROGRESS_ENDPOINTS.GET_USER_COMPARISON(userId)
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  // 4. Progreso por Rutina
  async createWorkoutProgress(data: CreateWorkoutProgressDto): Promise<void> {
    try {
      await apiProgressClient.post(PROGRESS_ENDPOINTS.CREATE_WORKOUT_PROGRESS, data);
    } catch (error) {
      throw errorHandler(error);
    }
  },

  async getUserWorkoutProgress(userId: number | string): Promise<WorkoutProgressResponse> {
    try {
      const response = await apiProgressClient.get<WorkoutProgressResponse>(
        PROGRESS_ENDPOINTS.GET_USER_WORKOUT_PROGRESS(userId)
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  // 5. Notas del Entrenador
  async createTrainerNote(data: CreateTrainerNoteDto): Promise<void> {
    try {
      await apiProgressClient.post(PROGRESS_ENDPOINTS.CREATE_NOTE, data);
    } catch (error) {
      throw errorHandler(error);
    }
  },

  async getUserTrainerNotes(userId: number | string): Promise<TrainerNotesResponse> {
    try {
      const response = await apiProgressClient.get<TrainerNotesResponse>(
        PROGRESS_ENDPOINTS.GET_USER_NOTES(userId)
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },
};
