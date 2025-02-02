import { prisma } from "../db.config.js";
import { DBError } from "../util/error.js";

// 이메일로 사용자 조회
export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({ where: { email: email } });
    return user;
  } catch (error) {
    throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
  }
};

// 닉네임으로 사용자 조회
export const getUserByNickName = async (nickname: string) => {
  try {
    const user = await prisma.user.findFirst({ where: { nickname: nickname } });
    return user;
  } catch (error) {
    throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
  }
};

export const getUserById = async (userId: number) => {
  const user = await prisma.user.findFirst({ where: { userId: userId } });

  return user;
};

// 사용자 추가
export const addUser = async (type: string, profile: any) => {
  try {
    if (type === "email") {
      // 이메일 회원가입
      const user = await prisma.user.create({
        data: {
          email: profile.email,
          password: profile.password,
          birth: profile.birth,
          name: profile.name,
          nickname: profile.nickname,
          phoneNum: profile.phoneNum,
          purpose: profile.purpose,
          loginMethod: "email"
        },
      });
      return user;
    } else if (type === "google") {
      // 구글 로그인
      const user = await prisma.user.create({
        data: {
          email: profile.emails?.[0]?.value,
          password: "",
          birth: new Date(2000, 1, 1),
          name: profile.displayName,
          nickname: "",
          phoneNum: "",
          purpose: "",
          loginMethod : type
        },
      });
      return user;
    } else if (type === "kakao") {
      // 카카오 로그인
      const user = await prisma.user.create({
        data: {
          email: profile._json.kakao_account.email,
          password: "",
          birth: new Date(2000, 1, 1),
          name: profile.displayName,
          nickname: "",
          phoneNum: "",
          purpose: "",
          loginMethod : type
        
        },
      });
      return user;
    } else if (type === "naver") {
      // 네이버 로그인
      const user = await prisma.user.create({
        data: {
          email: profile.emails?.[0]?.value,
          password: "",
          birth: new Date(2000, 1, 1), // 월과 일은 제공을 받는데, 넣어주는건지 이거먹자 서비스에서 따로 입력을 받을건지에 따라 수정 필요
          name: profile.displayName,
          nickname: "",
          phoneNum: "",
          purpose: "",
          loginMethod : type
        
        },
      });
      return user;
    }
  } catch (error) {
    throw new DBError("사용자 생성 중 오류가 발생했습니다.", error);
  }
};

// 소셜 로그인 시 닉네임을 입력 받아 저장
export const updateNickname = async (profile: any) => {
  try {
    const user = await prisma.user.update({
      where: { userId: profile.userId },
      data: {
        nickname: profile.nickname,
      },
    });

    return user;
  } catch (error) {
    throw new DBError("사용자 닉네임 저장 중 오류가 발생했습니다.", error);
  }
};
