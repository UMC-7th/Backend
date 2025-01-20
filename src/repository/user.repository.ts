import { prisma } from "../db.config.js";
import { DBError } from "../util/error.js";

// 이메일로 사용자 조회
export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findFirst({ where: { email: email }});
        return user;
    } catch (error) {
        throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
    }
}

// 이름으로 사용자 조회
export const getUserByName = async (name: string) => {
    try {
        const user = await prisma.user.findFirst({ where: { name: name }});
        return user;
    } catch (error) {
        throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
    }
}

// 사용자 추가
export const addUser = async (type: string, profile: any) => {
    try {
        if (type === "email") { // 이메일 회원가입
            console.log(type);
            const user = await prisma.user.create({
                data: {
                    email: profile.email,
                    password: profile.password,
                    birth: profile.birth,
                    name: profile.name,
                    phoneNum: profile.phoneNum,
                    purpose: profile.purpose,
                    isSub: profile.isSub,
                    address: profile.address,
                }
            })
            console.log(user);
            return user;

        } else if (type === "google") { // 구글 로그인
            console.log(type);
            const user = await prisma.user.create({
                data: {
                    email: profile.emails?.[0]?.value,
                    password: "",
                    birth: new Date(2000, 1, 1),
                    name: "",
                    phoneNum: "",
                    purpose: "",
                    isSub: false,
                    address: "",
                }
            })
            console.log(user);
            return user;

        } else if (type === "kakao") { // 카카오 로그인
            console.log(type);
            const user = await prisma.user.create({
                data: {
                    email: profile._json.kakao_account.email,
                    password: "",
                    birth: new Date(2000, 1, 1),
                    name: "",
                    phoneNum: "",
                    purpose: "",
                    isSub: false,
                    address: "",
                }
            })
            console.log(user);
            return user;

        } else if (type === "naver") { // 네이버 로그인
            console.log(type);
            const user = await prisma.user.create({
                data: {
                    email: "",
                    password: "",
                    birth: new Date(2000, 1, 1),
                    name: "",
                    phoneNum: "",
                    purpose: "",
                    isSub: false,
                    address: "",
                }
            })
            console.log(user);
            return user;
        }
        
    } catch (error) {
        throw new DBError("사용자 생성 중 오류가 발생했습니다.", error);
    }
}

// 소셜 로그인 시 닉네임을 입력 받아 저장
export const updateUsername = async (profile: any) => {
    try {
        const user = await prisma.user.update({
            where: { userId: profile.userId },
            data: {
                name: profile.name
            }
        })

        return user;

    } catch (error) {
        throw new DBError("사용자 닉네임 저장 중 오류가 발생했습니다.", error);
    }
}