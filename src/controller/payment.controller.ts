import { NextFunction, Request, Response } from "express";
import { kakaoPaymentDTO, naverPaymentDTO } from "../dto/payment.dto.js";
import { kakaoPaymentService, kakaoPaymentSuccessService, naverPaymentService } from "../service/payment.service.js";
import { StatusCodes } from "http-status-codes";
import redis from "redis"

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
    legacyMode: true
});

// redis 연결
async function connectRedis() {
    try {
        await redisClient.connect();
        console.info('Redis 서버에 연결되었습니다.');
    }
    catch (error) {
        console.error('Redis 서버 연결 에러: ', error);
    }
}

connectRedis();


// 카카오 페이 결제 요청
export const kakaoPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await kakaoPaymentService(kakaoPaymentDTO(req.body));
        await redisClient.v4.setEx(req.body.userId, 180, data.tid) // 인증번호를 3분간 redis에 저장
        res.status(StatusCodes.OK).success({ data });
    } catch (error) {
        next(error);
    }
}

export const kakaoSuccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tid = await redisClient.v4.get(req.query.uid);
        const data = { 
            cid: req.query.cid,
            orderId: req.query.oid,
            userId: req.query.uid,
            pgToken: req.query.pg_token,
            tid: tid
        }
        const response = await kakaoPaymentSuccessService(data);
        res.status(StatusCodes.OK).success({ response });
    } catch (error) {
        next(error);
    }
}

export const kakaoCancel = async (req: Request, res: Response, next: NextFunction) => {
    throw Error("카카오 페이 결제 취소");
}

export const kakaoFail = async (req: Request, res: Response, next: NextFunction) => {
    throw Error("카카오 페이 결제 실패");
}

// 네이버 페이 결제
export const naverPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await naverPaymentService(naverPaymentDTO(req.body));
        res.status(StatusCodes.OK).success({ data });
    } catch (error) {
        next(error);
    }
}