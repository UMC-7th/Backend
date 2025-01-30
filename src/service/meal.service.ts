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
      content: `"Please generate a daily personal diet plan with the following format:
- "day": a string representing the date (e.g., "2025-01-15").
- "meals": an array of meal records, where each record includes:
  - "time": a string representing the type of meal (e.g., "아침", "점심", "저녁").
  - "calorieTotal": an integer representing the total calories of the meal (e.g., 350).
  - "calorieDetail": a string listing each food item and its approximate calorie content in the format "food: calorie" (e.g., "밥: 300, 된장찌개: 150, 삼겹살: 400").
  - "foods": an array of strings representing the food items included in the meal. "밥" should always be included as a staple food, without variations (e.g., ["밥", "된장찌개", "삼겹살", "김치"]).
  - "price": an integer representing the approximate cost of the meal (default: 0, e.g., 4000).
  - "difficulty": a string indicating the preparation difficulty (default: "", e.g., "쉬움", "보통", "어려움").
  - "material": a string listing the key ingredients used in the meal (e.g., "쌀, 된장, 두부, 삼겹살, 마늘, 고춧가루").
  - "recipe": a string providing a simple step-by-step cooking guide for dishes that require actual preparation. Very simple foods like 김치 or 계란프라이 should not have a recipe.

The diet plan should:
- Be balanced and nutritious, ensuring a variety of food items for each meal.
- Follow a typical Korean diet style.
- Use affordable and commonly available ingredients.
- Ensure each meal is realistic and feasible to prepare.
- Always include "밥" as a staple food.
- Provide key ingredients and a simple recipe for meals that require preparation.

Example output:
{
  "day": "2025-01-15",
  "meals": [
    {
      "time": "아침",
      "calorieTotal": 400,
      "calorieDetail": "밥: 300, 계란프라이: 80, 김치: 20",
      "foods": ["밥", "계란프라이", "김치"],
      "price": 4500,
      "difficulty": "쉬움",
      "material": "쌀, 계란, 참기름, 김치",
      "recipe": "",
      "addedByUser": false
    },
    {
      "time": "점심",
      "calorieTotal": 600,
      "calorieDetail": "밥: 300, 된장찌개: 150, 삼겹살: 400, 김치: 20",
      "foods": ["밥", "된장찌개", "삼겹살", "김치"],
      "price": 8000,
      "difficulty": "보통",
      "material": "쌀, 된장, 두부, 애호박, 삼겹살, 마늘, 고춧가루",
      "recipe": "된장찌개: 냄비에 물을 넣고 된장을 풀고, 두부와 애호박을 넣어 끓인다. 삼겹살: 프라이팬에서 노릇하게 굽는다.",
      "addedByUser": false
    },
    {
      "time": "저녁",
      "calorieTotal": 450,
      "calorieDetail": "밥: 300, 갈비찜: 600, 콩나물무침: 50, 무생채: 30",
      "foods": ["밥", "갈비찜", "콩나물무침", "무생채"],
      "price": 9500,
      "difficulty": "어려움",
      "material": "쌀, 소갈비, 간장, 설탕, 마늘, 콩나물, 무, 고춧가루",
      "recipe": "갈비찜: 소갈비를 양념(간장, 설탕, 마늘)에 재운 후 찜기에 넣고 푹 익힌다. 콩나물무침: 콩나물을 데친 후 소금과 참기름으로 무친다.",
      "addedByUser": false
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
        //model: "gpt-4-turbo",
        model: "gpt-3.5-turbo",
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
      content: `"Please generate a daily personal diet plan with the following format:
- "day": a string representing the date (e.g., "2025-01-15").
- "meals": an array of meal records, where each record includes:
  - "time": a string representing the type of meal (e.g., "아침", "점심", "저녁").
  - "calorieTotal": an integer representing the total calories of the meal (e.g., 350).
  - "calorieDetail": a string listing each food item and its approximate calorie content in the format "food: calorie" (e.g., "밥: 300, 된장찌개: 150, 삼겹살: 400").
  - "foods": an array of strings representing the food items included in the meal. "밥" should always be included as a staple food, without variations (e.g., ["밥", "된장찌개", "삼겹살", "김치"]).
  - "price": an integer representing the approximate cost of the meal (default: 0, e.g., 4000).
  - "difficulty": a string indicating the preparation difficulty (default: "", e.g., "쉬움", "보통", "어려움").
  - "material": a string listing the key ingredients used in the meal (e.g., "쌀, 된장, 두부, 삼겹살, 마늘, 고춧가루").
  - "recipe": a string providing a simple step-by-step cooking guide for dishes that require actual preparation. Very simple foods like 김치 or 계란프라이 should not have a recipe.

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
      "foods": ["밥", "계란찜", "김치"],
      "material": "쌀, 계란, 소금, 김치",
      "calorieDetail": "밥: 300, 계란찜: 150, 김치: 20",
      "price": 4500, 
      "difficulty": "쉬움",
      "recipe": "계란찜: 계란을 풀고 소금을 조금 넣어 찜통에서 찌면 완성.",
      "addedByUser": false
    }
  ]
}

Example output when '점심' is included:
{
      "time": "점심",
      "calorieTotal": 600,
      "calorieDetail": "밥: 300, 된장찌개: 150, 삼겹살: 400, 김치: 20",
      "foods": ["밥", "된장찌개", "삼겹살", "김치"],
      "price": 8000,
      "difficulty": "보통",
      "material": "쌀, 된장, 두부, 애호박, 삼겹살, 마늘, 고춧가루",
      "recipe": "된장찌개: 냄비에 물을 넣고 된장을 풀고, 두부와 애호박을 넣어 끓인다. 삼겹살: 프라이팬에서 노릇하게 굽는다.",
      "addedByUser": false
    }

Example output when '저녁' is included:
{
  "mealDate": "2025-01-15",
  "meals": [
{
      "time": "저녁",
      "calorieTotal": 450,
      "calorieDetail": "밥: 300, 갈비찜: 600, 콩나물무침: 50, 무생채: 30",
      "foods": ["밥", "갈비찜", "콩나물무침", "무생채"],
      "price": 9500,
      "difficulty": "어려움",
      "material": "쌀, 소갈비, 간장, 설탕, 마늘, 콩나물, 무, 고춧가루",
      "recipe": "갈비찜: 소갈비를 양념(간장, 설탕, 마늘)에 재운 후 찜기에 넣고 푹 익힌다. 콩나물무침: 콩나물을 데친 후 소금과 참기름으로 무친다.",
      "addedByUser": false
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
export const getManualMealService = async (userId: number) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", userId);
  }
  const eatMeals = await getEatMealById(userId);

  const mealIds = eatMeals.map((meal) => meal.mealId);

  if (mealIds.length === 0) return [];

  const meals = await getMealsByIds(mealIds);

  return meals;
};
