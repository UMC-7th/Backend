import { NextFunction, Request, Response } from "express";
import {
  completeMealService,
  favoriteMealService,
  getDailyMealService,
  preferredMealService,
  refreshMealService,
} from "../service/meal.service.js";
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

export const refreshMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //req.body => userId,mealId,time(아침,점심,저녁),mealDate
    const meal = await refreshMealService(req.body);

    res.status(200).success(meal);
  } catch (error) {
    next(error);
  }
};

export const completeMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const meal = await completeMealService(
      mealRequestDTO(req.body),
      req.body.mealId
    );

    res.status(200).success(meal);
  } catch (error) {
    next(error);
  }
};

export const favoriteMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, mealId } = req.body;

    const meals = await favoriteMealService(userId, mealId);

    res.status(200).success(meals);
  } catch (error) {
    next(error);
  }
};

export const preferredMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, mealId } = req.body;

    const meals = await preferredMealService(userId, mealId);

    res.status(200).success(meals);
  } catch (error) {
    next(error);
  }
};
