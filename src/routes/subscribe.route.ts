import express from "express";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";
import { getSubList, getSubListCalendar } from "../controller/subscribe.controller.js";

const router = express.Router();

//구독 목록 캘린더형 조회
router.get("/calendar", jwtAuthMiddleware, getSubListCalendar);
//구독 목록 리스트형 조회
router.get("/list", jwtAuthMiddleware, getSubList);

export default router;