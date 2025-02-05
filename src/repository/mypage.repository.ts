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
