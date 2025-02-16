import { NextFunction, Request, Response } from "express";
import {} from "../service/meal.service.js";
import {
  addSubMealService,
  getSubMealService,
} from "../service/subscribe.meal.service.js";
import { InvalidInputError } from "../util/error.js";
import { subMealDTO } from "../dto/subscribe.meal.dto.js";

//구독 식단을 조회하는 컨트롤러
export const getSubMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const category = req.query.category as string; // 구독 식단 카테고리

  try {
    // 유효성 검사
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    // 서비스 호출
    const existingSubMeals = await getSubMealService(category);

    res.status(200).success(existingSubMeals);
  } catch (error) {
    next(error);
  }
};

//구독 식단을 추가하는 컨트롤러
export const addSubMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category, mealDate, time, foods, calorieTotal } = req.body;

    const mealData = subMealDTO({
      category,
      mealDate,
      time,
      foods,
      calorieTotal,
    });

    const subMeal = await addSubMealService(mealData);

    res.status(200).success(subMeal);
  } catch (error) {
    next(error);
  }
};
