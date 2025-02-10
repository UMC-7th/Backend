import { NextFunction, Request, Response } from "express";
import {} from "../service/meal.service.js";
import {
  addSubMealService,
  getSubMealService,
} from "../service/subscribe.meal.service.js";
import { InvalidInputError } from "../util/error.js";

//구독 식단을 조회하는 컨트롤러
export const getSubMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const category = req.query?.category as string;

  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    const existingSubMeals = await getSubMealService(category);

    res.status(200).success(existingSubMeals);
  } catch (error) {
    next(error);
  }
};

//구독 식단을 조회하는 컨트롤러
export const addSubMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //구독타입,날짜,식사시간(아침,점심,저녁),식단,칼로리
    const { type, mealDate, time, foods, calorieTotal } = req.body;
    const subMeal = await addSubMealService(
      type,
      mealDate,
      time,
      foods,
      calorieTotal
    );

    res.status(200).success(subMeal);
  } catch (error) {
    next(error);
  }
};
