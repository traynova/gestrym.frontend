export interface Food {
  id: number;
  name: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface FoodLog {
  id: number;
  food: {
    name: string;
    imageUrl: string;
  };
  quantity: number;
  calories: number;
  mealType: string;
}

export interface DailyNutritionResponse {
  data: {
    date: string;
    totals: {
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    };
    goals: {
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    };
    progress: {
      caloriesPct: number;
      proteinPct: number;
      carbsPct: number;
      fatsPct: number;
    };
    foods: FoodLog[];
  };
}

export interface CreateFoodLogDto {
  foodId: number;
  quantity: number;
  mealType: string;
  date: string;
}

export interface AIAdjustmentResponse {
  data: {
    adjustmentNote: string;
    newGoals: {
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    };
  };
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  foods: string[];
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  meals: Meal[];
  createdAt: string;
  isCustom?: boolean;
  assignedBy?: string;
  assignedTo?: string;
}

export interface CreateMealPlanDto {
  name: string;
  description: string;
  meals: Omit<Meal, 'id'>[];
  assignedTo?: string; // Optional if created by trainer for specific user
  isAI?: boolean;
}
