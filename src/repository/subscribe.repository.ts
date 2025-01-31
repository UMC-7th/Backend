import { prisma } from "../db.config.js";
import { DBError } from "../util/error.js";

// 아이디로 구독 식단 조회
export const getMealSubById = async (mealSubId: number) => {
  try {
    const mealSub = await prisma.mealSub.findFirst({ where: { mealSubId: mealSubId } });
    return mealSub;
  } catch (error) {
    throw new DBError("구독 시 제공 식단 조회 중 오류가 발생했습니다.", error);
  }
};

// userId와 cartId로 장바구니 조회
export const getKartSubById = async (userId: number, cartId: number) => {
  try {
    const kartSub = await prisma.kartSub.findFirst({ where: { kardId: cartId, userId: userId } });
    return kartSub;
  } catch (error) {
    throw new DBError("장바구니 조회 중 오류가 발생했습니다.", error);
  }
};

// 식단 장바구니 추가
export const addToCart = async (userId: number, mealSubId: number, count: number) => {
    try {
        const kartSub = await prisma.kartSub.create({
            data: {
                userId: userId,
                mealSubId: mealSubId,
                cnt: count
            },
          });
          return kartSub;
    } catch (error) {
        throw new DBError("식단 장바구니 추가 중 오류가 발생했습니다.", error);
    }
};

// 식단 장바구니 제거
export const deleteKartSub = async (userId: number, cartId: number) => {
    try {
        const delKartSub = await prisma.kartSub.delete({ where: { kardId: cartId, userId: userId } });
        return delKartSub
    } catch (error) {
        throw new DBError("식단 장바구니 제거 중 오류가 발생했습니다.", error);
    }
};

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
                        meal: {select: {mealId: true, food: true, calorieTotal: true}},
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

//구독 내역 검색(날짜)
export const searchSubList = async (userId: number, date: Date) => {
    try {
        const subList = await prisma.subscribe.findMany({
            where: {
                userId: userId,
                orderAt: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lt: new Date(date.setHours(23, 59, 59, 999))
                }
            },
            select: {
                orderAt: true,
                mealSub: {
                    select: {
                        mealDate: true,
                        time: true,
                        meal: {select: {mealId: true, food: true, calorieTotal: true}},
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