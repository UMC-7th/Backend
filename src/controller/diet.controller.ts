import { Request, Response } from "express";
import { getDailyDietService } from "../service/diet.service.js";
import { DietRequestDTO } from "../dto/diet.dto.js";

//하루 식단을 가져오는 api 컨트롤러
export const getDailyDiet = async(req: Request, res: Response) => {
  try {
    console.log("하루 식단을 요청했습니다!");

    const diet = await getDailyDietService(DietRequestDTO(req.body))
    //응답 DTO 아직 작성 못함 
    res.status(200).send(diet);
  } catch (error) {
    console.log(error);
    res.status(500).send("서버 내부 오류");
  }
};
