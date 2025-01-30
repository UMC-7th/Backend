import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getSubListCalendarService, getSubListService } from "../service/subscribe.service.js";
import { InvalidInputError } from "../util/error.js";

//구독 내역 캘린더형 조회
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

//구독 내역 리스트형 조회
export const getSubList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    try {
        if (!userId) 
            throw new InvalidInputError("잘못된 토큰 값입니다.", "입력 값: " + req.headers.authorization);
        
        const subList = await getSubListService(userId);
        res.status(StatusCodes.OK).success({ subList: subList });
    } catch (error) {
        next(error);
    }
}