import axios from "axios";
import { MealRequest } from "../dto/meal.dto.js";
import { AlreadyExistError, NotFoundError } from "../util/error.js";
import {
  addMeal,
  addMealDetail,
  getMealByDate,
} from "../repository/meal.repository.js";
import { addMealToUser } from "../repository/meal.repository.js";

//유저 더미 데이터
const user = {
  userId: 1,
  email: "testuser@example.com",
  password: "securePassword123!",
  birth: new Date("1990-01-01"),
  name: "홍길동",
  phoneNum: "010-1234-5678",
  purpose: "다이어트를 위해 식단 관리가 필요합니다.",
  isSub: true,
  address: "서울특별시 강남구 테헤란로 123",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const getDailyMealService = async (data: MealRequest) => {
  // getUserById로 유저 존재 확인하는 코드 추가 필요
  // 데이터 유효성 검사 추가로 필요

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", 1);
  }
  const existingMeal = await getMealByDate(user.userId, data.mealDate);

  if (existingMeal) {
    throw new AlreadyExistError(
      "이미 해당 날짜의 식단이 존재합니다",
      data.mealDate
    );
  }

  const mealTimes: string[] = ["아침", "점심", "저녁"];

  const mealIds: number[] = [];

  for (const time of mealTimes) {
    const mealId = await addMeal(time, data.mealDate); // 아침 점심 저녁으로 식단을 세 개 생성

    mealIds.push(mealId); //생성된 식단 id를 저장

    await addMealToUser(data, mealId); // 식단과 유저 매핑
  }

  const apiKey = process.env.API_KEY;

  const prompt: string = `${data.mealDate}의 식단 ${user.purpose}`;

  const messages = [
    {
      role: "system",
      content: `"Please create a daily personal diet plan with the following format:
- "day": a string representing the date (e.g., "2025-01-15").
- "diets": an array of meal records, where each record includes:
  - "time": a string representing the type of meal (e.g., "아침", "점심", "저녁").
  - "calorieTotal": an integer representing the total calories of the meal (e.g., 350).
  - "foods": an array of strings, each representing a food item included in the meal (e.g., ["밥", "김치", "계란찜"]).
  - "price": a intger representing the approximate cost of the meal (e.g., 4000).
  - "difficulty": a string indicating how easy it is to prepare the meal (e.g., "쉬움", "보통", "어려움").

The diet plan should:
- Be balanced and nutritious, with a focus on variety in food items for each meal.
- Follow a typical Korean diet style.
- Include affordable and commonly available ingredients.
- Ensure each meal is realistic and feasible to prepare.

Example output:
{
  "mealDate": "2025-01-15",
  "meals": [
    {
      "time": "아침",
      "calorieTotal": 400,
      "foods": ["잡곡밥", "계란프라이", "나물무침", "김치"],
      "price": 4500,
      "difficulty": "쉬움"
    },
    {
      "time": "점심",
      "calorieTotal": 600,
      "foods": ["현미밥", "된장찌개", "삼겹살구이", "겉절이 김치"],
      "price": 8000,
      "difficulty": "보통"
    },
    {
      "time": "저녁",
      "calorieTotal": 450,
      "foods": ["흰쌀밥", "갈비찜", "콩나물무침", "무생채"],
      "price": 9500,
      "difficulty": "어려움"
    }
  ]
}"`,
    },
    {
      role: "user",
      content: `${prompt}`,
    },
  ];
  let result;
  try {
    result = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", //gpt 모델 설정
        temperature: 1, //대답 창의성 (0~1)
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
    throw new Error("gpt 요청 중 에러 발생!");
  }

  const gptResult = JSON.parse(result.data.choices[0].message.content);
  for (let i = 0; i < 3; i++) {
    await addMealDetail(gptResult.meals[i], mealIds[i]); //식단 세 개에 각각 식단 디테일 연결
  }

  return gptResult;
};
