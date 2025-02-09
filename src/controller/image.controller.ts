import { NextFunction, Request, Response } from "express";
import {
    addImageFoodService,
    addImgS3Service,
    createFoodImageService,
    createMealImageService,
    getImageFoodService,
    updateImageFoodService,
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

//식단 이미지 생성
export const createMealImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const data = req.query as { name: string };
    try {
        let imageFood = await getImageFoodService(data.name);
        let imageUrl: string;

        //이미지가 없는 경우 이미지 테이블 생성
        if(!imageFood) {
            imageFood = await addImageFoodService(data.name, "default image url");
        }
        //기본 이미지인 경우 이미지 생성
        if (imageFood.imageUrl == "default image url") {
            const imageUrlAI = await createMealImageService(data.name);
            imageUrl = await addImgS3Service(imageUrlAI);

            updateImageFoodService(imageFood.imageId, imageUrl);
        } else {
            imageUrl = imageFood.imageUrl;
        }

        res.status(StatusCodes.OK).success({ imageUrl });
    } catch (error) {
        next(error);
    }
};
