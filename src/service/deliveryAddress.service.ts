import { addDeliveryAddressReq, updateDeliveryAddressReq } from "../dto/deliveryAddress.dto.js";
import { addDeliveryAddress, getDefaultDeliveryAddress, getDeliveryAddress, getDeliveryAddressOne, setDefaultDeliveryAddress, updateDeliveryAddress } from "../repository/deliveryAddress.repository.js";
import { InvalidInputError } from "../util/error.js";

//배송지 DB에 저장
export const addDeliveryAddressService = async (
    userId: number,
    data: addDeliveryAddressReq
) => {
    const deliveryAddress = await addDeliveryAddress(userId, data);
    return deliveryAddress;
};

//배송지 DB에서 조회
export const getDeliveryAddressService = async (userId: number) => {
    const deliveryAddressList = await getDeliveryAddress(userId);
    return deliveryAddressList;
};

//배송지 수정
export const updateDeliveryAddressService = async (
    userId: number,
    data: updateDeliveryAddressReq
) => {
    const confirm = await getDeliveryAddressOne(data.addressId ,userId);
    if (!confirm) {
        throw new InvalidInputError("배송지 주소가 존재하지 않습니다.", `addressId: ${data.addressId}, userId: ${userId}`);
    }
    const deliveryAddress = await updateDeliveryAddress(data);
    return deliveryAddress;
};

//기본 배송지 설정
export const setDefaultDeliveryAddressService = async (
    userId: number,
    addressId: number
) => {
    const confirm = await getDeliveryAddressOne(addressId ,userId);
    if (!confirm) {
        throw new InvalidInputError("배송지 주소가 존재하지 않습니다.", `addressId: ${addressId}, userId: ${userId}`);
    }
    const deliveryAddress = await setDefaultDeliveryAddress(addressId, userId);
    return deliveryAddress;
};

//기본 배송지 조회
export const getDefaultDeliveryAddressService = async (userId: number) => {
    const deliveryAddress = await getDefaultDeliveryAddress(userId);
    return deliveryAddress;
};