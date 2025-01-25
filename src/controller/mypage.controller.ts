import { Request, Response, NextFunction } from "express";
import { getUserProfile } from "../service/mypage.service.js";
import { StatusCodes } from "http-status-codes";

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const userId = req.session.userId;
    const user = await getUserProfile(userId);
    
    if (user) {
      res.status(StatusCodes.OK).send({
        email: user.email,
        birth: user.birth,
        name: user.name,
        phoneNum: user.phoneNum,
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).send({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

