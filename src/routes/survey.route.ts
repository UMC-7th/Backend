import express, { Request, Response } from "express";
import { createSurvey,updateSurvey } from "../controller/survey.controller.js";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";

const router = express.Router();

router.post("/survey", jwtAuthMiddleware, createSurvey);

router.put("/survey", jwtAuthMiddleware, updateSurvey);

export default router;
