export interface MealRequest {
  userId: number;
  mealDate: Date;
}
export interface Meal {
  time: string;
  calorieTotal: number;
  foods: string[];
  price: string;
  difficulty: string;
}

export interface DailyMeal {
  mealDate: string;
  meals: Meal[];
}

export const mealRequestDTO = (body: any): MealRequest => {
  return {
    userId: body.userId,
    mealDate: new Date(body.mealDate),
  };
};
