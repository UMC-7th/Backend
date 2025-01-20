import express, { Request, Response } from "express";
import { getDailyMeal } from "../controller/meal.controller.js";

const router = express.Router();

//하루 식단을 생성하는 api
router.post("/daily", getDailyMeal);

export default router;
