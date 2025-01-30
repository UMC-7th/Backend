import express from "express";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";
import { getSubListCalendar } from "../controller/subscribe.controller.js";

const router = express.Router();

//구독 목록 캘린더형 조회
router.get("/calendar", jwtAuthMiddleware, getSubListCalendar);

export default router;