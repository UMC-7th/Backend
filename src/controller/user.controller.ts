import { NextFunction, Request, Response } from "express";
import { userSignUpService } from "../service/user.service.js";
import { signupDTO } from "../dto/user.dto.js";
import { StatusCodes } from "http-status-codes";


// 이메일로 회원가입 시 사용자 필수 정보 입력
export const userSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userSignUpService(signupDTO(req.body));
        res.status(StatusCodes.OK).send({ user });
    } catch (error) {
        next(error);
    }
}