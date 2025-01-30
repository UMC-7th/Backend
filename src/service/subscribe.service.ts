import { getSubListCalendar } from "../repository/subscribe.repository.js";

//구독 내역 캘린더형 조회
export const getSubListCalendarService = async (userId: number) => {
    const subList = await getSubListCalendar(userId);

    const result = new Set<string>();

    for (let i = 0; i < subList.length; i++) {
        result.add(subList[i].mealSub.mealDate.toISOString().slice(0, 10));
    }

    return Array.from(result);
};