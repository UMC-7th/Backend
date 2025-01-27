//배송지 추가 요청 DTO
export interface addDeliveryAddressReq {
    name: string;
    postNum: number;
    address: string;
    phoneNum: string;
    memo: string;
}