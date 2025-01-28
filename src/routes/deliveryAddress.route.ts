import express from "express";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";
import { addDeliveryAddress, getDeliveryAddress, setDefaultDeliveryAddress, updateDeliveryAddress } from "../controller/deliveryAddress.controller.js";

const router = express.Router();

//배송지 추가 api
router.post("/", jwtAuthMiddleware, addDeliveryAddress);
//배송지 조회 api
router.get("/", jwtAuthMiddleware, getDeliveryAddress);
//배송지 수정 api
router.put("/", jwtAuthMiddleware, updateDeliveryAddress);

//기본 배송지 설정 api
router.patch("/default", jwtAuthMiddleware, setDefaultDeliveryAddress);

export default router;