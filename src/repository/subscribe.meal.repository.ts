import { prisma } from "../db.config.js";
import { DBError } from "../util/error.js";

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

export const getCategoryIdByCategory = async (category: string) => {
  try{
    const result = await prisma.mealSubCategory.findFirstOrThrow({
      where: {
        name: category,
      },
    });
  
    return result?.categoryId;
  }catch(error){
    throw new DBError("카테고리 조회 중 오류가 발생했습니다.", error);    
  }
  
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
export const getSubMealByCategoryId = async (categoryId: number) => {
  const mealSubs = await prisma.mealSub.findMany({
    where: {
      categoryId: categoryId,
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

  const meals = await prisma.mealSub.findFirst({
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
export const getMealsByIds = async (mealIds: number[]) => {
  const meals = await prisma.meal.findMany({
    where: {
      mealId: { in: mealIds },
    },
    include: {
      mealSubs: true,
    },
  });
  return meals;
};
