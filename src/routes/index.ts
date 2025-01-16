import express, { Request, Response } from "express";
import dietRouter from "./diet.route.js";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

//api/v1/diets 경로 요청 처리 라우터
router.use("/diets", dietRouter);

export default router;
