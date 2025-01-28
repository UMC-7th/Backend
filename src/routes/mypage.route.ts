import express, { Request, Response } from "express";
import {getUser} from "../controller/mypage.controller.js";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";

const router = express.Router();


router.get("/mypage/profile",jwtAuthMiddleware, getUser);

export default router;
