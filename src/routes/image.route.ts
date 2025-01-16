import express from "express";
import { createFoodImage } from "../controller/image.controller.js";

const router = express.Router();

//음식 사진 생성 api
router.get("/", createFoodImage);

export default router;
