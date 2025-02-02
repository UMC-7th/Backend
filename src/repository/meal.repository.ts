import { prisma } from "../db.config.js";
import { DailyMeal, MealRequest } from "../dto/meal.dto.js";

//유저에게 제공한 식단과 유저 매핑하는 함수
export const addMealToUser = async (
  userId: number,
  mealId: number,
  time: string,
  mealDate: Date
) => {
  const meal = await prisma.mealUser.create({
    data: {
      mealId: mealId,
      userId: userId,
      time: time,
      mealDate: mealDate,
    },
  });

  return meal.mealId;
};
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
//완료한 식사를 저장하는 함수
export const addCompletedMeal = async (data: MealRequest, mealId: number) => {
  const eatMeal = await prisma.eatMeal.create({
    data: {
      userId: data.userId,
      mealId: mealId,
      eatAt: data.mealDate,
    },
  });

  return eatMeal;
};
// 날짜로 제공한 식단 가져오는 함수
export const getMealByDate = async (data: MealRequest) => {
  const start = new Date(data.mealDate.setHours(0, 0, 0, 0));
  const end = new Date(data.mealDate.setHours(23, 59, 59, 999));

  const meals = await prisma.mealUser.findMany({
    where: {
      userId: data.userId,
      mealDate: {
        gte: start,
        lte: end,
      },
    },
  });

  return meals;
};
export const getManualMeal = async (userId: number) => {};
export const getMealById = async (mealId: number) => {
  const meal = await prisma.meal.findFirst({
    where: {
      mealId,
    },
  });

  return meal;
};
export const getMealsByIds = async (mealIds: number[]) => {
  const meals = await prisma.meal.findMany({
    where: {
      mealId: { in: mealIds },
      addedByUser: true,
    },
  });
  return meals;
};
export const getEatMealById = async (userId: number) => {
  const eatMeal = await prisma.eatMeal.findMany({
    where: {
      userId,
    },
  });

  return eatMeal;
};
export const deleteUserMealByIds = async (data: any) => {
  const meal = await prisma.mealUser.deleteMany({
    where: {
      userId: data.userId,
      mealId: data.mealId,
    },
  });

  return meal;
};
export const getmealUserByIds = async (userId: number, mealId: number) => {
  const mealUser = await prisma.mealUser.findFirst({
    where: {
      userId: userId,
      mealId: mealId,
    },
  });

  return mealUser?.mealUserId || null;
};
export const addFavoriteMeal = async (mealUserId: number) => {
  const mealUser = await prisma.mealUser.update({
    where: {
      mealUserId,
    },
    data: {
      isMark: true,
    },
  });

  return mealUser;
};
export const addPreferreMeal = async (mealUserId: number) => {
  const mealUser = await prisma.mealUser.update({
    where: {
      mealUserId,
    },
    data: {
      isLike: true,
    },
  });

  return mealUser;
};
