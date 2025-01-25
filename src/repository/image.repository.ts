import { prisma } from "../db.config.js";
import { saveFoodImageDto } from "../dto/image.dto.js";
import { DBError } from "../util/error.js";

export const addImageFood = async (data: saveFoodImageDto) => {
    try {
        const imageFood = await prisma.imageFood.create({ data: data });
        return imageFood;
    } catch (error) {
        throw new DBError("음식 이미지 추가 중 오류가 발생했습니다.", data);
    }
};

export const getImageFood = async (name: string) => {
    try {
        const imageFood = await prisma.imageFood.findFirst({
            where: { name: name },
        });

        if (imageFood === null) return null;

        // 검색 시간 업데이트
        await prisma.imageFood.update({
            where: { imageId: imageFood.imageId },
            data: { searchAt: new Date() },
        });

        return imageFood;
    } catch (error) {
        throw new DBError("음식 이미지 조회 중 오류가 발생했습니다.", name);
    }
};
