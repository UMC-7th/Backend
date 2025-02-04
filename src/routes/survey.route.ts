import express, { Request, Response } from "express";
import { createSurvey } from "../controller/survey.controller.js";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";

const router = express.Router();

router.post("/survey", jwtAuthMiddleware, createSurvey);

export default router;
