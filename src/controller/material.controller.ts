import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { InvalidInputError } from "../util/error.js";
import { deleteMarkMaterialService, getAllMaterialService, getMarkMaterialListService, getRankAllMaterialService, getRankVarietyMaterialService, markMaterialService, searchMaterialService } from "../service/material.service.js";

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
        const markMaterial = await markMaterialService(userId, req.body.materialId);
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

//식재료 북마크 삭제
export const deleteMarkMaterial = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    try {
        if (!userId) 
            throw new InvalidInputError("잘못된 토큰 값입니다.", "입력 값: " + req.headers.authorization);
        const markMaterial = await deleteMarkMaterialService(userId, req.body.materialId);
        res.status(StatusCodes.OK).success({
            isSuccess: true,
            markMaterial: markMaterial
        });
    } catch (error) {
        next(error);
    }
};

//식재료 전체 조회
export const getAllMaterial = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const materialList = await getAllMaterialService();
        res.status(StatusCodes.OK).success({
            isSuccess: true,
            data: materialList
        });
    } catch (error) {
        next(error);
    }
};

//식재료 품종 검색
export const searchMaterial = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const data = req.query as { name: string };
    try {
        const materialList = await searchMaterialService(data.name);
        res.status(StatusCodes.OK).success({
            isSuccess: true,
            data: materialList
        });
    } catch (error) {
        next(error);
    }
};

//전체 식재료 랭킹 조회
export const getRankAllMaterial = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const materialList = await getRankAllMaterialService();
        res.status(StatusCodes.OK).success({
            isSuccess: true,
            data: materialList
        });
    } catch (error) {
        next(error);
    }
};

//품종별 식재료 랭킹 검색
export const getRankVarietyMaterial = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const data = req.query as { name: string };
    try {
        const materialList = await getRankVarietyMaterialService(data.name);
        res.status(StatusCodes.OK).success({
            isSuccess: true,
            data: materialList
        });
    } catch (error) {
        next(error);
    }
};
