import express, { Request, Response } from "express";
import {getUser,deleteUser} from "../controller/mypage.controller.js";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";


const router = express.Router();


router.get("/mypage/profile",jwtAuthMiddleware, getUser);

router.delete("/mypage/delete",jwtAuthMiddleware,deleteUser);


export default router;
