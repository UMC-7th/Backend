import { addDeliveryAddressReq } from "../dto/deliveryAddress.dto.js";
import { addDeliveryAddress } from "../repository/deliveryAddress.repository.js";

//배송지 DB에 저장
export const addDeliveryAddressService = async (
    userId: number,
    data: addDeliveryAddressReq
) => {
    const deliveryAddress = await addDeliveryAddress(userId, data);
    return deliveryAddress;
};
