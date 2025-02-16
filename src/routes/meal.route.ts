import express from "express";
import {
  addDislikeMeal,
  addManualMeal,
  completeMeal,
  deleteDislikeMeal,
  deleteFavoriteMeal,
  deleteManualMeal,
  favoriteMeal,
  getDailyMeal,
  getFavoriteMeal,
  getFavoriteMealLatest,
  getManualMeal,
  getMealDetail,
  preferredMeal,
  refreshMeal,
} from "../controller/meal.controller.js";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";

const router = express.Router();

// #==================================식단 생성 및 조회==================================#

//하루 식단을 조회 및 생성
router.post("/daily", jwtAuthMiddleware, getDailyMeal);

//식단 재생성(새로고침) api
router.post("/refresh", jwtAuthMiddleware, refreshMeal);

//식단 상세 조회
router.get("/detail/list", jwtAuthMiddleware, getMealDetail);

//완료한 식단 api
router.post("/complete", jwtAuthMiddleware, completeMeal);

// #==================================수동 식단 ==================================#

//식단 수동 추가
router.post("/manual", jwtAuthMiddleware, addManualMeal);

//수동으로 추가한 식단 조회
router.get("/manual/list", jwtAuthMiddleware, getManualMeal);

//수동으로 추가한 식단 삭제
router.delete("/manual/delete", jwtAuthMiddleware, deleteManualMeal);

// #==================================식단 즐겨찾기 ==================================#

//식단 즐겨찾기 api
router.patch("/favorite", jwtAuthMiddleware, favoriteMeal);

//즐겨찾기한 식단 조회
router.get("/favorite/list/calorie", jwtAuthMiddleware, getFavoriteMeal);

// 즐겨찾기한 식단 최신순 조회
router.get("/favorite/list/latest", jwtAuthMiddleware, getFavoriteMealLatest);

//식단 즐겨찾기 취소
router.patch("/favorite/delete", jwtAuthMiddleware, deleteFavoriteMeal);

// #==================================식단 좋아요 ==================================#

//선호식단 추가 api
router.patch("/preference", jwtAuthMiddleware, preferredMeal);

// #==================================식단 싫어요 ==================================#

//식단 싫어요
router.patch("/dislike", jwtAuthMiddleware, addDislikeMeal);

//식단 싫어요 삭제
router.patch("/dislike/delete", jwtAuthMiddleware, deleteDislikeMeal);

export default router;
