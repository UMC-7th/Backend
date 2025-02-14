import { Request, Response, NextFunction } from "express";
import {
  getUserProfile,
  delUserProfile,
  upUserProfile,
  getGoalProfile,
  getHealthScoreProfile,
  getResultProfile,
  upImageProfile,
} from "../service/mypage.service.js";
import { StatusCodes } from "http-status-codes";
import { updateUserDTO } from "../dto/mypage.dto.js";
import { InvalidInputError } from "../util/error.js";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    const user = await getUserProfile(userId);

    if (user) {
      res.status(StatusCodes.OK).success({
        nickname: user.nickname,
        email: user.email,
        birth: user.birth,
        name: user.name,
        phoneNum: user.phoneNum,
        profileImage: user.profileImage,
      });
    } else {
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    const deleteuser = await delUserProfile(userId);

    if (deleteuser) {
      return res.status(StatusCodes.OK).success({ deleteuser });
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    const updateData = updateUserDTO(req.body);

    const updatedUser = await upUserProfile(userId, updateData);

    if (updatedUser) {
      return res.status(StatusCodes.OK).json({ updatedUser });
    }
  } catch (error) {
    next(error);
  }
};

export const getGoal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    const goal = await getGoalProfile(userId);

    res.status(StatusCodes.OK).success({ goal });
  } catch (error) {
    next(error);
  }
};

export const getHealthScore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    const healthscore = await getHealthScoreProfile(userId);

    res.status(StatusCodes.OK).success({ healthscore });
  } catch (error) {
    next(error);
  }
};

export const getResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    const result = await getResultProfile(userId);

    res.status(StatusCodes.OK).success({ result });
  } catch (error) {
    next(error);
  }
};

export const updateImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new InvalidInputError(
        "잘못된 토큰 값입니다.",
        "입력 값: " + req.headers.authorization
      );
    }
    const file = req.file;

    const updateImage = await upImageProfile(userId, file);

    res.status(StatusCodes.OK).success({ updateImage });
  } catch (error) {
    next(error);
  }
};
