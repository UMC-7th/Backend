export interface MealRequest {
  userId: number;
  mealDate: Date;
}
export interface Meal {
  time: string;
  calorieTotal: number;
  foods: string[];
  price: string;
  difficulty: number;
}

export interface DailyMeal {
  mealDate: string;
  meals: Meal[];
}
export interface manualMealRequest {
  userId: number;
  mealDate: Date;
  foods: Meal[];
  time: string;
  calorieTotal: number;
  addedByUser: true;
}

export const mealRequestDTO = (body: MealRequest): MealRequest => {
  return {
    userId: body.userId,
    mealDate: new Date(body.mealDate),
  };
};

export interface CompleteMeal {
  userId: number;
  mealId: number;
  mealDate: Date;
}

export const completeMealDTO = (body: CompleteMeal): CompleteMeal => {
  return {
    userId: body.userId,
    mealId: body.mealId,
    mealDate: new Date(body.mealDate),
  };
};
