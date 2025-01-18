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