import express, { Request, Response } from "express";
import {getUser,deleteUser,updateUser} from "../controller/mypage.controller.js";
import { jwtAuthMiddleware } from "../util/jwt.middleware.js";


const router = express.Router();


router.get("/mypage/profile",jwtAuthMiddleware, getUser);

router.delete("/mypage/delete",jwtAuthMiddleware,deleteUser);

router.put("/mypage/update",jwtAuthMiddleware,updateUser);




export default router;
