import express from "express";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";
import {
  addSubMeal,
  getSubMeal,
} from "../controller/subscribe.meal.controller.js";

const router = express.Router();

// 구독 식단 조회
router.get("/list", jwtAuthMiddleware, getSubMeal);

// 구독 식단 생성 (영양사 수동)
router.post("/", jwtAuthMiddleware, addSubMeal);

export default router;
