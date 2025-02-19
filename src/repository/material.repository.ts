import { prisma } from "../db.config.js";
import { DBError } from "../util/error.js";

//식재료 북마크 단일 조회
export const getMarkMaterial = async (userId: number, materialId: number) => {
    try {
        const mark = await prisma.markMaterial.findFirst({
            where: {
                userId: userId,
                materialId: materialId
            }
        });
        return mark;
    } catch (error) {
        throw new DBError("식재료 북마크 조회 중 오류가 발생했습니다.", error);
    }
};

//식재료 북마크 추가
export const markMaterial = async (userId: number, materialId: number) => {
    try {
        const mark = await prisma.markMaterial.create({
            data: {
                userId: userId,
                materialId: materialId
            },
        });
        return mark;
    } catch (error) {
        console.log(error);
        throw new DBError("식재료 북마크 추가 중 오류가 발생했습니다.", error);
    }
};

//식재료 북마크 조회(리스트)
export const getMarkMaterialList = async (userId: number) => {
    try {
        const markList = await prisma.markMaterial.findMany({
            where: {
                userId: userId
            },
            select: {
                markId: true,
                material: true
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

//식재료 전체 조회
export const getAllMaterial = async () => {
    try {
        const materialList = await prisma.material.findMany({
            
        });
        return materialList;
    } catch (error) {
        throw new DBError("식재료 전체 조회 중 오류가 발생했습니다.", error);
    }
};
//식재료 랭킹 조회
export const getRankAllMaterial = async () => {
    try {
        const materialList = await prisma.material.findMany({
            orderBy: {
                delta: "desc"
            },
            take: 10
        });
        return materialList;
    } catch (error) {
        throw new DBError("식재료 랭킹 조회 중 오류가 발생했습니다.", error);
    }
};

//품종 조회
export const getVariety = async (name: string) => {
    try {
        const variety = await prisma.variety.findFirst({
            where:{
                name: name
            }
        });
        return variety;
    } catch (error) {
        throw new DBError("품종 검색 중 오류가 발생했습니다.", error);
    }
};

//식재료 품종 검색
export const searchMaterial = async (varietyId: number) => {
    try {
        const materialList = await prisma.material.findMany({
            where:{
                varietyId: varietyId
            }
        });
        return materialList;
    } catch (error) {
        throw new DBError("식재료 검색 중 오류가 발생했습니다.", error);
    }
};

//식재료 품종 검색
export const getRankVarietyMaterial = async (varietyId: number) => {
    try {
        const materialList = await prisma.material.findMany({
            where:{
                varietyId: varietyId
            },
            orderBy: {
                delta: "desc"
            },
            take: 10
        });
        return materialList;
    } catch (error) {
        throw new DBError("식재료 랭킹 조회 중 오류가 발생했습니다.", error);
    }
};