import { NextFunction, Request, Response } from "express";
import { userSignUpService, userLoginService, createUsernameService } from "../service/user.service.js";
import { signupDTO, loginDTO } from "../dto/user.dto.js";
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

// 소셜 로그인 시 닉네임 입력 받아 저장
export const createUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await createUsernameService(req.body);
        res.status(StatusCodes.OK).send({ user });
    } catch (error) {
        next(error);
    }
}

// 이메일로 로그인
export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userLoginService(loginDTO(req.body));
        res.status(StatusCodes.OK).send({ user });
    } catch (error) {
        next(error);
    }
}