import { prisma } from "../db.config.js";
import {
  BaseMealActionDTO,
  BaseMealDTO,
  CompleteMealDTO,
  MealUserDTO,
} from "../dto/meal.dto.js";

//유저에게 제공한 식단과 유저 매핑하는 함수
export const addMealToUser = async (data: MealUserDTO) => {
  const meal = await prisma.mealUser.create({
    data: {
      mealId: data.mealId,
      userId: data.userId,
      time: data.time,
      mealDate: data.mealDate,
    },
  });

  return meal;
};

//식단 업데이트 함수

export const updateMeal = async (data: any, mealId: number) => {
  const updatedMeal = await prisma.meal.update({
    where: {
      mealId: mealId,
    },
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

  return updatedMeal.mealId;
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
export const addCompletedMeal = async (data: CompleteMealDTO) => {
  const eatMeal = await prisma.eatMeal.create({
    data: {
      userId: data.userId,
      mealId: data.mealId,
      eatAt: data.mealDate,
    },
  });

  return eatMeal;
};
// 날짜로 제공한 식단 가져오는 함수
export const getMealIdsByDate = async (data: BaseMealDTO) => {
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
    select: {
      mealId: true,
    },
  });

  return meals;
};
export const getMealById = async (mealId: number) => {
  const meal = await prisma.meal.findFirst({
    where: {
      mealId,
    },
    orderBy: {
      calorieTotal: "desc",
    },
  });

  return meal;
};
export const getMealsByIds = async (mealIds: number[]) => {
  const meals = await prisma.meal.findMany({
    where: {
      mealId: { in: mealIds },
    },
  });
  return meals;
};
export const getManualMealsByIds = async (mealIds: number[]) => {
  const meals = await prisma.meal.findMany({
    where: {
      mealId: { in: mealIds },
      addedByUser: true,
    },
    include: {
      MealUser: {
        select: {
          mealDate: true,
          time: true,
        },
      },
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
export const deleteUserMealByIds = async (data: BaseMealActionDTO) => {
  const meal = await prisma.mealUser.deleteMany({
    where: {
      userId: data.userId,
      mealId: data.mealId,
    },
  });

  return meal.count;
};
export const deleteEatMealByIds = async (data: any) => {
  const eatMeal = await prisma.eatMeal.deleteMany({
    where: {
      userId: data.userId,
      mealId: data.mealId,
    },
  });

  return eatMeal.count;
};
export const deleteMealById = async (mealId: number) => {
  const meal = await prisma.meal.delete({
    where: {
      mealId: mealId,
    },
  });

  return meal;
};
export const getmealUserByIds = async (data: BaseMealActionDTO) => {
  const mealUser = await prisma.mealUser.findFirst({
    where: {
      userId: data.userId,
      mealId: data.mealId,
    },
  });

  return mealUser;
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
export const getFavoritMealById = async (userId: number) => {
  const favoriteMeals = await prisma.mealUser.findMany({
    where: {
      userId,
      isMark: true,
    },
    include: {
      meal: true,
    },
    orderBy: {
      meal: {
        calorieTotal: "desc",
      },
    },
  });

  return favoriteMeals;
};
export const getFavoritMealByIdLatest = async (userId: number) => {
  const favoriteMeals = await prisma.mealUser.findMany({
    where: {
      userId,
      isMark: true,
    },
    include: {
      meal: true,
    },
    orderBy: {
      mealDate: "desc",
    },
  });

  return favoriteMeals;
};

export const deleteFavoriteMeal = async (data: BaseMealActionDTO) => {
  const deletedFavoriteMeal = await prisma.mealUser.updateMany({
    where: {
      userId: data.userId,
      mealId: data.mealId,
      isMark: true,
    },
    data: {
      isMark: false,
    },
  });

  return deletedFavoriteMeal;
};
export const getLikedMeal = async (userId: number) => {
  const likedMeals = await prisma.mealUser.findMany({
    where: {
      userId: userId,
      isLike: true,
    },
    take: 3,
    include: {
      meal: {
        select: {
          food: true,
        },
      },
    },
  });
  return likedMeals;
};
export const addDislikeMeal = async (data: BaseMealActionDTO) => {
  const dislikeMeal = await prisma.mealUser.updateMany({
    where: {
      userId: data.userId,
      mealId: data.mealId,
    },
    data: {
      isHate: true,
    },
  });
  return dislikeMeal;
};

export const deleteDislikeMeal = async (data: BaseMealActionDTO) => {
  const likedMeals = await prisma.mealUser.updateMany({
    where: {
      userId: data.userId,
      mealId: data.mealId,
    },
    data: {
      isHate: false,
    },
  });
  return likedMeals;
};
export const getDislikeMeal = async (userId: number) => {
  const dislikeMeals = await prisma.mealUser.findMany({
    where: {
      userId: userId,
      isHate: true,
    },
    take: 3,
    include: {
      meal: {
        select: {
          food: true,
        },
      },
    },
  });
  return dislikeMeals;
};
export const getEatMealByIds = async (data: BaseMealActionDTO) => {
  const eatMeal = await prisma.eatMeal.findMany({
    where: {
      userId: data.userId,
      mealId: data.mealId,
    },
  });
  return eatMeal;
};
