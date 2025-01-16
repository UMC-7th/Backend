import { NextFunction, Request, Response } from "express";
import { createFoodImageService } from "../service/image.service.js";
import { StatusCodes } from "http-status-codes";

// 음식 이미지 생성
export const createFoodImage = async(req: Request, res: Response, next: NextFunction) => {
    const data = req.query as { name: string };
    try {
        const imageUrl = await createFoodImageService(data.name);
        res.status(StatusCodes.OK).send({ imageUrl });
    } catch (error) {
        next(error);
    }
}