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

export const addUser = async (email: string, name: string) => {
    try {
        // 구글과 카카오 로그인 시 가져올 수 있는 데이터가 email 또는 name이라서 우선 사용자를 생성하고, 그 후에 사용자의 추가적인 정보를 입력받을 예정
        const user = await prisma.user.create({
            data: {
                email: email,
                password: "",
                birth: new Date(2000, 1, 1),
                name: name,
                phoneNum: "",
                purpose: "",
                isSub: false,
                address: "",
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