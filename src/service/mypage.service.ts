import {
  findUserProfile,
  deleteUserProfile,
  updateUserProfile,
  findGoalProfile,
  findhealthscoreProfile,
  findResultProfile,
  saveHealthScore,
  updateImageProfile,
} from "../repository/mypage.repository.js";
import { getUserById } from "../repository/user.repository.js";
import { APIError, DBError, NotFoundError } from "../util/error.js";
import axios from "axios";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";

export const getUserProfile = async (userId: number) => {
  const user = await findUserProfile(userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저", "입력 값: " + user);
  }

  return user;
};

export const delUserProfile = async (userId: number) => {
  const deleteuser = await deleteUserProfile(userId);

  if (!deleteuser) {
    throw new NotFoundError("존재하지 않는 유저", +deleteuser);
  }
  return deleteuser;
};

export const upUserProfile = async (userId: number, updateData: any) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저", userId);
  }

  let updatedUser;

  if (user.loginMethod === "email") {
    updatedUser = await updateUserProfile(userId, {
      email: updateData.email,
      password: updateData.password,
      nickname: updateData.nickname,
      birth: new Date(updateData.birth),
      name: updateData.name,
      phoneNum: updateData.phoneNum,
      purpose: updateData.purpose,
    });
  } else if (user.loginMethod === "kakao" || user.loginMethod === "naver") {
    updatedUser = await updateUserProfile(userId, {
      name: updateData.name,
      birth: new Date(updateData.birth),
      phoneNum: updateData.phoneNum,
    });
  } else {
    throw new NotFoundError("존재하지 않는 유저.", user.loginMethod);
  }

  return updatedUser;
};

export const getGoalProfile = async (userId: number) => {
  const goal = await findGoalProfile(userId);

  if (!goal) {
    throw new NotFoundError("존재하지 않는 유저", "입력 값: " + goal);
  }

  return goal;
};

export const getHealthScoreProfile = async (userId: number) => {
  const apiKey = process.env.OPENAI_API_KEY;

  await saveHealthScore(userId, -1);
  console.log("기본값 저장됨");

  const surveyData = await findhealthscoreProfile(userId);
  if (!surveyData) {
    throw new NotFoundError("존재하지 않는 데이터", "입력 값:" + surveyData);
  }

  const prompt = `유저의 건강 점수 평가
  - 목표: ${surveyData.goal}
  - 식사: ${surveyData.meals}
  - 알레르기 유무: ${surveyData.allergy}
  - 알레르기:  ${surveyData.allergyDetails}
  - 건강 상태 유무: ${surveyData.healthCondition}
  - 건강 상태: ${surveyData.healthConditionDetails}
  - 성별: ${surveyData.gender}
  - 출생년도: ${surveyData.birthYear}
  - 키: ${surveyData.height}cm
  - 현재 체중: ${surveyData.currentWeight}kg
  - 목표 체중: ${surveyData.targetWeight}kg
  - 골격근량: ${surveyData.skeletalMuscleMass}kg
  - 체지방률: ${surveyData.bodyFatPercentage}%
  - 운동 빈도: 주 ${surveyData.exerciseFrequency}회
  - 직업: ${surveyData.job}`;

  const messages = [
    {
      role: "system",
      content: `Please analyze the user's health information and return a JSON response in the following format:
{
  "healthScore": "점수 (0~100 사이의 숫자)",
}

The healthScore should be based on:
- Overall balance of diet, exercise, and health conditions.
- Consider the user's goals, physical metrics, and exercise frequency.

Example output:
{
  "healthScore": 90,
}`,
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
        model: "gpt-3.5-turbo",
        temperature: 0.7,
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
    throw new Error("GPT 요청 중 에러 발생");
  }

  try {
    const gptResult = JSON.parse(result.data.choices[0].message.content);
    const healthScore = gptResult.healthScore;

    const savedHealthScore = await saveHealthScore(userId, healthScore);
    console.log("업데이트 완료");
    return savedHealthScore;
  } catch (error) {
    console.error("Error parsing GPT response:", error);
    throw new Error("GPT 응답 중 에러 발생");
  }
};

export const getResultProfile = async (userId: number) => {
  const apiKey = process.env.OPENAI_API_KEY;

  const surveyData = await findResultProfile(userId);
  if (!surveyData) {
    throw new NotFoundError("존재하지 않는 데이터", "입력 값:" + surveyData);
  }

  const prompt = `유저의 건강 진단 정보
  - 목표: ${surveyData.goal}
  - 식사: ${surveyData.meals}
  - 알레르기 유무: ${surveyData.allergy}
  - 알레르기:  ${surveyData.allergyDetails}
  - 건강 상태 유무: ${surveyData.healthCondition}
  - 건강 상태: ${surveyData.healthConditionDetails}
  - 성별: ${surveyData.gender}
  - 출생년도: ${surveyData.birthYear}
  - 키: ${surveyData.height}cm
  - 현재 체중: ${surveyData.currentWeight}kg
  - 목표 체중: ${surveyData.targetWeight}kg
  - 골격근량: ${surveyData.skeletalMuscleMass}kg
  - 체지방률: ${surveyData.bodyFatPercentage}%
  - 운동 빈도: 주 ${surveyData.exerciseFrequency}회
  - 직업: ${surveyData.job}`;

  const messages = [
    {
      role: "system",
      content: `Please analyze the user's health information and return a JSON response in the following format:
{
  "diagnosis"는 최대 15자 이하로, 3개로 받고, 사용자의 건강 상태를 요약한 문장으로 작성. 
  "advice"는 최대 15자 이하로, 3개로 받고, 건강 개선을 위한 조언을 간단히 작성. 
  "diagnosis" 와 "advice" 갯수 똑같이 맞춤 작성.
}

The healthScore should be based on:
- Overall balance of diet, exercise, and health conditions.
- Consider the user's goals, physical metrics, and exercise frequency.

Example output:
{
  "diagnosis" : 단백질 섭취량 많음 ,  
  "advice": 운동량을 늘려주세요! 
}`,
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
        model: "gpt-3.5-turbo",
        temperature: 0.7,
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
    throw new Error("GPT 요청 중 에러 발생");
  }

  try {
    const gptResult = JSON.parse(result.data.choices[0].message.content);

    return {
      diagnosis: gptResult.diagnosis,
      advice: gptResult.advice,
    };
  } catch (error) {
    throw new Error("GPT 응답 중 에러 발생");
  }
};

export const updateImageS3 = async (
  file: Express.Multer.File
): Promise<string> => {
  try {
    const s3 = new S3Client({
      region: "ap-northeast-2",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || "",
        secretAccessKey: process.env.S3_SECRET_KEY || "",
      },
    });

    const fileKey = `profileimage/${uuidv4()}_${Date.now()}.jpeg`;

    await s3.send(
      new PutObjectCommand({
        Bucket: "umc7theatthis",
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const fileUrl = `https://umc7theatthis.s3.ap-northeast-2.amazonaws.com/${fileKey}`;
    return fileUrl;
  } catch (error: any) {
    throw new APIError("파일 에러", `입력값: ${JSON.stringify(file)}`);
  }
};

export const upImageProfile = async (
  userId: number,
  file: Express.Multer.File
) => {
  const s3ImageUrl = await updateImageS3(file);

  const updateImage = await updateImageProfile(userId, s3ImageUrl);

  if (!updateImage) {
    throw new NotFoundError("존재하지 않는 유저", "입력 값: " + updateImage);
  }

  return updateImage;
};
