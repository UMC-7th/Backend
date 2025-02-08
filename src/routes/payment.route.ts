import express from "express";
import { kakaoPayment, kakaoSuccess, kakaoCancel, kakaoFail } from "../controller/payment.controller.js";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";

const router = express.Router();

// 카카오 페이 결제 api
router.post("/kakao", jwtAuthMiddleware, kakaoPayment);

// 카카오 페이 결제 인증 성공
router.get("/kakao/success", kakaoSuccess);

// 카카오 페이 결제 취소
router.get("/kakao/cancel", kakaoCancel);

// 카카오 페이 결제 실패
router.get("/kakao/fail", kakaoFail);

export default router;
