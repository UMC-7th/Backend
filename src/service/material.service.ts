import { markMaterial } from "../repository/material.repository.js";

//식재료 북마크 추가
export const markMaterialService = async (userId: number, material: string) => {
    const mark = await markMaterial(userId, material);
    return mark;
}