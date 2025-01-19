import express, { Request, Response } from "express";
import { userSignUp, createUsername } from "../controller/user.controller.js";

const router = express.Router();

// 이메일로 회원가입하는 api
router.post("/signup", userSignUp);

// 소셜 로그인 시 닉네임을 입력받는 api
router.post("/socialLogin/name", createUsername)

export default router;
