import { prisma } from "../db.config.js";
import { DBError } from "../util/error.js";

//식재료 북마크 추가
export const markMaterial = async (userId: number, material: string) => {
    try {
        const mark = await prisma.markMaterial.create({
            data: {
                userId: userId,
                material: material
            },
        });
        return mark;
    } catch (error) {
        throw new DBError("식재료 북마크 추가 중 오류가 발생했습니다.", error);
    }
};