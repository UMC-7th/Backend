import { NextFunction, Request, Response } from "express";
import {
    addImageFoodService,
    addImgS3Service,
    createFoodImageService,
    createMealImageService,
    getImageFoodService,
} from "../service/image.service.js";
import { StatusCodes } from "http-status-codes";

//식재료 이미지 생성
export const createFoodImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const data = req.query as { name: string };
    try {
        const imageFood = await getImageFoodService(data.name);
        let imageUrl: string;

        //이미지가 없는 경우 이미지 생성
        if (!imageFood) {
            imageUrl = await createFoodImageService(data.name);
            addImageFoodService(data.name, imageUrl);
        } else {
            imageUrl = imageFood.imageUrl;
        }

        res.status(StatusCodes.OK).success({ imageUrl });
    } catch (error) {
        next(error);
    }
};

//식재료 이미지 생성
export const createMealImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const data = req.query as { name: string };
    try {
        const imageFood = await getImageFoodService(data.name);
        let imageUrl: string;

        //이미지가 없는 경우 이미지 생성
        if (!imageFood) {
            const imageUrlAI = await createMealImageService(data.name);
            imageUrl = await addImgS3Service(imageUrlAI);
            addImageFoodService(data.name, imageUrl);
        } else {
            imageUrl = imageFood.imageUrl;
        }

        res.status(StatusCodes.OK).success({ imageUrl });
    } catch (error) {
        next(error);
    }
};
