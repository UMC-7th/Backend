import { NextFunction, Request, Response } from "express";
import { createFoodImageService, createMealImageService } from "../service/image.service.js";
import { StatusCodes } from "http-status-codes";

//식재료 이미지 생성
export const createFoodImage = async(req: Request, res: Response, next: NextFunction) => {
    const data = req.query as { name: string };
    try {
        const imageUrl = await createFoodImageService(data.name);
        res.status(StatusCodes.OK).success({ imageUrl });
    } catch (error) {
        next(error);
    }
}

//식재료 이미지 생성
export const createMealImage = async(req: Request, res: Response, next: NextFunction) => {
    const data = req.query as { name: string };
    try {
        const imageUrl = await createMealImageService(data.name);
        res.status(StatusCodes.OK).success({ imageUrl });
    } catch (error) {
        next(error);
    }
}