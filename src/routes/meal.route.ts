import express from "express";
import { completeMeal, getDailyMeal } from "../controller/meal.controller.js";

const router = express.Router();

//하루 식단을 생성하는 api
router.post("/daily", getDailyMeal);
//식단 재생성(새로고침)하는 api
router.post("/refresh");
//완료한 식단 api
router.post("/complete", completeMeal);
//선호식단에 추가하는 api
router.post("/meals/:mealId/preference");

export default router;
