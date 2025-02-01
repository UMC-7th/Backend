import express from "express";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";
import { markMaterial } from "../controller/material.controller.js";

const router = express.Router();

//식재료 북마크 추가
router.post("/mark", jwtAuthMiddleware, markMaterial);

export default router;