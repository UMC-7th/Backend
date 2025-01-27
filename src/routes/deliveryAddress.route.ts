import express from "express";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";
import { addDeliveryAddress, getDeliveryAddress } from "../controller/deliveryAddress.controller.js";

const router = express.Router();

//배송지 추가 api
router.post("/", jwtAuthMiddleware, addDeliveryAddress);
//배송지 조회 api
router.get("/", jwtAuthMiddleware, getDeliveryAddress);

export default router;