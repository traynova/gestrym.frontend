import { apiNutritionClient } from './axios.config';
import { NUTRITION_ENDPOINTS } from './nutrition.endpoints';
import { handleApiError as errorHandler } from '../lib/errors/errorHandler';
import {
  DailyNutritionResponse,
  CreateFoodLogDto,
  AIAdjustmentResponse,
  Food,
  MealPlan,
  CreateMealPlanDto,
} from '../types/nutrition';

export const nutritionService = {
  async getDailyLogs(date: string): Promise<DailyNutritionResponse> {
    try {
      const response = await apiNutritionClient.get<DailyNutritionResponse>(
        NUTRITION_ENDPOINTS.GET_DAILY_LOGS,
        { params: { date } }
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  async createFoodLog(data: CreateFoodLogDto): Promise<void> {
    try {
      await apiNutritionClient.post(NUTRITION_ENDPOINTS.CREATE_LOG, data);
    } catch (error) {
      throw errorHandler(error);
    }
  },

  async adjustGoals(): Promise<AIAdjustmentResponse> {
    try {
      const response = await apiNutritionClient.post<AIAdjustmentResponse>(
        NUTRITION_ENDPOINTS.ADJUST_GOALS
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  async searchFoods(query: string): Promise<Food[]> {
    try {
      const response = await apiNutritionClient.get<Food[]>(
        NUTRITION_ENDPOINTS.SEARCH_FOODS,
        { params: { q: query } }
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  async getMealPlans(userId?: string): Promise<MealPlan[]> {
    try {
      const response = await apiNutritionClient.get<MealPlan[]>(
        NUTRITION_ENDPOINTS.GET_PLANS,
        { params: { userId } }
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  async createMealPlan(data: CreateMealPlanDto): Promise<MealPlan> {
    try {
      const response = await apiNutritionClient.post<MealPlan>(
        NUTRITION_ENDPOINTS.CREATE_PLAN,
        data
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },

  async assignMealPlan(planId: string, userId: string): Promise<void> {
    try {
      await apiNutritionClient.post(NUTRITION_ENDPOINTS.ASSIGN_PLAN, {
        planId,
        userId,
      });
    } catch (error) {
      throw errorHandler(error);
    }
  },

  async generateAIMealPlan(preferences: string): Promise<MealPlan> {
    try {
      const response = await apiNutritionClient.post<MealPlan>(
        NUTRITION_ENDPOINTS.GENERATE_AI_PLAN,
        { preferences }
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error);
    }
  },
};
