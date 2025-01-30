import { getSubList, getSubListCalendar } from "../repository/subscribe.repository.js";

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