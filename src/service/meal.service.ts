import axios from "axios";
import { manualMealRequest, MealRequest } from "../dto/meal.dto.js";
import { AlreadyExistError, NotFoundError } from "../util/error.js";
import {
  addCompletedMeal,
  addFavoriteMeal,
  addMeal,
  addPreferreMeal,
  deleteUserMealByIds,
  getEatMealById,
  getMealByDate,
  getMealById,
  getMealsByIds,
  getmealUserByIds,
} from "../repository/meal.repository.js";
import { addMealToUser } from "../repository/meal.repository.js";
import { getUserById } from "../repository/user.repository.js";

export const getDailyMealService = async (data: MealRequest) => {
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const existingMeals = await getMealByDate(data);

  if (existingMeals.length > 14) {
    // 아침 점심 저녁 각각 5개씩 해서 15개가 되면 추가 x
    throw new AlreadyExistError(
      "해당 날짜에 식단을 더 이상 추가할 수 없습니다",
      data.mealDate
    );
  }
  const apiKey = process.env.OPENAI_API_KEY;

  const prompt: string = `${data.mealDate}의 식단 ${user.purpose}`; // 유저 프롬프트

  //gpt 프롬프트
  const messages = [
    {
      role: "system",
      content: `"Please create a daily personal diet plan with the following format:
- "day": a string representing the date (e.g., "2025-01-15").
- "meals": an array of meal records, where each record includes:
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

  let result; // axios 응답을 담을 변수
  let gptResult; //gpt 응답을 담을 변수
  const mealIds: number[] = []; //생성한 식단 id들을 담을 배열
  const mealArr: any[] = [];
  try {
    result = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", //gpt 모델 설정
        temperature: 0.4,
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
    throw new Error("gpt 요청 중 에러 발생!");
  }

  gptResult = JSON.parse(result.data.choices[0].message.content);
  //gpt 응답으로 식단 세 개 생성
  for (let i = 0; i < 3; i++) {
    const mealId: number = await addMeal(gptResult.meals[i]);

    mealIds.push(mealId);
  }

  const mealTimes: string[] = ["아침", "점심", "저녁"];

  for (let i = 0; i < 3; i++) {
    await addMealToUser(data.userId, mealIds[i], mealTimes[i], data.mealDate); // 유저에게 식단 제공
  }

  const meals = await getMealByDate(data);
  for (let i = 0; i < meals.length; i++) {
    mealArr.push(await getMealById(meals[i].mealId));
  }
  return mealArr;
};
export const refreshMealService = async (data: any) => {
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const meal = await getMealById(data.mealId);

  if (!meal) {
    throw new NotFoundError("존재하지 않는 식단입니다", data.mealId);
  }

  //식단 삭제
  await deleteUserMealByIds(data);

  const apiKey = process.env.OPENAI_API_KEY;

  const prompt: string = `${data.mealDate}의 식단 ${user.purpose}, ${data.time}`; // 유저 프롬프트

  //gpt 프롬프트
  const messages = [
    {
      role: "system",
      content: `"Please create a daily personal diet plan with the following format:
- "day": a string representing the date (e.g., "2025-01-15").
- "meals": an array of meal records, where each record includes:
  - "time": a string representing the type of meal (e.g., "아침", "점심", "저녁").
  - "calorieTotal": an integer representing the total calories of the meal (e.g., 350).
  - "foods": an array of strings, each representing a food item included in the meal (e.g., ["밥", "김치", "계란찜"]).
  - "price": an integer representing the approximate cost of the meal (e.g., 4000).
  - "difficulty": a string indicating how easy it is to prepare the meal (e.g., "쉬움", "보통", "어려움").

The diet plan should:
- Be balanced and nutritious, with a focus on variety in food items for each meal.
- Follow a typical Korean diet style.
- Include affordable and commonly available ingredients.
- Ensure each meal is realistic and feasible to prepare.

If the user's prompt contains '아침', only provide the '아침' meal.
If the user's prompt contains '점심', only provide the '점심' meal.
If the user's prompt contains '저녁', only provide the '저녁' meal.

If no specific meal is requested, provide one of the meals randomly. 

Example output when '아침' is included:
{
  "mealDate": "2025-01-15",
  "meals": [
    {
      "time": "아침",
      "calorieTotal": 400,
      "foods": ["잡곡밥", "계란프라이", "나물무침", "김치"],
      "price": 4500,
      "difficulty": "쉬움"
    }
  ]
}

Example output when '점심' is included:
{
  "mealDate": "2025-01-15",
  "meals": [
    {
      "time": "점심",
      "calorieTotal": 600,
      "foods": ["현미밥", "된장찌개", "삼겹살구이", "겉절이 김치"],
      "price": 8000,
      "difficulty": "보통"
    }
  ]
}

Example output when '저녁' is included:
{
  "mealDate": "2025-01-15",
  "meals": [
    {
      "time": "저녁",
      "calorieTotal": 450,
      "foods": ["흰쌀밥", "갈비찜", "콩나물무침", "무생채"],
      "price": 9500,
      "difficulty": "어려움"
    }
  ]
}`,
    },
    {
      role: "user",
      content: `${prompt}`,
    },
  ];

  let result; // axios 응답을 담을 변수
  let gptResult; //gpt 응답을 담을 변수
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
    throw new Error("gpt 요청 중 에러 발생!");
  }

  gptResult = JSON.parse(result.data.choices[0].message.content);

  const mealId: number = await addMeal(gptResult.meals[0]);

  await addMealToUser(data.userId, mealId, data.time, data.mealDate); // 유저에게 식단 제공

  return await getMealById(mealId);
};
export const completeMealService = async (
  data: MealRequest,
  mealId: number
) => {
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const meal = await getMealById(mealId);

  if (!meal) {
    throw new NotFoundError("존재하지 않는 식단입니다", mealId);
  }

  const mealComplete = await addCompletedMeal(data, mealId);

  return mealComplete;
};
export const favoriteMealService = async (userId: number, mealId: number) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", userId);
  }

  const meal = await getMealById(mealId);

  if (!meal) {
    throw new NotFoundError("존재하지 않는 식단입니다", mealId);
  }

  const mealUserId = await getmealUserByIds(userId, mealId);

  if (!mealUserId) {
    throw new NotFoundError("유저에게 제공되지 않은 식단입니다", mealUserId);
  }
  const mealUser = await addFavoriteMeal(mealUserId);

  return mealUser;
};
export const preferredMealService = async (userId: number, mealId: number) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", userId);
  }

  const meal = await getMealById(mealId);

  if (!meal) {
    throw new NotFoundError("존재하지 않는 식단입니다", mealId);
  }

  const mealUserId = await getmealUserByIds(userId, mealId);

  if (!mealUserId) {
    throw new NotFoundError("유저에게 제공되지 않은 식단입니다", mealUserId);
  }
  const mealUser = await addPreferreMeal(mealUserId);

  return mealUser;
};
export const addManualMealService = async (data: manualMealRequest) => {
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }
  const mealId: number = await addMeal(data);

  await addMealToUser(data.userId, mealId, data.time, data.mealDate);

  await addCompletedMeal(data, mealId);

  return await getMealById(mealId);
};
export const getManualMealService = async (data: manualMealRequest) => {
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }
  const eatMeals = await getEatMealById(data.userId);

  const mealIds = eatMeals.map((meal) => meal.mealId);

  if (mealIds.length === 0) return [];

  const meals = await getMealsByIds(mealIds);

  return meals;
};
