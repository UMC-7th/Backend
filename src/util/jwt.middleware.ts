import { Request, Response, NextFunction } from "express";
import { APIError, InvalidInputError, NotFoundError, AlreadyExistError } from "../util/error.js";
import { verifyToken } from './jwt.util.js';

// 사용자 인증 미들웨어
export const jwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
    
        if (!token) {
            throw new InvalidInputError("토큰이 존재하지 않습니다", "입력 값: " + token);
        }

        const decoded = verifyToken(token) as { id: number, email: string };
        req.user = decoded;
        next();

    } catch (error) {
        next(error);
    }
}