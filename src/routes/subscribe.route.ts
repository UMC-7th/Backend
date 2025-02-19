import express from "express";
import { getCartList, addCart, deleteCart, getSubList, getSubListCalendar, searchSubList } from "../controller/subscribe.controller.js";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";

const router = express.Router();

// 식단 장바구니 리스트 API
router.get("/meals/cart", jwtAuthMiddleware, getCartList);

// 식단 장바구니 추가 api
router.post("/meals/cart", jwtAuthMiddleware, addCart);

// 식단 장바구니 제거 api
router.delete("/meals/cart/:cart_id", jwtAuthMiddleware, deleteCart);

//구독중인 식단 목록 캘린더형 조회
router.get("/users/calendar", jwtAuthMiddleware, getSubListCalendar);
//구독중인 식단 목록 리스트형 조회
router.get("/users/list", jwtAuthMiddleware, getSubList);
//구독중인 식단 목록 검색
router.get("/users/search", jwtAuthMiddleware, searchSubList);

export default router;
