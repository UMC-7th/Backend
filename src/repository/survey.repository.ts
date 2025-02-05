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
        healthConditionDetails: surveyData.healthConditionDetails || null,
        gender: surveyData.gender,
        birthYear: surveyData.birthYear,
        height: surveyData.height,
        currentWeight: surveyData.currentWeight,
        targetWeight: surveyData.targetWeight,
        skeletalMuscleMass: surveyData.skeletalMuscleMass,
        bodyFatPercentage: surveyData.bodyFatPercentage,
        exerciseFrequency: surveyData.exerciseFrequency,
        job: surveyData.job,
      },
    });
    return createSurvey;
  } catch (error) {
    throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
  }
};

export const updateRepository = async (userId: number, surveyData: any) => {
  try {
    const updateSurvey = await prisma.survey.updateMany({
      where: { userId: userId },
      data: {
        goal: surveyData.goal,
        meals: surveyData.meals.join(","),
        allergy: surveyData.allergy,
        allergyDetails: surveyData.allergyDetails || null,
        healthCondition: surveyData.healthCondition,
        healthConditionDetails: surveyData.healthConditionDetails || null,
        gender: surveyData.gender,
        birthYear: surveyData.birthYear,
        height: surveyData.height,
        currentWeight: surveyData.currentWeight,
        targetWeight: surveyData.targetWeight,
        skeletalMuscleMass: surveyData.skeletalMuscleMass,
        bodyFatPercentage: surveyData.bodyFatPercentage,
        exerciseFrequency: surveyData.exerciseFrequency,
        job: surveyData.job,
      },
    });

    return updateSurvey;
  } catch (error) {
    throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
  }
};
