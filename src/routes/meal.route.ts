import express, { Request, Response } from "express";
import { getDailyMeal } from "../controller/meal.controller.js";

const router = express.Router();

// api/v1/meals 경로
router.get("/", (req: Request, res: Response) => {
  res.send("api/v1/meals 경로 ");
});

//하루 식단을 생성하는 api
router.post("/daily", getDailyMeal);

export default router;
