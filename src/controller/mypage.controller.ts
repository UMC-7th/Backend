import { Request, Response, NextFunction } from "express";
import { getUserProfile } from "../service/mypage.service.js";
import { StatusCodes } from "http-status-codes";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "User not authenticated" });
    }
    const user = await getUserProfile(userId);

    if (user) {
      res.status(StatusCodes.OK).send({
        nickname : user.nickname,
        email: user.email,
        birth: user.birth,
        name: user.name,
        phoneNum: user.phoneNum,
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).send({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};
