import express from "express";
import {
    createFoodImage,
    createMealImage,
} from "../controller/image.controller.js";

const router = express.Router();

//식재료 사진 생성 api
router.get("/material", createFoodImage);
//식단 사진 생성 api
router.get("/meal", createMealImage);

export default router;
