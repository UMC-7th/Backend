import express from "express";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";
import { addDeliveryAddress } from "../controller/deliveryAddress.controller.js";

const router = express.Router();

//배송지 추가 api
router.post("/addDeliveryAddress", jwtAuthMiddleware, addDeliveryAddress);

export default router;