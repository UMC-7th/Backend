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

export interface CompleteMealDTO {
  userId: number;
  mealId: number;
  mealDate: Date;
}

export const completeMealDTO = (body: CompleteMealDTO): CompleteMealDTO => {
  return {
    userId: body.userId,
    mealId: body.mealId,
    mealDate: new Date(body.mealDate),
  };
};

export interface AddManualMealDTO {
  userId: number;
  mealDate: Date;
  time: string;
  foods: string[];
  calorieTotal: number;
  addedByUser: boolean;
}

export const addManualMealDTO = (body: {
  userId: number;
  mealDate: Date;
  time: string;
  foods: string[];
  calorieTotal: number;
}): AddManualMealDTO => {
  return {
    userId: body.userId,
    mealDate: new Date(body.mealDate),
    time: body.time,
    foods: body.foods,
    calorieTotal: body.calorieTotal,
    addedByUser: true,
  };
};
export interface MealUserDTO {
  userId: number;
  mealId: number;
  time: string;
  mealDate: Date;
}

export const mealUserDTO = (body: {
  userId: number;
  mealId: number;
  time: string;
  mealDate: string | Date;
}): MealUserDTO => {
  return {
    userId: body.userId,
    mealId: body.mealId,
    time: body.time,
    mealDate:
      body.mealDate instanceof Date ? body.mealDate : new Date(body.mealDate),
  };
};
