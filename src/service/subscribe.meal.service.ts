import {
  addMeal,
  getMealById,
  getMealsByIds,
} from "../repository/meal.repository.js";
import {
  addSubMeal,
  getCategoryIdByType,
  getSubMealByTypeId,
  getSubMealIdsByDate,
} from "../repository/subscribe.meal.repository.js";
import { AlreadyExistError } from "../util/error.js";

export const addSubMealService = async (
  type: string,
  mealDate: Date,
  time: string,
  foods: string[],
  calorieTotal: number
) => {
  const categoryId: number = await getCategoryIdByType(type);

  const existingMeals = await getSubMealIdsByDate(mealDate, time, categoryId);

  if (existingMeals) {
    throw new AlreadyExistError(
      "이미 해당 날짜에 식단을 등록하셨습니다",
      "입력 값: " + { mealDate, type, time }
    );
  }
  const mealId = await addMeal({ foods, calorieTotal });

  await addSubMeal(categoryId, mealId, time, mealDate);

  return await getMealById(mealId);
};

export const getSubMealService = async (type: string) => {
  const categoryId: number = await getCategoryIdByType(type);

  const subMeals = await getSubMealByTypeId(categoryId);

  const mealIds = subMeals.map((subMeals) => subMeals.mealId);

  return await getMealsByIds(mealIds);
};
