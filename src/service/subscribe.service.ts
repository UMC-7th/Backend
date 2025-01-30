import { APIError, InvalidInputError, NotFoundError, AlreadyExistError } from "../util/error.js";
import { getMealSubById, getKartSubById, addToCart, deleteKartSub, getSubListCalendar } from "../repository/subscribe.repository.js";

export const addCartService = async (userId: number, data: any) => {
    try {
        const { mealSubId, count } = data;
        const mealSub = await getMealSubById(mealSubId);
        if (mealSub === null) {
            throw new NotFoundError("해당 아이디를 가진 구독 제공 식단을 찾지 못했습니다.", "입력 값: " + mealSubId);
        }

        const kartSub = await addToCart(userId, mealSubId, count);
        return kartSub;

    } catch (error: any) {
        throw new Error("식단 장바구니 추가 중 에러 발생 " + error);
    }
}

export const deleteCartService = async (userId: number, cartId: number) => {
    try {
        const kartSub = await getKartSubById(userId, cartId);
        if (kartSub === null) {
            throw new NotFoundError("해당 장바구니의 식단을 찾지 못했습니다.", "입력 값: " + cartId);
        }

        const delKartSub = await deleteKartSub(userId, cartId);
        return delKartSub;

    } catch (error: any) {
        throw new Error("식단 장바구니 제거 중 에러 발생 " + error);
    }
}

//구독 내역 캘린더형 조회
export const getSubListCalendarService = async (userId: number) => {
    const subList = await getSubListCalendar(userId);

    const result = new Set<string>();

    for (let i = 0; i < subList.length; i++) {
        result.add(subList[i].mealSub.mealDate.toISOString().slice(0, 10));
    }

    return Array.from(result);
};
