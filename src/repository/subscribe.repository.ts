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
            orderBy: {
                mealSub: {
                    mealDate: "asc",
                },
            },
        });

        return subList;
    } catch (error) {
        throw new DBError("구독 내역 조회 중 오류가 발생했습니다.", userId);
    }
};

//구독 내역 리스트형 조회
export const getSubList = async (userId: number) => {
    try {
        const subList = await prisma.subscribe.findMany({
            where: {
                userId: userId,
            },
            select: {
                orderAt: true,
                mealSub: {
                    select: {
                        mealDate: true,
                        time: true,
                        meal: {select: {food: true, calorieTotal: true}},
                        category: {select: {name: true}},
                    },
                },
            },
            orderBy: {
                mealSub: {
                    mealDate: "asc",
                },
            },
        });

        return subList;
    } catch (error) {
        throw new DBError("구독 내역 조회 중 오류가 발생했습니다.", userId);
    }
};