import { NextFunction, Request, Response } from "express";
import { userSignUpService, userLoginService, createUsernameService, sendOtp } from "../service/user.service.js";
import { signupDTO, loginDTO } from "../dto/user.dto.js";
import { generateAccessToken, generateRefreshToken } from "../util/jwt.util.js";
import { StatusCodes } from "http-status-codes";
import { getRedisValue } from "./payment.controller.js";


// 이메일로 회원가입 시 사용자 필수 정보 입력
export const userSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userSignUpService(signupDTO(req.body));
        res.status(StatusCodes.OK).success({ user });
    } catch (error) {
        next(error);
    }
}

// 소셜 로그인 시 닉네임 입력 받아 저장
export const createUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await createUsernameService(req.body);
        res.status(StatusCodes.OK).success({ user });
    } catch (error) {
        next(error);
    }
}

// 이메일로 로그인
export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userLoginService(loginDTO(req.body));
        const accessToken = generateAccessToken({ id: user.userId, email: user.email });
        const refreshToken = generateAccessToken({ id: user.userId, email: user.email });
        res.status(StatusCodes.OK).success({ user, accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
}

// 소셜 로그인 시 토큰 전달
export const socialAuthCallback = (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as any; // Passport에서 전달된 사용자 객체
        const accessToken = generateAccessToken({ id: user.userId, email: user.email });
        const refreshToken = generateAccessToken({ id: user.userId, email: user.email });
        res.status(StatusCodes.OK).success({ user, accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
};

// 회원가입 시 휴대폰 인증번호 발급 & 문자 발송
export const postOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phoneNumber } = req.body;
        console.log("phoneNumber: ", phoneNumber.substr(23, 11));
        const sms = await sendOtp(phoneNumber); // 인증번호 발급 및 전송
        res.status(StatusCodes.OK).success({ msg: '인증번호 전송에 성공했습니다.' });
        
    } catch (error) {
        next(error);
    }
}

// 인증번호 일치 확인
export const validateOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phoneNumber, code } = req.body;
        const storedCode = await getRedisValue(phoneNumber);

        if (storedCode && storedCode === code) {
            res.status(StatusCodes.OK).success({ msg: "인증번호가 일치합니다." });
        } else {
            res.status(400).success({ msg: "인증번호가 불일치합니다." });
        }

    } catch (error) {
        next(error);
    }
}