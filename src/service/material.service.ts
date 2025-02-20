import axios from "axios";
import {
    addMaterial,
    deleteAllMaterial,
    deleteMarkMaterial,
    getAllMaterial,
    getMarkMaterial,
    getMarkMaterialList,
    getRankAllMaterial,
    getRankVarietyMaterial,
    getVariety,
    markMaterial,
    searchMaterial,
} from "../repository/material.repository.js";
import { APIError, InvalidInputError } from "../util/error.js";
import { addMaterialDto } from "../dto/material.dto.js";

//식재료 북마크 추가
export const markMaterialService = async (
    userId: number,
    materialId: number
) => {
    const confirm = await getMarkMaterial(userId, materialId);
    if (confirm) {
        throw new InvalidInputError(
            "이미 북마크된 식재료입니다.",
            `userId: ${userId}, material: ${materialId}`
        );
    }

    const mark = await markMaterial(userId, materialId);
    return mark;
};

//식재료 북마크 조회(리스트)
export const getMarkMaterialListService = async (userId: number) => {
    const markList = await getMarkMaterialList(userId);
    return markList;
};

//식재료 북마크 삭제
export const deleteMarkMaterialService = async (
    userId: number,
    materialId: number
) => {
    const confirm = await getMarkMaterial(userId, materialId);
    if (!confirm) {
        throw new InvalidInputError(
            "북마크된 식재료에 존재하지 않습니다.",
            `userId: ${userId}, material: ${materialId}`
        );
    }

    const mark = await deleteMarkMaterial(confirm.markId);
    return mark;
};

//식재료 전체 조회
export const getAllMaterialService = async () => {
    const materialList = await getAllMaterial();
    return materialList;
};

//식재료 품종 검색
export const searchMaterialService = async (name: string) => {
    const variety = await getVariety(name);
    if (variety == null)
        throw new InvalidInputError("해당 품종을 찾을 수 없습니다.", name);

    const materialList = await searchMaterial(variety.varietyId);

    return materialList;
};

//전체 식재료 랭킹 조회
export const getRankAllMaterialService = async () => {
    const materialList = await getRankAllMaterial();
    return materialList;
};

//품종별 식재료 랭킹 조회
export const getRankVarietyMaterialService = async (name: string) => {
    const variety = await getVariety(name);
    if (variety == null)
        throw new InvalidInputError("해당 품종을 찾을 수 없습니다.", name);

    const materialList = await getRankVarietyMaterial(variety.varietyId);

    return materialList;
};

//식재료 데이터 갱신
export const getMaterialDataService = async () => {
    try {
        console.log("식재료 정보 갱신을 시작합니다.");

        const result = await axios.get(
            "http://www.kamis.co.kr/service/price/xml.do",
            {
                params: {
                    action: "dailySalesList",
                    p_cert_key: process.env.KAMIS_API_KEY,
                    p_cert_id: process.env.KAMIS_API_ID,
                    p_returntype: "json",
                },
            }
        );

        await deleteAllMaterial();
        await result.data.price.map((material: any) => {
            let sign;

            if(Array.isArray(material.direction)){
                material.direction = "2"
            }
            if(Array.isArray(material.value)){
                material.value = "0"
            }

            if (material.direction == "0") {
                sign = -1;
            } else if (material.direction == "1") {
                sign = 1;
            } else {
                sign = 0;
            }
    
            const materialDto: addMaterialDto = {
                itemId: parseInt(material.productno),
                name: material.item_name,
                delta: parseFloat(material.value) * sign,
                deltaAbs: parseFloat(material.value),
                unit: material.unit,
                varietyId: parseInt(material.category_code),
                type: material.product_cls_name,
            };
    
            addMaterial(materialDto);
        });
        
        console.log(result.data.condition[0][0] + " 기준(KAMIS) DB가 갱신되었습니다.");
        return;
    } catch (error) {
        throw new APIError("KAMIS 호출 중 오류가 발생했습니다.", error);
    }
};
