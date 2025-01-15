import axios from "axios";
import { DietRequest } from "../dto/diet.dto.js";

export const getDailyDietService = async (data: DietRequest) => {
  // getUserById로 유저 존재 확인하는 코드 추가 필요
  // 데이터 유효성 검사 추가로 필요

  const apiKey = process.env.API_KEY; //카톡에 올려둔 gpt api 키 env에 추가해주셔아함

  //const prompt: string = ` ${user.birth}년생 질병: ${user.disease || "없음"}`;
  const prompt: string = `${data.mealDate}의 식단 유저 정보 : 03년생 질병: 없음`;

  const messages = [
    {
      role: "system",
      // gpt에게 질문할 스크립트입니다 영어로 보내야 토큰이 적게 든대요
      content: `"Please create a daily personal diet plan with the following format:
- "day": a string representing the date (e.g., "2025-01-15").
- "diets": an array of meal records, where each record includes:
  - "time": a string representing the type of meal (e.g., "아침", "점심", "저녁").
  - "calorieTotal": an integer representing the total calories of the meal (e.g., 350).
  - "foods": an array of strings, each representing a food item included in the meal (e.g., ["밥", "김치", "계란찜"]).
  - "price": a string representing the approximate cost of the meal (e.g., "4000원").
  - "difficulty": a string indicating how easy it is to prepare the meal (e.g., "쉬움", "보통", "어려움").

The diet plan should:
- Be balanced and nutritious, with a focus on variety in food items for each meal.
- Follow a typical Korean diet style.
- Include affordable and commonly available ingredients.
- Ensure each meal is realistic and feasible to prepare.

Example output:
{
  "mealDate": "2025-01-15",
  "diets": [
    {
      "time": "아침",
      "calorieTotal": 400,
      "foods": ["잡곡밥", "계란프라이", "나물무침", "김치"],
      "price": "4500원",
      "difficulty": "쉬움"
    },
    {
      "time": "점심",
      "calorieTotal": 600,
      "foods": ["현미밥", "된장찌개", "삼겹살구이", "겉절이 김치"],
      "price": "8000원",
      "difficulty": "보통"
    },
    {
      "time": "저녁",
      "calorieTotal": 450,
      "foods": ["흰쌀밥", "갈비찜", "콩나물무침", "무생채"],
      "price": "9500원",
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
  try {
    //gpt한테 요청 보내는 api입니다
    const result = await axios.post(
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
    return result.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error("gpt 요청 중 에러 발생!"); // 에러 핸들링 코드 추가 후 수정 예정
  }
};
