import { SubMealDTO } from "../dto/subscribe.meal.dto.js";
import { addMeal, getMealById } from "../repository/meal.repository.js";
import {
  addSubMeal,
  getCategoryIdByCategory,
  getMealsByIds,
  getSubMealByCategoryId,
  getSubMealIdsByDate,
} from "../repository/subscribe.meal.repository.js";
import { AlreadyExistError } from "../util/error.js";

export const addSubMealService = async (data: SubMealDTO) => {
  // 구독 타입에 대한 카테고리 ID 가져오기
  const categoryId: number = await getCategoryIdByCategory(data.category);

  // 기존에 등록된 구독 식단이 있는지 체크
  const existingMeals = await getSubMealIdsByDate(
    data.mealDate,
    data.time,
    categoryId
  );

  // 이미 해당 날짜에 식단이 등록되었으면 에러
  if (existingMeals) {
    throw new AlreadyExistError(
      "이미 해당 날짜에 식단을 등록하셨습니다",
      "입력 값: " + data
    );
  }

  // 새로운 식단 추가
  const mealId = await addMeal(data);

  // 식단을 구독에 추가
  await addSubMeal(categoryId, mealId, data.time, data.mealDate);

  // 추가된 식단 조회하여 반환
  return await getMealById(mealId);
};

export const getSubMealService = async (category: string) => {
  // categoryId 가져오기
  const categoryId: number = await getCategoryIdByCategory(category);

  // 해당 카테고리의 구독 식단 가져오기
  const subMeals = await getSubMealByCategoryId(categoryId);

  // 구독 식단의 mealId 목록 가져오기
  const mealIds = subMeals.map((subMeals) => subMeals.mealId);

  // 식단 ID 목록을 통해 식단 정보 조회하여 반환
  return await getMealsByIds(mealIds);
};
