import { Request, Response, NextFunction } from "express";
import { addDeliveryAddressService, getDeliveryAddressService, updateDeliveryAddressService } from "../service/deliveryAddress.service.js";
import { StatusCodes } from "http-status-codes";
import { InvalidInputError } from "../util/error.js";

//배송지 추가
export const addDeliveryAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    try {
        if (!userId) 
            throw new InvalidInputError("잘못된 토큰 값입니다.", "입력 값: " + req.headers.authorization);
        const deliveryAddress = await addDeliveryAddressService(userId, req.body);
        res.status(StatusCodes.OK).success({
            isSuccess: true,
            addressId: deliveryAddress.addressId
        });
    } catch (error) {
        next(error);
    }
};

//배송지 조회
export const getDeliveryAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    try {
        if (!userId) 
            throw new InvalidInputError("잘못된 토큰 값입니다.", "입력 값: " + req.headers.authorization);
        const deliveryAddressList = await getDeliveryAddressService(userId);
        res.status(StatusCodes.OK).success({
            result: deliveryAddressList
        });
    } catch (error) {
        next(error);
    }
};

//배송지 수정
export const updateDeliveryAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    try {
        if (!userId) 
            throw new InvalidInputError("잘못된 토큰 값입니다.", "입력 값: " + req.headers.authorization);
        const deliveryAddress = await updateDeliveryAddressService(userId, req.body);
        res.status(StatusCodes.OK).success({
            isSuccess: true,
            deliveryAddress: deliveryAddress
        });
    } catch (error) {
        next(error);
    }
};