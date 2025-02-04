import { Request, Response, NextFunction } from "express";
import {
  getUserProfile,
  delUserProfile,
  upUserProfile,
  getGoalProfile,
} from "../service/mypage.service.js";
import { StatusCodes } from "http-status-codes";
import { updateUserDTO } from "../dto/mypage.dto.js";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const user = await getUserProfile(userId);

    if (user) {
      res.status(StatusCodes.OK).success({
        nickname: user.nickname,
        email: user.email,
        birth: user.birth,
        name: user.name,
        phoneNum: user.phoneNum,
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
    const loginMethod = req.user?.loginMethod;

    const isSocialLogin = loginMethod !== "email";

    const updateData = updateUserDTO(req.body, isSocialLogin);

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
    const goal = await getGoalProfile(userId);

    res.status(StatusCodes.OK).success({ goal });
  } catch (error) {
    next(error);
  }
};
