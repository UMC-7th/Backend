// -----------  SubMeal DTO ----------

import { InvalidInputError } from "../util/error.js";

export interface SubMealDTO {
  category: string; // 구독 식단 유형
  mealDate: Date;
  time: string; // 식사 시간 (아침, 점심, 저녁)
  foods: string[]; // 식단 음식 리스트
  calorieTotal: number;
}

export const subMealDTO = (body: SubMealDTO): SubMealDTO => {
  if (!body.category) {
    throw new InvalidInputError("구독 타입이 누락되었습니다.", "입력 값: 없음");
  }
  if (!body.mealDate) {
    throw new InvalidInputError("식단 날짜가 누락되었습니다.", "입력 값: 없음");
  }
  if (!body.time) {
    throw new InvalidInputError("식사 시간이 누락되었습니다.", "입력 값: 없음");
  }
  if (!body.foods || body.foods.length === 0) {
    throw new InvalidInputError("음식 목록이 누락되었습니다.", "입력 값: 없음");
  }
  if (!body.calorieTotal) {
    throw new InvalidInputError("총 칼로리가 누락되었습니다.", "입력 값: 없음");
  }

  return body;
};
