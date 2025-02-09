import express from "express";

import { jwtAuthMiddleware } from "../util/jwt.middleware.js";
import { getSubMeal } from "../controller/subscribe.controller.meal.controller.js";

const router = express.Router();

//구독 식단 생성 및 조회
router.post("/", jwtAuthMiddleware, getSubMeal);

export default router;
