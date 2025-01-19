import express, { Request, Response } from "express";
import { userSignUp } from "../controller/user.controller.js";

const router = express.Router();

// 회원가입 시 사용자 정보를 입력하는 api
router.post("/signup", userSignUp);

export default router;
