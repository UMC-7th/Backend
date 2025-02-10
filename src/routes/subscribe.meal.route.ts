import express from "express";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";
import {
  addSubMeal,
  getSubMeal,
} from "../controller/subscribe.meal.controller.js";

const router = express.Router();

router.get("/list", jwtAuthMiddleware, getSubMeal);
router.post("/", jwtAuthMiddleware, addSubMeal);

export default router;
