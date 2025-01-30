import { APIError, InvalidInputError, NotFoundError, AlreadyExistError } from "../util/error.js";
import { getMealSubById, getKartSubById, addToCart, deleteKartSub, getSubListCalendar, getSubList } from "../repository/subscribe.repository.js";

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

//구독 내역 리스트형 조회
export const getSubListService = async (userId: number) => {
    const subList = await getSubList(userId);

    const result = new Map<string, any[]>(); // key: 날짜, value: 구독 내역

    for(let i = 0; i < subList.length; i++) {
        const orderAt = subList[i].orderAt.toISOString().slice(0, 10);
        if (!result.has(orderAt)) {
            result.set(orderAt, []);
        }
        const mealSubs = result.get(orderAt);
        if (mealSubs) {
            mealSubs.push(subList[i].mealSub);
        }
    }

    return Array.from(result);
};
