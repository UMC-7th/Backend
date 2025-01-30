import express from "express";
import {
  addManualMeal,
  completeMeal,
  favoriteMeal,
  getDailyMeal,
  getManualMeal,
  preferredMeal,
  refreshMeal,
} from "../controller/meal.controller.js";

const router = express.Router();

//하루 식단을 조회 및 생성
router.post("/daily", getDailyMeal);

//식단 재생성(새로고침) api
router.post("/refresh", refreshMeal);

//완료한 식단 api
router.patch("/complete", completeMeal);

//식단 즐겨찾기 api
router.patch("/favorite", favoriteMeal);

//선호식단 추가 api
router.patch("/preference", preferredMeal);

//식단 수동 추가
router.post("/manual", addManualMeal);

//수동으로 추가한 식단 조회
router.get("/manual/list", getManualMeal);

export default router;
