import express from "express";
import { addCart, deleteCart } from "../controller/subscribe.controller.js";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";

const router = express.Router();

// 식단 장바구니 추가 api
router.post("/meals/cart", jwtAuthMiddleware, addCart);

// 식단 장바구니 제거 api
router.delete("/meals/cart/:cart_id", jwtAuthMiddleware, deleteCart);

export default router;
