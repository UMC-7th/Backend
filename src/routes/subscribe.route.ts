import express from "express";
import { addCart, deleteCart, getSubList, getSubListCalendar } from "../controller/subscribe.controller.js";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";

const router = express.Router();

// 식단 장바구니 추가 api
router.post("/meals/cart", jwtAuthMiddleware, addCart);

// 식단 장바구니 제거 api
router.delete("/meals/cart/:cart_id", jwtAuthMiddleware, deleteCart);

//구독 목록 캘린더형 조회
router.get("/calendar", jwtAuthMiddleware, getSubListCalendar);
//구독 목록 리스트형 조회
router.get("/list", jwtAuthMiddleware, getSubList);

export default router;
