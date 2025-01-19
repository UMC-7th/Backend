import express, { Request, Response } from "express";
import dietRouter from "./diet.route.js";
import imageRouter from "./image.route.js";
import userRouter from "./user.route.js";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

//api/v1/diets 경로 요청 처리 라우터
router.use("/diets", dietRouter);

//api/v1/images 경로 요청 처리 라우터
router.use("/images", imageRouter);

//api/v1/users 경로 요청 처리 라우터
router.use("/users", userRouter);

export default router;
