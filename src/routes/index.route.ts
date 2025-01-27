import express, { Request, Response } from "express";
import imageRouter from "./image.route.js";
import userRouter from "./user.route.js";
import mealRouter from "./meal.route.js";
import subscribeRouter from "./deliveryAddress.route.js";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

//api/v1/images 경로 요청 처리 라우터
router.use("/images", imageRouter);

//api/v1/users 경로 요청 처리 라우터
router.use("/users", userRouter);

//api/v1/meals 경로 요청 처리 라우터
router.use("/meals", mealRouter);

//api/v1/subscribes 경로 요청 처리 라우터
router.use("/subscribes", subscribeRouter);

export default router;
