import { NextFunction, Request, Response } from "express";
import {} from "../service/meal.service.js";
import {
  addSubMealService,
  getSubMealService,
} from "../service/subscribe.meal.service.js";
import { InvalidInputError } from "../util/error.js";
import { mealRequestDTO } from "../dto/meal.dto.js";

//구독 식단을 조회 및 생성하는 컨트롤러
export const getSubMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const mealDate = req.body.mealDate;

  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    const existingMeals = await getSubMealService(mealRequest);

    if (existingMeals.length === 0) {
      // 아침, 점심, 저녁 병렬 처리
      const [breakfastMeals, lunchMeals, dinnerMeals] = await Promise.all([
        addSubMealService(mealRequest, "아침"),
        addSubMealService(mealRequest, "점심"),
        addSubMealService(mealRequest, "저녁"),
      ]);

      const allMeals = [...breakfastMeals, ...lunchMeals, ...dinnerMeals];
      res.status(200).success({ mealDate, allMeals });
      return;
    }
    res.status(200).success({ mealDate, existingMeals });
  } catch (error) {
    next(error);
  }
};
