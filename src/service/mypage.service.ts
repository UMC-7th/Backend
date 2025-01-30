import {
  findUserProfile,
  deleteUserProfile,
} from "../repository/mypage.repository.js";
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
