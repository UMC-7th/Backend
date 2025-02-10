import { prisma } from "../db.config.js";
import { MealRequest } from "../dto/meal.dto.js";

//식단을 저장하는 함수
export const addMeal = async (data: any) => {
  const mealId = await prisma.meal.create({
    data: {
      food: data.foods.join(", "),
      calorieTotal: data.calorieTotal,
      calorieDetail: data.calorieDetail || "제공되지 않았습니다",
      price: data.price || 0,
      material: data.material || "제공되지 않았습니다",
      difficulty: data.difficulty || 0,
      recipe: data.recipe || "제공되지 않았습니다",
      addedByUser: data.addedByUser || false,
    },
  });

  return mealId.mealId;
};

export const getCategoryIdByType = async (type: string) => {
  const category = await prisma.mealSubCategory.findFirstOrThrow({
    where: {
      name: type,
    },
  });

  return category?.categoryId;
};
export const addSubMeal = async (
  categoryId: number,
  mealId: number,
  time: string,
  mealDate: Date
) => {
  const subMeal = await prisma.mealSub.create({
    data: {
      mealId: mealId,
      categoryId: categoryId,
      time: time,
      mealDate: mealDate,
    },
  });

  return subMeal.time;
};
export const getSubMealByTypeId = async (typeId: number) => {
  const mealSubs = await prisma.mealSub.findMany({
    where: {
      categoryId: typeId,
    },
  });

  return mealSubs;
};
export const getSubMealIdsByDate = async (
  mealDate: Date,
  time: string,
  categoryId: number
) => {
  const dateObj = new Date(mealDate);

  const start = new Date(dateObj.setHours(0, 0, 0, 0));
  const end = new Date(dateObj.setHours(23, 59, 59, 999));

  const meals = await prisma.mealSub.findFirstOrThrow({
    where: {
      categoryId: categoryId,
      time: time,
      mealDate: {
        gte: start,
        lte: end,
      },
    },
  });

  return meals;
};
