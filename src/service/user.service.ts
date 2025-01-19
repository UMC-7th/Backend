import { APIError, InvalidInputError, NotFoundError } from "../util/error.js";
import { getUser, addUser, updateUser } from "../repository/user.repository.js";

export const googleLoginService = async (profile: any) => {
    try {

        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        if (!email) {
            throw new InvalidInputError("이메일이 존재하지 않습니다", "입력 값: " + email);
        }
        const user = await getUser(email);
        
        // 사용자가 이미 존재하면 생성 X
        if (user !== null) {
            return user;
        }

        // 사용자가 없다면 새롭게 생성
        const newUser= await addUser(profile);
        return newUser;

    } catch (error: any) {
        throw new Error("구글 로그인 중 에러 발생");
    }
}

export const kakaoLoginService = async (profile: any) => {
    try {

        const name = profile.username;

        if (!name) {
            throw new InvalidInputError("이름이 존재하지 않습니다", "입력 값: " + name);
        }

        // 사용자 새롭게 생성
        const newUser= await addUser(profile);
        return newUser;

    } catch (error: any) {
        throw new Error("카카오 로그인 중 에러 발생");
    }
}

export const userSignUpService = async (profile: any) => {
    try {
        const user = await addUser(profile);
        return user;
        
    } catch (error) {
        throw new Error("회원가입 중 에러 발생: " + error);
    }
}