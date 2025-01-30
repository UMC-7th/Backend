import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getSubListCalendarService } from "../service/subscribe.service.js";
import { InvalidInputError } from "../util/error.js";

export const getSubListCalendar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    try {
        if (!userId) 
            throw new InvalidInputError("잘못된 토큰 값입니다.", "입력 값: " + req.headers.authorization);
        
        const subDateList = await getSubListCalendarService(userId);
        res.status(StatusCodes.OK).success({ subDateList: subDateList });
    } catch (error) {
        next(error);
    }
}