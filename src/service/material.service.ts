import { getMarkMaterial, markMaterial } from "../repository/material.repository.js";
import { InvalidInputError } from "../util/error.js";

//식재료 북마크 추가
export const markMaterialService = async (userId: number, material: string) => {
    const confirm = await getMarkMaterial(userId, material);
    if (confirm) {
        throw new InvalidInputError("이미 북마크된 식재료입니다.", `userId: ${userId}, material: ${material}`);
    }
    
    const mark = await markMaterial(userId, material);
    return mark;
}