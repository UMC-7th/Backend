import { prisma } from "../db.config.js";
import { DBError } from "../util/error.js";

export const getUser = async (email: string) => {
    try {
        const user = await prisma.user.findFirst({ where: { email: email }});
        return user;
    } catch (error) {
        throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
    }
}


// 사용자 추가
export const addUser = async (profile: any) => {
    try {
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
        return user;
        
    } catch (error) {
        throw new DBError("사용자 생성 중 오류가 발생했습니다.", error);
    }
}

export const updateUser = async (data: any) => {
    try {
        const user = await prisma.user.update({
            where: { userId: data.userId },
            data: {
                email: data.email,
                password: data.password,
                birth: data.birth,
                name: data.name,
                phoneNum: data.phoneNum,
                purpose: data.purpose,
                address: data.address,
                updatedAt: new Date()
            }
        })

        return user;

    } catch (error) {
        throw new DBError("사용자 정보 저장 중 오류가 발생했습니다.", error);
    }
}