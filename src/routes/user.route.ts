import express, { Request, Response } from "express";
import { userSignUp } from "../controller/user.controller.js";

const router = express.Router();

// 이메일로 회원가입하는 api
router.post("/signup", userSignUp);

export default router;
