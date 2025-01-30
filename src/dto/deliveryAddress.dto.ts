//배송지 추가 요청 DTO
export interface addDeliveryAddressReq {
  name: string;
  postNum: number;
  address: string;
  phoneNum: string;
  memo: string;
}

//배송지 수정 요청 DTO
export interface updateDeliveryAddressReq {
  addressId: number;
  name: string;
  postNum: number;
  address: string;
  phoneNum: string;
  memo: string;
}
