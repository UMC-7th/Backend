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

//gpt에게 받은 식단을 저장하는 함수
export const addMeal = async (data: any) => {
  console.log(data);
  const mealId = await prisma.meal.create({
    data: {
      food: data.foods.join(", "),
      calorieTotal: data.calorieTotal,
      calorieDetail: "",
      price: data.price,
      material: "",
      difficulty: data.difficulty,
      recipe: "",
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

//날짜로 제공한 식단 가져오는 함수
export const getMealByDate = async (data: MealRequest) => {
  const meals = await prisma.mealUser.findMany({
    where: {
      userId: data.userId,
      mealDate: data.mealDate,
    },
  });

  return meals;
};

export const getMealById = async (mealId: number) => {
  const meal = await prisma.meal.findFirst({
    where: {
      mealId,
    },
  });

  return meal;
};

export const deleteMealByIds = async (data: any) => {
  const meal = await prisma.mealUser.deleteMany({
    where: {
      userId: data.userId,
      mealId: data.mealId,
      time: data.time,
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
