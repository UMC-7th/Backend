import { prisma } from "../db.config.js";
import { DBError } from "../util/error.js";

//식재료 북마크 단일 조회
export const getMarkMaterial = async (userId: number, material: string) => {
    try {
        const mark = await prisma.markMaterial.findFirst({
            where: {
                userId: userId,
                material: material
            }
        });
        return mark;
    } catch (error) {
        throw new DBError("식재료 북마크 조회 중 오류가 발생했습니다.", error);
    }
};

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

//식재료 북마크 조회(리스트)
export const getMarkMaterialList = async (userId: number) => {
    try {
        const markList = await prisma.markMaterial.findMany({
            where: {
                userId: userId
            }
        });
        return markList;
    } catch (error) {
        throw new DBError("식재료 북마크 조회 중 오류가 발생했습니다.", error);
    }
};

//식재료 북마크 삭제
export const deleteMarkMaterial = async (markId: number) => {
    try {
        const deleteMark = await prisma.markMaterial.delete({
            where: {
                markId: markId
            }
        });
        return deleteMark;
    } catch (error) {
        throw new DBError("식재료 북마크 삭제 중 오류가 발생했습니다.", error);
    }
};