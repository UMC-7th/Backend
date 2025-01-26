import express from "express";
import { kakaoPayment, naverPayment, kakaoSuccess, kakaoCancel, kakaoFail } from "../controller/payment.controller.js";

const router = express.Router();

// 카카오 페이 결제 api
router.post("/kakao", kakaoPayment);

// 카카오 페이 결제 인증 성공
router.get("/kakao/success", kakaoSuccess);

// 카카오 페이 결제 취소
router.get("/kakao/cancel", kakaoCancel);

// 카카오 페이 결제 실패
router.get("/kakao/fail", kakaoFail);

// 네이버 페이 결제 api
router.post("/naver", naverPayment);

export default router;
