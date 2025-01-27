import { addDeliveryAddressReq } from "../dto/subscribe.dto.js";
import { addDeliveryAddress } from "../repository/subscribe.repository.js";

//배송지 추가
export const addDeliveryAddressService = async (
    userId: number,
    data: addDeliveryAddressReq
) => {
    const deliveryAddress = await addDeliveryAddress(userId, data);
    return deliveryAddress;
};
