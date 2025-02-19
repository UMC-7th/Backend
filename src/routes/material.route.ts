import express from "express";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";
import { deleteMarkMaterial, getAllMaterial, getMarkMaterialList, markMaterial } from "../controller/material.controller.js";

const router = express.Router();

//식재료 북마크 추가
router.post("/mark", jwtAuthMiddleware, markMaterial);
//식재료 북마크 조회(리스트)
router.get("/mark", jwtAuthMiddleware, getMarkMaterialList);
//식재료 북마크 삭제
router.delete("/mark", jwtAuthMiddleware, deleteMarkMaterial);
//식재료 전체 조회
router.get("/all", getAllMaterial);

export default router;