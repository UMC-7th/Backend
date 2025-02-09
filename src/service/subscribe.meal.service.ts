import axios from "axios";
import { MealRequest } from "../dto/meal.dto.js";
import { NotFoundError } from "../util/error.js";
import {
  addMeal,
  getMealIdsByDate,
  getMealById,
  getLikedMeal,
  getMealsByIds,
} from "../repository/meal.repository.js";
import { addMealToUser } from "../repository/meal.repository.js";
import { getUserById } from "../repository/user.repository.js";

export const addSubMealService = async (
  data: MealRequest,
  mealTime: string
) => {
  const user = await getUserById(data.userId);
  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const likedMeal = await getLikedMeal(data.userId);

  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = `${data.mealDate}의 ${mealTime} 식단 ${user.purpose} 5개 유저 선호 식단 ${likedMeal}`;

  const messages = [
    {
      role: "system",
      content: `
      Always answer in Korean
      Just call rice rice (don’t call it mixed grain rice or brown rice, just rice).
      "Provide breakfast like breakfast, lunch like lunch, and dinner like dinner."
or more professionally:
"Ensure each meal is appropriate for its respective time of day: breakfast should be breakfast-like, lunch should be lunch-like, and dinner should be dinner-like."
      response must be strictly in JSON format, without any additional text.
You are an expert Korean nutritionist and chef specialized in creating healthy, delicious, and practical meal plans.
Please generate 5 different meal options for ${mealTime} with these guidelines:

1. Meal Composition Rules:
- Each meal must follow traditional Korean meal structure (밥, 국/찌개, 메인반찬, 부반찬)
- Rice (밥) is mandatory and should be white rice, brown rice, or mixed grain rice
- Include seasonal ingredients appropriate for the current month
- Ensure dishes complement each other in taste and texture
- Balance between meat, vegetables, and fermented foods

2. Nutritional Guidelines:
- Proper protein portion (meat, fish, eggs, or tofu) in each meal
- Include various vegetables for vitamins and minerals
- Consider appropriate portion sizes for normal adults
- Include fermented foods (김치 etc.) for gut health
- Maintain reasonable calorie ranges:
  * 아침: 400-600 calories
  * 점심: 600-800 calories
  * 저녁: 500-700 calories

3. Practicality Rules:
- Use commonly available ingredients in Korean households
- Keep preparation methods realistic for home cooking
- Vary cooking methods (구이, 조림, 볶음, 찜 etc.)
- Consider preparation time and difficulty
- Provide clear, concise recipes for dishes that need them

4. Meal Variety Requirements:
- Each of the 5 meals must be distinctly different
- Vary main protein sources (beef, pork, chicken, fish, eggs, tofu)
- Different cooking methods for each meal
- Diverse vegetable side dishes
- Various types of soup/stew (국, 찌개, 탕)

      {
        "day": string (e.g., "2025-01-15"),
        "mealTime": "${mealTime}",
        "meals": [
          {
            "calorieTotal": integer,
            "calorieDetail": string (e.g., "밥: 300, 된장찌개: 150"),
            "foods": string[] (must include "밥"),
            "price": integer,
            "difficulty": integer (1-5),
            "material": string,
            "recipe": string,
            "addedByUser": false
          }
        ] (array of 5 different meals)
      }
      `,
    },
    {
      role: "user",
      content: prompt,
    },
  ];
  let result;
  try {
    result = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo",
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
    throw new Error(`${mealTime} 식단 생성 중 에러 발생: ${error}`);
  }
  const gptResult = JSON.parse(result.data.choices[0].message.content);
  const mealIds: number[] = [];
  const mealArr: any[] = [];

  // 5개의 식단을 병렬로 데이터베이스에 저장
  await Promise.all(
    gptResult.meals.map(async (meal: any) => {
      const mealId = await addMeal(meal); //meal 테이블에 식단 생성

      const mealType = await addMealToUser(
        data.userId,
        mealId,
        mealTime,
        data.mealDate
      ); //유저와 식단 매핑(유저에게 식단 제공)

      const mealDetail = await getMealById(mealId);

      mealArr.push({ mealDetail, mealType });
    })
  );

  return mealArr;
};

export const getSubMealService = async (data: MealRequest) => {
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const mealIds = await getMealIdsByDate(data);
  const mealIdsArray = mealIds.map((meal) => meal.mealId);
  const meals = await getMealsByIds(mealIdsArray);
  return meals;
};
