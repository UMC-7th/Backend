import {
  surveyRepository,
  updateRepository,
} from "../repository/survey.repository.js";
import { getUserById } from "../repository/user.repository.js";
import { NotFoundError } from "../util/error.js";

export const surveyService = async (surveyData: any) => {
  const user = await getUserById(surveyData.userId);
  if (!user) {
    throw new NotFoundError(
      "존재하지 않는 유저.",
      "입력 값: " + surveyData.userId
    );
  }

  const newSurvey = await surveyRepository(surveyData.userId, surveyData);
  if (!newSurvey) {
    throw new NotFoundError("존재하지 않는 유저", "입력 값: " + newSurvey);
  }

  return newSurvey;
};

export const updateService = async (userId: number, surveyData: any) => {
  try {
    const updatedSurvey = await updateRepository(userId, surveyData);

    return updatedSurvey;
  } catch (error) {
    throw new NotFoundError(
      "존재하지 않는 유저",
      "입력 값: " + surveyData.userId
    );
  }
};
