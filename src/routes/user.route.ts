import express, { Request, Response } from "express";
import { userSignUp, userLogin, createUsername, postOtp, validateOtp } from "../controller/user.controller.js";

const router = express.Router();

// 이메일로 회원가입하는 api
router.post("/signup", userSignUp);

// 회원가입 시 휴대폰 인증번호 발급 & 문자 발송하는 API
router.post("/signup/otp", postOtp)

// 휴대폰 인증번호 검증하는 API
router.post("/signup/otp/validation", validateOtp)

// 이메일 로그인 api
router.post("/login", userLogin);

// 로그인 시 닉네임을 입력받는 api
router.post("/login/nickname", createUsername)

export default router;
