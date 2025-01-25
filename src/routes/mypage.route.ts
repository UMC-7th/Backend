import express, { Request, Response } from "express";
import {getUser} from "../controller/mypage.controller.js";

const router = express.Router();


router.get("/profile", getUser);

export default router;
