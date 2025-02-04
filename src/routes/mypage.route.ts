import express, { Request, Response } from "express";
import {getUser,deleteUser,updateUser,getGoal,getHealthScore,getResult} from "../controller/mypage.controller.js";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";




const router = express.Router();


router.get("/mypage/profile",jwtAuthMiddleware, getUser);

router.delete("/mypage/delete",jwtAuthMiddleware,deleteUser);

router.put("/mypage/update",jwtAuthMiddleware,updateUser);

router.get("/mypage/goal",jwtAuthMiddleware,getGoal);

router.get("/mypage/healthscore",jwtAuthMiddleware,getHealthScore);

router.get("/mypage/result", jwtAuthMiddleware,getResult);




export default router;
