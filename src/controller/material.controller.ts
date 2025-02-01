import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { InvalidInputError } from "../util/error.js";
import { getMarkMaterialListService, markMaterialService } from "../service/material.service.js";

//식재료 북마크 추가
export const markMaterial = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    try {
        if (!userId) 
            throw new InvalidInputError("잘못된 토큰 값입니다.", "입력 값: " + req.headers.authorization);
        const markMaterial = await markMaterialService(userId, req.body.material);
        res.status(StatusCodes.OK).success({
            isSuccess: true,
            markMaterial: markMaterial
        });
    } catch (error) {
        next(error);
    }
};

//식재료 북마크 조회(리스트)
export const getMarkMaterialList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    try {
        if (!userId) 
            throw new InvalidInputError("잘못된 토큰 값입니다.", "입력 값: " + req.headers.authorization);
        const markList = await getMarkMaterialListService(userId);
        res.status(StatusCodes.OK).success({
            markList: markList
        });
    } catch (error) {
        next(error);
    }
};