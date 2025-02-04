import { NextFunction, Request, Response } from "express";
import {
  addDailyMealService,
  addManualMealService,
  completeMealService,
  deleteManualMealService,
  favoriteMealService,
  getDailyMealService,
  getManualMealService,
  preferredMealService,
  refreshMealService,
} from "../service/meal.service.js";
import { mealRequestDTO } from "../dto/meal.dto.js";
import { InvalidInputError } from "../util/error.js";

//하루 식단을 생성하는 api 컨트롤러
export const getDailyMeal = async (
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
    const mealRequest = mealRequestDTO({ userId, mealDate });

    const existingMeals = await getDailyMealService(mealRequest);

    let meals;
    if (existingMeals.length == 0) {
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
  const userId = req.user?.id;
  const { mealDate, mealId, time } = req.body;
  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    const meal = await refreshMealService({ userId, mealDate, mealId, time });

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
  const userId = req.user?.id;
  const { mealDate, mealId } = req.body;

  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    const meal = await completeMealService(
      mealRequestDTO({ userId, mealDate }),
      mealId
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
  const userId = req.user?.id;
  const mealId = req.body.mealId;

  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

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
  const userId = req.user?.id;
  const mealId = req.body.mealId;

  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

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
  const userId = req.user?.id;
  const { mealDate, time, foods, calorieTotal } = req.body;

  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    const meal = await addManualMealService({
      userId,
      mealDate,
      time,
      foods,
      calorieTotal,
      addedByUser: true,
    });

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
  const userId = req.user?.id;

  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    const meals = await getManualMealService(userId);

    res.status(200).success(meals);
  } catch (error) {
    next(error);
  }
};

export const deleteManualMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const mealId = req.body.mealId;
  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    const meals = await deleteManualMealService({ userId, mealId });

    res.status(200).success(meals);
  } catch (error) {
    next(error);
  }
};
