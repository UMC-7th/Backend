import { Request, Response, NextFunction } from "express";
import { surveyService } from "../service/survey.service.js";
import { StatusCodes } from "http-status-codes";

export const createSurvey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const surveyData = req.body;

    if (!userId || !surveyData) {
      return res.status(StatusCodes.BAD_REQUEST);
    }
    const newSurvey = await surveyService({ ...surveyData, userId });

    return res.status(StatusCodes.OK).success({ newSurvey });
  } catch (error) {
    next(error);
  }
};
