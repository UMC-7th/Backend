import { addMaterial, deleteMarkMaterial, getAllMaterial, getMarkMaterial, getMarkMaterialList, getRankAllMaterial, getRankVarietyMaterial, getVariety, markMaterial, searchMaterial } from "../repository/material.repository.js";
import { InvalidInputError } from "../util/error.js";
import { materialData } from "../util/material.js";
import { addMaterialDto } from "../dto/material.dto.js";


//식재료 북마크 추가
export const markMaterialService = async (userId: number, materialId: number) => {
    const confirm = await getMarkMaterial(userId, materialId);
    if (confirm) {
        throw new InvalidInputError("이미 북마크된 식재료입니다.", `userId: ${userId}, material: ${materialId}`);
    }

    const mark = await markMaterial(userId, materialId);
    return mark;
}

//식재료 북마크 조회(리스트)
export const getMarkMaterialListService = async (userId: number) => {
    const markList = await getMarkMaterialList(userId);
    return markList;
}

//식재료 북마크 삭제
export const deleteMarkMaterialService = async (userId: number, materialId: number) => {
    const confirm = await getMarkMaterial(userId, materialId);
    if (!confirm) {
        throw new InvalidInputError("북마크된 식재료에 존재하지 않습니다.", `userId: ${userId}, material: ${materialId}`);
    }

    const mark = await deleteMarkMaterial(confirm.markId);
    return mark;
}

//식재료 전체 조회
export const getAllMaterialService = async () => {
    const materialList = await getAllMaterial();
    return materialList;
}

//식재료 품종 검색
export const searchMaterialService = async (name: string) => {
    const variety = await getVariety(name);
    if(variety==null)
        throw new InvalidInputError("해당 품종을 찾을 수 없습니다.", name);

    const materialList = await searchMaterial(variety.varietyId);

    return materialList;
}

//전체 식재료 랭킹 조회
export const getRankAllMaterialService = async () => {
    const materialList = await getRankAllMaterial();
    return materialList;
}

//품종별 식재료 랭킹 조회
export const getRankVarietyMaterialService = async (name: string) => {
    const variety = await getVariety(name);
    if(variety==null)
        throw new InvalidInputError("해당 품종을 찾을 수 없습니다.", name);

    const materialList = await getRankVarietyMaterial(variety.varietyId);

    return materialList;
}

//식재료 생성
export const addMaterialService = async () => {
    const data = materialData

    data.price.map((material)=>{
        let sign;
        if(parseFloat(material.direction) == 0){
            sign = -1;
        } else if(parseFloat(material.direction) == 1){
            sign = 1;
        } else{
            sign = 0;
        }

        const materialDto:addMaterialDto = {
            itemId: parseInt(material.productno),
            name: material.item_name,
            delta: parseFloat(material.value) * sign,
            deltaAbs: parseFloat(material.value),
            unit: material.unit,
            varietyId: parseInt(material.category_code),
            type: material.product_cls_name
        }

        addMaterial(materialDto);
    });
    return;
}