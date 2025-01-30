import { prisma } from "../db.config.js";
import { DBError } from "../util/error.js";

//구독 내역 캘린더형 조회
export const getSubListCalendar = async (userId: number) => {
    try {
        const subList = await prisma.subscribe.findMany({
            where: {
                userId: userId,
            },
            select: {
                mealSub: {
                    select: {
                        mealDate: true,
                    },
                },
            },
        });

        return subList;
    } catch (error) {
        throw new DBError("구독 내역 조회 중 오류가 발생했습니다.", userId);
    }
};
