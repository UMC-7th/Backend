import express, { Request, Response } from "express";
import { getDailyDiet } from "../controller/diet.controller.js";

const router = express.Router();

// api/v1/diets 경로
router.get("/", (req: Request, res: Response) => {
  res.send("api/v1/diets 경로 ");
});

//하루 식단을 가져오는 api
router.get("/daily", getDailyDiet);

export default router;
