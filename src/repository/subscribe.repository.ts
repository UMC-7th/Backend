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