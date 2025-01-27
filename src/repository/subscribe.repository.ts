import { prisma } from "../db.config.js";
import { addDeliveryAddressReq } from "../dto/subscribe.dto.js";
import { DBError } from "../util/error.js";

//배송지 추가
export const addDeliveryAddress = async (
    userId: number,
    data: addDeliveryAddressReq
) => {
    try {
        const deliveryAddress = await prisma.deliveryAddress.create({
            data: {
                userId: userId,
                name: data.name,
                postNum: data.postNum,
                address: data.address,
                phoneNum: data.phoneNum,
                memo: data.memo,
                isDefault: false,  
            },
        });

        return deliveryAddress;
    } catch (error) {
        throw new DBError("음식 이미지 조회 중 오류가 발생했습니다.", data);
    }
};
