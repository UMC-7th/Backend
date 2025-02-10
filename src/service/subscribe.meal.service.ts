import {
  addMeal,
  getMealById,
  getMealsByIds,
} from "../repository/meal.repository.js";
import {
  addSubMeal,
  getCategoryIdByType,
  getSubMealByTypeId,
} from "../repository/subscribe.meal.repository.js";

export const addSubMealService = async (
  type: string,
  mealDate: Date,
  time: string,
  foods: string[],
  calorieTotal: number
) => {
  const mealId = await addMeal({ foods, calorieTotal });
  const categoryId: number = await getCategoryIdByType(type);

  await addSubMeal(categoryId, mealId, time, mealDate);

  return await getMealById(mealId);
};

export const getSubMealService = async (type: string) => {
  const categoryId: number = await getCategoryIdByType(type);

  const subMeals = await getSubMealByTypeId(categoryId);

  const mealIds = subMeals.map((subMeals) => subMeals.mealId);

  return await getMealsByIds(mealIds);
};
