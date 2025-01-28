import { prisma } from "../db.config.js";
import {
    addDeliveryAddressReq,
    updateDeliveryAddressReq,
} from "../dto/deliveryAddress.dto.js";
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

//배송지 단일 조회
export const getDeliveryAddressOne = async (addressId: number, userId: number) => {
    try {
        const deliveryAddress = await prisma.deliveryAddress.findUnique({
            where: { 
                addressId: addressId,
                userId: userId
             },
        });

        return deliveryAddress;
    } catch (error) {
        throw new DBError("배송지 주소 조회 중 오류가 발생했습니다.", `addressId: ${addressId}, userId: ${userId}`);
    }
};

//배송지 리스트 조회
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

//배송지 수정
export const updateDeliveryAddress = async (data: updateDeliveryAddressReq) => {
    try {
        const deliveryAddress = await prisma.deliveryAddress.update({
            where: { addressId: data.addressId },
            data: {
                name: data.name,
                postNum: data.postNum,
                address: data.address,
                phoneNum: data.phoneNum,
                memo: data.memo,
            },
        });

        return deliveryAddress;
    } catch (error) {
        throw new DBError("배송지 주소 수정 중 오류가 발생했습니다.", data);
    }
};

//기본 배송지 설정
export const setDefaultDeliveryAddress = async (addressId: number, userId: number) => {
    try {
        await prisma.deliveryAddress.updateMany({
            where: { userId: userId },
            data: { isDefault: false },
        });

        const deliveryAddress = await prisma.deliveryAddress.update({
            where: { addressId: addressId },
            data: { isDefault: true },
        });

        return deliveryAddress;
    } catch (error) {
        throw new DBError("기본 배송지 설정 중 오류가 발생했습니다.", `addressId: ${addressId}, userId: ${userId}`);
    }
}

//기본 배송지 조회
export const getDefaultDeliveryAddress = async (userId: number) => {
    try {
        const deliveryAddress = await prisma.deliveryAddress.findFirst({
            where: { userId: userId, isDefault: true },
        });

        return deliveryAddress;
    } catch (error) {
        throw new DBError("기본 배송지 조회 중 오류가 발생했습니다.", userId);
    }
};