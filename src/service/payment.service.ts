import { APIError, InvalidInputError, NotFoundError, AlreadyExistError } from "../util/error.js";
import { addSub } from "../repository/subscribe.repository.js";
import axios from "axios";

// 카카오 결제 준비
export const kakaoPaymentService = async (data: any) => {
    try {
        const { cid, partner_order_id, partner_user_id, item_name, quantity, total_amount } = data;

        const response = await axios.post(
            "https://kapi.kakao.com/v1/payment/ready",
            {
              cid: cid,
              partner_order_id: partner_order_id,
              partner_user_id: partner_user_id,
              item_name: item_name,
              total_amount: total_amount,
              quantity: quantity,
              tax_free_amount: 0,
              approval_url: `http://localhost:3000/api/v1/payment/kakao/success?cid=${cid}&oid=${partner_order_id}&uid=${partner_user_id}`,
              cancel_url: 'http://localhost:3000/api/v1/payment/kakao/cancel',
              fail_url: 'http://localhost:3000/api/v1/payment/kakao/fail',
            },
            {
              headers: {
                Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
              },
            }
        );

        return response.data;

    } catch (error: any) {
        throw new Error("카카오 페이 결제 요청 중 에러 발생" + error);
    }
}

// 카카오 결제 승인
export const kakaoPaymentSuccessService = async (data: any) => {
    try {
        const { cid, orderId, userId, pgToken, tid} = data;
        const response = await axios.post(
            "https://kapi.kakao.com/v1/payment/approve",
            {
              cid: cid,
              tid: tid,
              partner_order_id: orderId,
              partner_user_id: userId,
              pg_token: pgToken
            },
            {
              headers: {
                Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
              },
            }
        );

        // 결제 내용 DB에 저장
        const sub = addSub(userId, orderId);

        return response.data;

    } catch (error: any) {
        throw new Error("카카오 페이 결제 승인 중 에러 발생" + error);
    }
}