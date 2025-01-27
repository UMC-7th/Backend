import { prisma } from "../db.config.js";
import { addDeliveryAddressReq } from "../dto/deliveryAddress.dto.js";
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
        throw new DBError("배송지 주소 추가 중 오류가 발생했습니다.", data);
    }
};

//배송지 조회
export const getDeliveryAddress = async (userId: number) => {
    try {
        const deliveryAddressList = await prisma.deliveryAddress.findMany({
            where: { userId: userId },
        });

        return deliveryAddressList;
    } catch (error) {
        throw new DBError("배송지 주소 조회 중 오류가 발생했습니다.", userId);
    }
};
