import  axios  from "axios";
import { DietRequest } from "../dto/diet.dto.js";

export const getDailyDietService = async (data:DietRequest ) => {
  // getUserById로 유저 존재 확인하는 코드 추가 필요
  // 데이터 유효성 검사 추가로 필요

  const apiKey = process.env.API_KEY; //카톡에 올려둔 gpt api 키 env에 추가해주셔아함

  const prompt: string = `${data.name},  ${data.birthday} 질병: ${data.disease || '없음'}`;
 
  const messages = [
    {
      role: "system",
      // gpt에게 질문할 스크립트입니다 영어로 보내야 토큰이 적게 든대요
      content: `"Please provide a daily personal diet plan with the following format:
- "day": a string representing the date (e.g., "2025-01-15").
- "personalDiet": an array of meal records, where each record contains:
  - "date": a string representing the date of the meal (e.g., "2025-01-15").
  - "mealType": a string representing the type of meal (e.g., "아침", "점심", "저녁").
  - "calories": an integer representing the total calories of the meal.
  - "foods": an array of strings, each representing a food item included in the meal (e.g., ["밥", "김치", "계란찜"]).

The diet should be balanced, nutritious, and appropriate for a typical Korean diet.

Example output:
{
  "day": "2025-01-15",
  "personalDiet": [
    {
      "date": "2025-01-15",
      "mealType": "아침",
      "calories": 350,
      "foods": ["밥", "김치", "계란찜"]
    },
    {
      "date": "2025-01-15",
      "mealType": "점심",
      "calories": 500,
      "foods": ["잡곡밥", "된장찌개", "불고기", "배추김치"]
    },
    {
      "date": "2025-01-15",
      "mealType": "저녁",
      "calories": 400,
      "foods": ["흰쌀밥", "김치찌개", "고등어 구이", "미역국"]
    }
  ]
}
"`,
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
    console.error(error)
    throw new Error("gpt 요청 중 에러 발생!");// 에러 핸들링 코드 추가 후 수정 예정
  }
};
