import {
  findUserProfile,
  deleteUserProfile,
  updateUserProfile,
} from "../repository/mypage.repository.js";
import { getUserById } from "../repository/user.repository.js";
import { NotFoundError } from "../util/error.js";

export const getUserProfile = async (userId: number) => {
  const user = await findUserProfile(userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저", "입력 값: " + user);
  }

  return user;
};

export const delUserProfile = async (userId: number) => {
  const deleteuser = await deleteUserProfile(userId);

  if (!deleteuser) {
    throw new NotFoundError("존재하지 않는 유저", +deleteuser);
  }
  return deleteuser;
};

export const upUserProfile = async (userId: number, updateData: any) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 유저", userId);
  }

  let updatedUser;

  if (user.loginMethod === "email") {
    updatedUser = await updateUserProfile(userId, {
      email: updateData.email,
      password: updateData.password,
      nickname: updateData.nickname,
      birth: new Date(updateData.birth),
      name: updateData.name,
      phoneNum: updateData.phoneNum,
      purpose: updateData.purpose,
    });
  } else if (user.loginMethod === "kakao" || user.loginMethod === "naver") {
    updatedUser = await updateUserProfile(userId, {
      name: updateData.name,
      birth: new Date(updateData.birth),
      phoneNum: updateData.phoneNum,
    });
  } else {
    throw new NotFoundError("존재하지 않는 유저.", user.loginMethod);
  }

  return updatedUser;
};
