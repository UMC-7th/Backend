import { Request, Response, NextFunction } from "express";
import { getUserProfile, delUserProfile } from "../service/mypage.service.js";
import { StatusCodes } from "http-status-codes";

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

    if(deleteuser) {
      return res.status(StatusCodes.OK).success({deleteuser})
    }
  } catch (error) {
    next(error);
  }
};
