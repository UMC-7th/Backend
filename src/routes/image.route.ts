import express from "express";
import { createFoodImage } from "../controller/image.controller.js";

const router = express.Router();

//식재료 사진 생성 api
router.get("/material", createFoodImage);

export default router;
