import { NextFunction, Request, Response } from "express";
import { addCartService, deleteCartService, getSubListCalendarService } from "../service/subscribe.service.js";
import { addCartDTO, deleteCartDTO } from "../dto/subscribe.dto.js";
import { StatusCodes } from "http-status-codes";
import { InvalidInputError } from "../util/error.js";


// 식단 장바구니 추가
export const addCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new InvalidInputError("잘못된 토큰 값입니다.", "입력 값: " + req.headers.authorization);
        }

        const kartSub = await addCartService(userId, req.body);
        res.status(StatusCodes.OK).success({ kartSub });
    } catch (error) {
        next(error);
    }
}

// 식단 장바구니 제거
export const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const cartId = parseInt(req.params.cart_id);
        if (!userId) {
            throw new InvalidInputError("잘못된 토큰 값입니다.", "입력 값: " + req.headers.authorization);
        }

        const kartSub = await deleteCartService(userId, cartId);
        res.status(StatusCodes.OK).success({ kartSub });
    } catch (error) {
        next(error);
    }
}

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