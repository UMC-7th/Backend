import { getSubListCalendar } from "../repository/subscribe.repository.js";

//구독 내역 캘린더형 조회
export const getSubListCalendarService = async (userId: number) => {
    const subList = await getSubListCalendar(userId);
    return subList;
};