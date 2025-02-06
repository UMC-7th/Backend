import express from "express";
import {
  addManualMeal,
  completeMeal,
  deleteFavoriteMeal,
  deleteManualMeal,
  favoriteMeal,
  getDailyMeal,
  getFavoriteMeal,
  getManualMeal,
  getMealDetail,
  preferredMeal,
  refreshMeal,
} from "../controller/meal.controller.js";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";

const router = express.Router();

//하루 식단을 조회 및 생성
router.post("/daily", jwtAuthMiddleware, getDailyMeal);

//식단 재생성(새로고침) api
router.post("/refresh", jwtAuthMiddleware, refreshMeal);

//완료한 식단 api
router.patch("/complete", jwtAuthMiddleware, completeMeal);

//식단 즐겨찾기 api
router.patch("/favorite", jwtAuthMiddleware, favoriteMeal);

//선호식단 추가 api
router.patch("/preference", jwtAuthMiddleware, preferredMeal);

//식단 수동 추가
router.post("/manual", jwtAuthMiddleware, addManualMeal);

//수동으로 추가한 식단 조회
router.get("/manual/list", jwtAuthMiddleware, getManualMeal);

//수동으로 추가한 식단 삭제
router.delete("/manual/delete", jwtAuthMiddleware, deleteManualMeal);

//즐겨찾기한 식단 조회
router.get("/favorite/list", jwtAuthMiddleware, getFavoriteMeal);

//즐겨찾기한 식단 조회
router.get("/detail/list", jwtAuthMiddleware, getMealDetail);

//식단 즐겨찾기 취소
router.patch("/favorite/delete", jwtAuthMiddleware, deleteFavoriteMeal);

export default router;
