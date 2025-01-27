import { addDeliveryAddressReq } from "../dto/deliveryAddress.dto.js";
import { addDeliveryAddress, getDeliveryAddress } from "../repository/deliveryAddress.repository.js";

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