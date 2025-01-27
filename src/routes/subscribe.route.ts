import express from "express";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";
import { addDeliveryAddress } from "../controller/subscribe.controller.js";

const router = express.Router();

router.post("/addDeliveryAddress", jwtAuthMiddleware, addDeliveryAddress);

export default router;