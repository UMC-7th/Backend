import { NextFunction, Request, Response } from "express";
import {
  addDailyMealService,
  addManualMealService,
  completeMealService,
  favoriteMealService,
  getDailyMealService,
  getManualMealService,
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
    const mealRequest = mealRequestDTO(req.body);

    const existingMeals = await getDailyMealService(mealRequest);
    let meals;
    if (!existingMeals) {
      meals = await addDailyMealService(mealRequest);

      res.status(200).success(meals);

      return;
    }
    res.status(200).success(existingMeals);
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
export const addManualMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const meal = await addManualMealService(req.body);

    res.status(200).success(meal);
  } catch (error) {
    next(error);
  }
};
export const getManualMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.query.userId);

    const meals = await getManualMealService(userId);

    res.status(200).success(meals);
  } catch (error) {
    next(error);
  }
};
