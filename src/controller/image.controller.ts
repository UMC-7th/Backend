import { Request, Response } from "express";
import { createFoodImageService } from "../service/image.service.js";

// 음식 이미지 생성
export const createFoodImage = async(req: Request, res: Response) => {
    try {
        const imageUrl = await createFoodImageService(req.params.name);
        res.status(200).send({ imageUrl });
    } catch (error) {
        res.status(500).send("서버 내부 오류");
    }
}