import { createSurvey } from "../controller/survey.controller.js";
import { prisma } from "../db.config.js"; 
import { DBError } from "../util/error.js";

export const surveyRepository = async (userId: number, surveyData: any) => {
  try {
    const createSurvey = await prisma.survey.create({
      data: {
        userId: userId,
        goal: surveyData.goal,
        meals: surveyData.meals.join(","),
        allergy: surveyData.allergy,
        allergyDetails: surveyData.allergyDetails || null,
        healthCondition: surveyData.healthCondition,
        gender: surveyData.gender,
        birthYear: surveyData.birthYear,
        height: surveyData.height,
        currentWeight: surveyData.currentWeight,
        targetWeight: surveyData.targetWeight,
        exerciseFrequency: surveyData.exerciseFrequency,
        job: surveyData.job,
      },
    });
    return createSurvey;
  } catch (error) {
    throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
  }
};
