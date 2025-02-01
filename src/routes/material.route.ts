import express from "express";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";
import { getMarkMaterialList, markMaterial } from "../controller/material.controller.js";

const router = express.Router();

//식재료 북마크 추가
router.post("/mark", jwtAuthMiddleware, markMaterial);
//식재료 북마크 조회(리스트)
router.get("/mark", jwtAuthMiddleware, getMarkMaterialList);

export default router;