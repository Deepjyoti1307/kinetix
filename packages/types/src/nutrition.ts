export type MealCategory = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItemSummary extends MacroNutrients {
  id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  isCustom?: boolean;
}

export interface MealItemEntry extends MacroNutrients {
  id: string;
  foodId: string;
  name: string;
  servingQuantity: number;
  servingUnit: string;
}

export interface MealSummary {
  id: string;
  date: string;
  category: MealCategory;
  items: MealItemEntry[];
  totalMacros: MacroNutrients;
}

export interface DayNutritionSummary {
  date: string;
  targetCalories: number;
  targetMacros: MacroNutrients;
  consumedMacros: MacroNutrients;
  remainingCalories: number;
  meals: MealSummary[];
}

export interface DietPlanParsedItem {
  name: string;
  estimatedQuantity: number;
  unit: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
}

export interface DietPlanParsedMeal {
  category: MealCategory;
  items: DietPlanParsedItem[];
  targetCalories?: number;
}

export interface DietPlanStructure {
  name: string;
  description?: string;
  sourcePdfFilename?: string;
  meals: DietPlanParsedMeal[];
  targetDailyCalories?: number;
  targetDailyMacros?: Partial<MacroNutrients>;
}
