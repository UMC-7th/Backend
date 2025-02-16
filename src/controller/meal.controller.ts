import { NextFunction, Request, Response } from "express";
import {
  addDailyMealService,
  addDislikeMealService,
  addManualMealService,
  completeMealService,
  deleteDislikeMealService,
  deleteFavoriteMealService,
  deleteManualMealService,
  favoriteMealService,
  getDailyMealService,
  getFavoriteMealLatestService,
  getFavoriteMealService,
  getManualMealService,
  getMealDetailService,
  preferredMealService,
  refreshMealService,
} from "../service/meal.service.js";
import {
  addManualMealDTO,
  baseMealActionDTO,
  baseMealDTO,
  completeMealDTO,
  dailyMealDTO,
} from "../dto/meal.dto.js";
import { InvalidInputError } from "../util/error.js";

// #==================================식단 생성 및 조회==================================#

//하루 식단 생성 및 조회
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

    const mealData = baseMealDTO({ userId, mealDate });

    const existingMeals = await getDailyMealService(mealData);

    //해달 날짜에 식단이 존재하지 않는다면 생성

    if (existingMeals.length === 0) {
      // 아침, 점심, 저녁 병렬 처리
      const [breakfastMeals, lunchMeals, dinnerMeals] = await Promise.all([
        addDailyMealService(dailyMealDTO(mealData, "아침")),
        addDailyMealService(dailyMealDTO(mealData, "점심")),
        addDailyMealService(dailyMealDTO(mealData, "저녁")),
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

// 식단 재생성
export const refreshMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const mealId = req.body.mealId;
  try {
    //DTO
    const mealData = baseMealActionDTO({
      userId,
      mealId,
    });

    const newMeal = await refreshMealService(mealData);

    res.status(200).success(newMeal);
  } catch (error) {
    next(error);
  }
};

// 식단 상세 조회
export const getMealDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const mealId = Number(req.query.mealId);

  try {
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    const favoriteMeals = await getMealDetailService({ userId, mealId });

    res.status(200).success(favoriteMeals);
  } catch (error) {
    next(error);
  }
};

// 식단 완료
export const completeMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { mealDate, mealId } = req.body;

  try {
    // 유효성 검사
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    if (!mealDate) {
      throw new InvalidInputError(
        "날짜가 누락되었습니다 ",
        "입력 값: " + mealDate
      );
    }
    if (!mealId) {
      throw new InvalidInputError(
        "식단 아이디가 누락되었습니다.",
        "입력 값: " + mealId
      );
    }

    // 서비스 계층 호출
    const meal = await completeMealService(
      completeMealDTO({ userId, mealDate, mealId })
    );

    res.status(200).success(meal);
  } catch (error) {
    next(error);
  }
};

// #==================================  식단 즐겨찾기 ==================================#

// 식단 즐겨찾기 추가
export const favoriteMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const mealId = req.body.mealId;

  try {
    // 유효성 검사
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    // DTO
    const mealData = baseMealActionDTO({
      userId,
      mealId,
    });

    const meal = await favoriteMealService(mealData);

    res.status(200).success(meal);
  } catch (error) {
    next(error);
  }
};

// 식단 즐겨찾기 삭제
export const deleteFavoriteMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const mealId = req.body.mealId;

  try {
    // 유효성 검사
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    // DTO
    const mealData = baseMealActionDTO({
      userId,
      mealId,
    });

    //서비스 계층 호출
    const deletedFavoriteMeal = await deleteFavoriteMealService(mealData);

    res.status(200).success(deletedFavoriteMeal);
  } catch (error) {
    next(error);
  }
};

// 식단 즐겨찾기 칼로리순 조회
export const getFavoriteMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    // 유효성 검사
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    //칼로리 순으로 즐겨찾기한 식단 조회
    const favoriteMeals = await getFavoriteMealService(userId);

    res.status(200).success(favoriteMeals);
  } catch (error) {
    next(error);
  }
};

// 식단 즐겨찾기 최신순 조회
export const getFavoriteMealLatest = async (
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

    const favoriteMeals = await getFavoriteMealLatestService(userId);

    res.status(200).success(favoriteMeals);
  } catch (error) {
    next(error);
  }
};

// #==================================수동 식단 ==================================#

// 수동 식단 추가
export const addManualMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { mealDate, time, foods, calorieTotal } = req.body;

  try {
    //유효성 검사
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    //DTO
    const mealDTO = addManualMealDTO({
      userId,
      mealDate,
      time,
      foods,
      calorieTotal,
    });

    //서비스 계층 호출
    const meal = await addManualMealService(mealDTO);

    res.status(200).success(meal);
  } catch (error) {
    next(error);
  }
};

// 수동 식단 조회
export const getManualMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    //유효성 검사
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    //서비스 계층 호출
    const meals = await getManualMealService(userId);

    res.status(200).success(meals);
  } catch (error) {
    next(error);
  }
};

// 수동 식단 삭제
export const deleteManualMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const mealId = req.body.mealId;

  try {
    //유효성 검사
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    //DTO
    const mealData = baseMealActionDTO({
      userId,
      mealId,
    });

    const meal = await deleteManualMealService(mealData);

    res.status(200).success(meal);
  } catch (error) {
    next(error);
  }
};

// #==================================식단 좋아요 ==================================#

// 식단 좋아요 추가
export const preferredMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const mealId = req.body.mealId;

  try {
    // 유효성 검사
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    // DTO
    const mealData = baseMealActionDTO({
      userId,
      mealId,
    });

    // 서비스 계층 호출
    const meal = await preferredMealService(mealData);

    res.status(200).success(meal);
  } catch (error) {
    next(error);
  }
};

// #==================================식단 싫어요 ==================================#

//식단 싫어요 추가
export const addDislikeMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const mealId = req.body.mealId;

  try {
    // 유효성 검사
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    // DTO
    const mealData = baseMealActionDTO({
      userId,
      mealId,
    });

    // 서비스 계층 호출
    const dislikeMeal = await addDislikeMealService(mealData);

    res.status(200).success(dislikeMeal);
  } catch (error) {
    next(error);
  }
};

// 식단 싫어요 삭제
export const deleteDislikeMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const mealId = req.body.mealId;

  try {
    // 유효성 검사
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }

    // DTO
    const mealData = baseMealActionDTO({
      userId,
      mealId,
    });

    // 서비스 계층 호출
    const deleteDislikeMeal = await deleteDislikeMealService(mealData);

    res.status(200).success(deleteDislikeMeal);
  } catch (error) {
    next(error);
  }
};
