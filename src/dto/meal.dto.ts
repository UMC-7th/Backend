import { InvalidInputError } from "../util/error.js";

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

// -----------  BaseMeal  DTO ----------
export interface BaseMealDTO {
  userId: number;
  mealDate: Date;
}

export const baseMealDTO = (body: {
  userId?: number;
  mealDate: Date;
}): BaseMealDTO => {
  if (!body.userId) {
    throw new InvalidInputError("잘못된 토큰 값입니다.", "입력 값: 없음");
  }
  if (!body.mealDate) {
    throw new InvalidInputError("날짜가 누락되었습니다.", "입력 값: 없음");
  }

  return {
    userId: body.userId,
    mealDate: new Date(body.mealDate),
  };
};

export interface BaseMealActionDTO {
  userId: number;
  mealId: number;
}

export const baseMealActionDTO = (body: {
  userId?: number;
  mealId?: number;
}): BaseMealActionDTO => {
  if (!body.userId) {
    throw new InvalidInputError("잘못된 토큰 값입니다.", "입력 값: 없음");
  }

  if (!body.mealId) {
    throw new InvalidInputError("식단 ID가 누락되었습니다.", "입력 값: 없음");
  }

  return {
    userId: body.userId,
    mealId: body.mealId,
  };
};

export interface DailyMealDTO extends BaseMealDTO {
  time: string;
}

export const dailyMealDTO = (body: BaseMealDTO, time: string): DailyMealDTO => {
  if (!time) {
    throw new InvalidInputError("식사 시간이 누락되었습니다.", "입력 값: 없음");
  }

  return {
    ...body,
    time,
  };
};

// -----------  CompleteMeal  DTO ----------
export interface CompleteMealDTO {
  userId: number;
  mealId: number;
  mealDate: Date;
}

export const completeMealDTO = (body: CompleteMealDTO): CompleteMealDTO => {
  if (!body.userId) {
    throw new InvalidInputError("잘못된 토큰 값입니다.", "입력 값: 없음");
  }
  if (!body.mealId) {
    throw new InvalidInputError("식단 ID가 누락되었습니다.", "입력 값: 없음");
  }

  if (!body.mealDate) {
    throw new InvalidInputError("날짜가 누락되었습니다.", "입력 값: 없음");
  }
  return {
    userId: body.userId,
    mealId: body.mealId,
    mealDate: new Date(body.mealDate),
  };
};

// -----------  AddManualMeal  DTO ----------
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
  if (!body.mealDate) {
    throw new InvalidInputError("날짜가 누락되었습니다.", "입력 값: 없음");
  }
  if (!body.time) {
    throw new InvalidInputError("식사 시간이 누락되었습니다.", "입력 값: 없음");
  }
  if (!body.foods || body.foods.length === 0) {
    throw new InvalidInputError("음식 목록이 비어 있습니다.", "입력 값: 없음");
  }
  if (body.calorieTotal === undefined || body.calorieTotal < 0) {
    throw new InvalidInputError(
      "칼로리 정보가 누락되었거나 올바르지 않습니다.",
      "입력 값: 없음"
    );
  }
  return {
    userId: body.userId,
    mealDate: new Date(body.mealDate),
    time: body.time,
    foods: body.foods,
    calorieTotal: body.calorieTotal,
    addedByUser: true,
  };
};

// -----------  MEALUSER DTO ----------
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
