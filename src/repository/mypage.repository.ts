import { prisma } from "../db.config.js";
import { DBError } from "../util/error.js";

export const findUserProfile = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { userId: userId },
      select: {
        nickname: true,
        name: true,
        email: true,
        birth: true,
        phoneNum: true,
        profileImage: true,
      },
    });

    return user;
  } catch (error) {
    throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
  }
};

export const deleteUserProfile = async (userId: number) => {
  try {
    const deleteUser = await prisma.user.delete({
      where: { userId: userId },
    });
    return deleteUser;
  } catch (error) {
    throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
  }
};

export const updateUserProfile = async (userId: number, updateData: any) => {
  try {
    const updateUser = await prisma.user.update({
      where: { userId: userId },
      data: updateData,
    });
    return updateUser;
  } catch (error) {
    throw new DBError("사용자 조회 중 오류가 발생했습니다", error);
  }
};

export const findGoalProfile = async (userId: number) => {
  try {
    const goal = await prisma.survey.findFirst({
      where: { userId: userId },
      select: {
        goal: true,
      },
    });

    return goal;
  } catch (error) {
    throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
  }
};

export const findhealthscoreProfile = async (userId: number) => {
  try {
    const healthscore = await prisma.survey.findFirst({
      where: { userId: userId },
    });

    return healthscore;
  } catch (error) {
    throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
  }
};

export const findResultProfile = async (userId: number) => {
  try {
    const result = await prisma.survey.findFirst({
      where: { userId: userId },
    });

    return result;
  } catch (error) {
    throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
  }
};

export const saveHealthScore = async (userId: number, healthScore: number) => {
  try {
    const now = new Date();
    const nowKST = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    const todayKST = new Date(nowKST);
    todayKST.setHours(0, 0, 0, 0);

    const tomorrowKST = new Date(todayKST);
    tomorrowKST.setDate(todayKST.getDate() + 1);

    const existScore = await prisma.healthScore.findFirst({
      where: {
        userId,
        createdAt: {
          gte: todayKST,
          lt: tomorrowKST,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existScore) {
      return existScore;
    }

    const previousScore = await prisma.healthScore.findFirst({
      where: {
        userId,
        createdAt: { lt: todayKST },
      },
      orderBy: { createdAt: "desc" },
    });

    let comparison = 0;
    if (previousScore && previousScore.healthScore !== null) {
      comparison = healthScore - previousScore.healthScore;
    }

    const savedHealthScore = await prisma.healthScore.create({
      data: {
        userId,
        healthScore,
        comparison: comparison || 0,
        createdAt: nowKST,
      },
    });
    return savedHealthScore;
  } catch (error) {
    throw new DBError("건강 점수 저장 중 오류가 발생했습니다.", error);
  }
};

export const updateImageProfile = async (userId: number, imageUrl: string) => {
  try {
    const updateImage = await prisma.user.update({
      where: { userId: userId },
      data: { profileImage: imageUrl },
    });

    return updateImage;
  } catch (error) {
    throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
  }
};
