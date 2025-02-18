import axios from "axios";
import {
  AddManualMealDTO,
  BaseMealActionDTO,
  BaseMealDTO,
  CompleteMealDTO,
  completeMealDTO,
  DailyMealDTO,
  mealUserDTO,
} from "../dto/meal.dto.js";
import { InvalidInputError, NotFoundError } from "../util/error.js";
import {
  addCompletedMeal,
  addFavoriteMeal,
  addMeal,
  addPreferreMeal,
  deleteEatMealByIds,
  deleteMealById,
  deleteUserMealByIds,
  getEatMealById,
  getFavoritMealById,
  getMealIdsByDate,
  getMealById,
  getManualMealsByIds,
  getmealUserByIds,
  deleteFavoriteMeal,
  getLikedMeal,
  getMealsByIds,
  addDislikeMeal,
  deleteDislikeMeal,
  getFavoritMealByIdLatest,
  updateMeal,
} from "../repository/meal.repository.js";
import { addMealToUser } from "../repository/meal.repository.js";
import { getUserById } from "../repository/user.repository.js";

// #==================================식단 생성 및 조회==================================#

export const addDailyMealService = async (data: DailyMealDTO) => {
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  // 5개의 dummyMealId를 먼저 생성
  const dummyMealIds = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      addMeal({
        calorieTotal: 0,
        calorieDetail: "",
        foods: ["준비 중"],
        price: 0,
        difficulty: 0,
        material: "",
        recipe: "",
        addedByUser: false,
      })
    )
  );

  // 식단을 유저와 매핑
  await Promise.all(
    dummyMealIds.map(async (dummyMealId, index) => {
      const mealUserData = {
        userId: data.userId,
        mealId: dummyMealId,
        time: data.time,
        mealDate: data.mealDate,
      };
      await addMealToUser(mealUserData);
    })
  );

  // 유저의 선호 식단을 조회
  const likedMeal = await getLikedMeal(data.userId);

  const apiKey = process.env.OPENAI_API_KEY;

  const prompt = `${data.mealDate}의 ${data.time} 식단 ${user.purpose} 5개 유저 선호 식단 ${likedMeal}`;

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
        Please generate 5 different meal options for ${data.time} with these guidelines:

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
    throw new Error(`${data.time} 식단 생성 중 에러 발생: ${error}`);
  }

  // json 변환
  const gptResult = JSON.parse(result.data.choices[0].message.content);

  //식단을 저장할 배열
  const mealArr: any[] = [];

  // 5개의 식단을 병렬로 데이터베이스에 저장
  await Promise.all(
    gptResult.meals.map(async (meal: any, index: number) => {
      // dummyMealId 배열에서 해당 인덱스의 값을 사용
      const dummyMealId = dummyMealIds[index];

      // 식단 업데이트
      await updateMeal(meal);

      // 식사 시간(ex : 아침)
      const time = data.time;

      // 식단 조회
      const mealDetail = await getMealById(dummyMealId); // dummyMealId로 식단 조회

      // 배열에 저장
      mealArr.push({ mealDetail, time });
    })
  );

  return mealArr;
};

// 하루 식단 조회
export const getDailyMealService = async (data: BaseMealDTO) => {
  // 유효성 검사
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const mealIds = await getMealIdsByDate(data);

  // userId와 mealDate로 조회 후 mealId들을 배열에 저장
  const mealIdsArray = mealIds.map((meal) => meal.mealId);

  // mealId로 meal 조회 후 리턴
  const meals = await getMealsByIds(mealIdsArray);

  return meals;
};

// 식단 재생성
export const refreshMealService = async (data: BaseMealActionDTO) => {
  //유효성 검사
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const meal = await getMealById(data.mealId);

  if (!meal) {
    throw new NotFoundError("존재하지 않는 식단입니다", data.mealId);
  }

  const mealUser = await getmealUserByIds(data);

  if (!mealUser) {
    throw new NotFoundError("유저에게 제공된 식단이 아닙니다", data.mealId);
  }

  //유저에게 제공한 식단 삭제
  await deleteUserMealByIds(data);

  const apiKey = process.env.OPENAI_API_KEY;

  const prompt: string = `${mealUser.mealDate}의 식단 ${user.purpose}, ${mealUser.time}`; // 유저 프롬프트

  //gpt 프롬프트
  const messages = [
    {
      role: "system",
      content: `"Please generate a daily personal diet plan with the following format:
      "response must be strictly in JSON format, without any additional text"
      "Please generate a daily personal diet plan with the following format:
      "Ensure that the response is always a valid JSON. Do not include extra messages."
       "Each meal should be different, and no meal should repeat within the same response."
      "Ensure variety in food items, calorie content, and preparation difficulty."
- "day": a string representing the date (e.g., "2025-01-15").
- "meals": an array of meal records, where each record includes:
  - "time": a string representing the type of meal (e.g., "아침", "점심", "저녁").
  - "calorieTotal": an integer representing the total calories of the meal (e.g., 350).
  - "calorieDetail": a string listing each food item and its approximate calorie content in the format "food: calorie" (e.g., "밥: 300, 된장찌개: 150, 삼겹살: 400").
  - "foods": an array of strings representing the food items included in the meal. "밥" should always be included as a staple food, without variations (e.g., ["밥", "된장찌개", "삼겹살", "김치"]).
  - "price": an integer representing the approximate cost of the meal (default: 0, e.g., 4000).
  - "difficulty": an integer indicating the preparation difficulty (default: 1, range: 1 to 5, where 1 is easiest and 5 is hardest).
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
      "difficulty": 1,
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
       "difficulty": 3,
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
       "difficulty": 5,
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
        temperature: 0.4, //대답 창의성 (0~1)
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

  //json 변환
  gptResult = JSON.parse(result.data.choices[0].message.content);

  //식단 테이블에 식단 추가
  const mealId: number = await addMeal(gptResult.meals[0]);

  // DTO
  const mealUserData = mealUserDTO({
    userId: data.userId,
    mealId: mealId,
    time: mealUser.time,
    mealDate: mealUser.mealDate,
  });

  // 유저와 식단 매핑
  await addMealToUser(mealUserData);

  const newMeal = await getMealById(mealId);

  return newMeal;
};

//식단 상세 조회
export const getMealDetailService = async (data: BaseMealActionDTO) => {
  // 유효성 검사
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const meal = await getMealById(data.mealId);

  if (!meal) {
    throw new NotFoundError("존재하지 않는 식단입니다", data.mealId);
  }

  const mealDetail = getMealById(data.mealId);

  return mealDetail;
};

// 식단 완료
export const completeMealService = async (data: CompleteMealDTO) => {
  // 유효성 검사
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const meal = await getMealById(data.mealId);

  if (!meal) {
    throw new NotFoundError("존재하지 않는 식단입니다", data.mealId);
  }

  // 리포지토리 계층 호출
  const mealComplete = await addCompletedMeal(data);

  return mealComplete;
};

// #==================================  식단 즐겨찾기 ==================================#

// 식단 즐겨찾기 추가
export const favoriteMealService = async (data: BaseMealActionDTO) => {
  // 유효성 검사
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const meal = await getMealById(data.mealId);

  if (!meal) {
    throw new NotFoundError("존재하지 않는 식단입니다", data.mealId);
  }

  const mealUser = await getmealUserByIds(data);

  if (!mealUser) {
    throw new NotFoundError("유저에게 제공되지 않은 식단입니다", data);
  }

  if (mealUser.isMark === true) {
    throw new InvalidInputError("이미 즐겨찾기한 식단입니다", data);
  }

  // 식단 즐겨찾기
  const favoriteMeal = await addFavoriteMeal(mealUser.mealUserId);

  return favoriteMeal;
};

// 식단 즐겨찾기 삭제
export const deleteFavoriteMealService = async (data: BaseMealActionDTO) => {
  // 유효성 검사
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const meal = await getMealById(data.mealId);

  if (!meal) {
    throw new NotFoundError("존재하지 않는 식단입니다", data.mealId);
  }

  const mealUser = await getmealUserByIds(data);

  if (!mealUser) {
    throw new NotFoundError("유저에게 제공되지 않은 식단입니다", data);
  }

  if (mealUser.isMark === false) {
    throw new InvalidInputError("즐겨찾기한 식단이 아닙니다", data);
  }

  // 즐겨찾기 취소
  const deletedFavoriteMeal = deleteFavoriteMeal(data);

  return deletedFavoriteMeal;
};

// 식단 즐겨찾기 칼로리순 조회
export const getFavoriteMealService = async (userId: number) => {
  // 유효성 검사
  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", userId);
  }

  // 칼로리순으로 즐겨찾기한 식단 조회
  const favoriteMeals = await getFavoritMealById(userId);

  return favoriteMeals;
};

// 식단 즐겨찾기 최신순 조회
export const getFavoriteMealLatestService = async (userId: number) => {
  // 유효성 검사
  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", userId);
  }

  // 최신순으로 즐겨찾기한 식단 조회
  const favoriteMeals = await getFavoritMealByIdLatest(userId);

  return favoriteMeals;
};

// #==================================수동 식단 ==================================#

// 수동 식단 추가
export const addManualMealService = async (data: AddManualMealDTO) => {
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  //식단 테이블에 추가 후 mealId 저장
  const mealId: number = await addMeal(data);

  // DTO
  const mealUserData = mealUserDTO({
    userId: data.userId,
    mealId: mealId,
    time: data.time,
    mealDate: data.mealDate,
  });

  // 유저와 식단 매핑
  await addMealToUser(mealUserData);

  // DTO
  const completedMealData = completeMealDTO({
    userId: data.userId,
    mealId: mealId,
    mealDate: data.mealDate,
  });

  // 수동 식단이므로 바로 완료 처리
  await addCompletedMeal(completedMealData);

  //해당 식단 리턴
  const meal = await getMealById(mealId);

  return meal;
};

// 수동 식단 조회
export const getManualMealService = async (userId: number) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", userId);
  }

  //유저에게 제공된 식단을 받아옴
  const eatMeals = await getEatMealById(userId);

  //mealId만 추출하여 배열에 저장
  const mealIds = eatMeals.map((meal) => meal.mealId);

  //배열의 길이가 0이면 수동 식단 없으므로 [] 리턴
  if (mealIds.length === 0) return [];

  const meals = await getManualMealsByIds(mealIds);

  return meals;
};

// 수동 식단 삭제
export const deleteManualMealService = async (data: BaseMealActionDTO) => {
  //유효성 검사
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const meal = await getMealById(data.mealId);

  if (!meal) {
    throw new NotFoundError("존재하지 않는 식단입니다", data.mealId);
  }

  if (meal.addedByUser == false) {
    throw new NotFoundError("유저가 추가한 식단이 아닙니다", data.mealId);
  }

  const mealUser = await getmealUserByIds(data);

  if (!mealUser) {
    throw new NotFoundError("유저에게 제공된 식단이 아닙니다", data.mealId);
  }

  //mealUser 테이블에서 삭제
  const userMealCount = await deleteUserMealByIds(data);

  //eatMeal 테이블에서 삭제
  const eatMealCount = await deleteEatMealByIds(data);

  //삭제된게 없다면
  if (userMealCount == 0 || eatMealCount == 0) {
    throw new InvalidInputError("식단이 정상적으로 삭제되지 않았습니다", data);
  }

  //식단 삭제
  const deletedMeal = await deleteMealById(data.mealId);

  return deletedMeal;
};

// #==================================식단 좋아요 ==================================#

// 식단 좋아요 추가
export const preferredMealService = async (data: BaseMealActionDTO) => {
  // 유효성 검사
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const meal = await getMealById(data.mealId);

  if (!meal) {
    throw new NotFoundError("존재하지 않는 식단입니다", data.mealId);
  }

  const mealUser = await getmealUserByIds(data);

  if (!mealUser) {
    throw new NotFoundError("유저에게 제공되지 않은 식단입니다", data);
  }

  if (mealUser.isLike === true) {
    throw new InvalidInputError("이미 좋아요를 누른 식단입니다", data);
  }

  //좋아요
  const preferreMeal = await addPreferreMeal(mealUser.mealUserId);

  return preferreMeal;
};

// #==================================식단 싫어요 ==================================#

//식단 싫어요 추가
export const addDislikeMealService = async (data: BaseMealActionDTO) => {
  // 유효성 검사
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const meal = await getMealById(data.mealId);

  if (!meal) {
    throw new NotFoundError("존재하지 않는 식단입니다", data.mealId);
  }

  const mealUser = await getmealUserByIds(data);

  if (!mealUser) {
    throw new NotFoundError("유저에게 제공되지 않은 식단입니다", data);
  }

  if (mealUser.isHate === true) {
    throw new InvalidInputError("이미 싫어요를 누른 식단입니다", data);
  }

  //싫어요
  const dislikeMeal = addDislikeMeal(data);

  return dislikeMeal;
};

// 식단 싫어요 삭제
export const deleteDislikeMealService = async (data: BaseMealActionDTO) => {
  // 유효성 검사
  const user = await getUserById(data.userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저입니다", data.userId);
  }

  const meal = await getMealById(data.mealId);

  if (!meal) {
    throw new NotFoundError("존재하지 않는 식단입니다", data.mealId);
  }

  const mealUser = await getmealUserByIds(data);

  if (!mealUser) {
    throw new NotFoundError("유저에게 제공되지 않은 식단입니다", data);
  }

  if (mealUser.isHate === false) {
    throw new InvalidInputError("싫어요하지 않은 식단입니다", data);
  }

  // 싫어요 취소
  const dislikeMeal = deleteDislikeMeal(data);

  return dislikeMeal;
};
