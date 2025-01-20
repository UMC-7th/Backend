import { prisma } from "../db.config.js";
import { DailyMeal, MealRequest } from "../dto/meal.dto.js";

export const addMeal = async (time: string, mealDate: Date) => {
  const meal = await prisma.meal.create({
    data: {
      time: time, // 아침, 점심, 저녁
      isEat: false, // 먹었는지 여부
      isLike: false, // 좋아요
      isFix: false, // 즐겨찾기
      mealDate: mealDate,
    },
  });

  return meal.mealId;
};

export const addMealDetail = async (data: any, mealId: number) => {
  await prisma.mealDetail.create({
    data: {
      mealId: mealId,
      food: data.foods.join(", "),
      calorieTotal: data.calorieTotal,
      price: data.price,
      material: "",
      calorieDetail: "",
      difficulty: data.difficulty,
      recipe: "",
    },
  });
};

export const addMealToUser = async (data: MealRequest, mealId: number) => {
  const eatMeal = await prisma.eatMeal.create({
    data: {
      userId: data.userId,
      mealId: mealId,
      eatAt: data.mealDate,
    },
  });
  ``;

  return eatMeal.eatId;
};

export const getMealByDate = async (userId: number, mealDate: Date) => {
  const meals = await prisma.eatMeal.findMany({
    where: {
      userId,
      eatAt: mealDate,
    },
  });

  return meals;
};
