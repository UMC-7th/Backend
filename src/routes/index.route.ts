import express, { Request, Response } from "express";
import imageRouter from "./image.route.js";
import userRouter from "./user.route.js";
import mealRouter from "./meal.route.js";
import mypageRouter from "./mypage.route.js";
import deliveryAddressRouter from "./deliveryAddress.route.js";
import subscribeRouter from "./subscribe.route.js";
import paymentRouter from "./payment.route.js";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

//api/v1/images 경로 요청 처리 라우터
router.use("/images", imageRouter);

//api/v1/users 경로 요청 처리 라우터
router.use("/users", userRouter,mypageRouter);

//api/v1/meals 경로 요청 처리 라우터
router.use("/meals", mealRouter);

//api/v1/subscribes 경로 요청 처리 라우터
router.use("/deliveryAddress", deliveryAddressRouter);

//api/v1/subscribes 경로 요청 처리 라우터
router.use("/subscribes", subscribeRouter);

//api/v1/payment 경로 요청 처리 라우터
router.use("/payment", paymentRouter);

export default router;
