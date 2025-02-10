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
import { getRedisValue, setRedisValue } from "./payment.controller.js";
import { DBError } from "../util/error.js";

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
        if (!imageFood) {
            imageFood = await addImageFoodService(
                data.name,
                "default image url"
            );
        }
        //기본 이미지인 경우 이미지 생성
        if (imageFood.imageUrl == "default image url") {
            //mutex 조회 및 mutex 생성
            let mutex = await getRedisValue("process_createimg");
            if (mutex == null) {
                await setRedisValue("process_createimg", "0", 5);
                mutex = 0;
            }
            mutex = parseInt(mutex);

            //mutex 검사
            while (mutex === 4) {
                // 10초 대기 + Redis 값 갱신
                await new Promise((resolve) => setTimeout(resolve, 10000));
                mutex = await getRedisValue("process_createimg");
            }

            if (mutex < 0 || mutex > 4) {
                throw new DBError(
                    "가질 수 없는 mutex 값입니다.",
                    "mutex 값: " + mutex
                );
            }

            //이미지 생성 전 mutex 변경
            await setRedisValue("process_createimg", (++mutex).toString(), 5);

            //이미지 생성
            await new Promise((resolve) => setTimeout(resolve, 1500));  //딜레이 부여해 충돌 방지
            const imageUrlAI = await createMealImageService(data.name);
            imageUrl = await addImgS3Service(imageUrlAI);

            updateImageFoodService(imageFood.imageId, imageUrl);

            //이미지 생성 완료 후 mutex 설정
            mutex = await getRedisValue("process_createimg");
            await setRedisValue("process_createimg", (--mutex).toString(), 5);
        } else {
            imageUrl = imageFood.imageUrl;
        }

        res.status(StatusCodes.OK).success({ imageUrl });
    } catch (error) {
        next(error);
    }
};
