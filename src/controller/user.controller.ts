import { Request, Response } from "express";
import { userSignUpService } from "../service/user.service.js";
import { bodyToUser } from "../dto/user.dto.js";
import { StatusCodes } from "http-status-codes";

export const userSignUp = async (req: Request, res: Response) => {
    try {
        const user = await userSignUpService(bodyToUser(req.body));
        res.status(StatusCodes.OK).send({ user });
    } catch (error) {
        res.status(500).send("회원가입 중 에러 발생");
    }
}