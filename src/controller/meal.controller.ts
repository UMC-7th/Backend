import { NextFunction, Request, Response } from "express";
import { getDailyMealService } from "../service/meal.service.js";
import { mealRequestDTO } from "../dto/meal.dto.js";

//하루 식단을 생성하는 api 컨트롤러
export const getDailyMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const meals = await getDailyMealService(mealRequestDTO(req.body));

    res.status(200).success(meals);
  } catch (error) {
    next(error);
  }
};
