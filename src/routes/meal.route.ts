import express from "express";
import {
  completeMeal,
  favoriteMeal,
  getDailyMeal,
  preferredMeal,
  refreshMeal,
} from "../controller/meal.controller.js";

const router = express.Router();

//하루 식단을 조회 및 생성
router.get("/daily", getDailyMeal);

//식단 재생성(새로고침) api
router.post("/refresh", refreshMeal);

//완료한 식단 api
router.post("/complete", completeMeal);

//식단 즐겨찾기 api
router.post("/favorite", favoriteMeal);

//선호식단 추가 api
router.post("/preference", preferredMeal);

export default router;
