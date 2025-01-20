import { APIError, InvalidInputError, NotFoundError, AlreadyExistError } from "../util/error.js";
import { getUserByEmail, getUserByName, addUser, updateUsername } from "../repository/user.repository.js";

export const googleLoginService = async (profile: any) => {
    try {

        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        if (!email) {
            throw new InvalidInputError("이메일이 존재하지 않습니다", "입력 값: " + email);
        }
        const user = await getUserByEmail(email);
        
        // 사용자가 이미 존재하면 생성 X
        if (user !== null) {
            return user;
        }

        // 사용자가 없다면 새롭게 생성
        const newUser= await addUser("google", profile);
        return newUser;

    } catch (error: any) {
        throw new Error("구글 로그인 중 에러 발생" + error);
    }
}

export const kakaoLoginService = async (profile: any) => {
    try {
        const email = profile._json.kakao_account.email;

        if (!email) {
            throw new InvalidInputError("이메일이 존재하지 않습니다", "입력 값: " + email);
        }

        const user = await getUserByEmail(email);

        // 사용자가 이미 존재하면 생성 X
        if (user !== null) {
            return user;
        }

        // 사용자 새롭게 생성
        const newUser= await addUser("kakao", profile);
        return newUser;

    } catch (error: any) {
        throw new Error("카카오 로그인 중 에러 발생" + error);
    }
}

export const userSignUpService = async (profile: any) => {
    try {
        const email = profile.email;

        if (!email) {
            throw new InvalidInputError("이메일이 존재하지 않습니다", "입력 값: " + email);
        }

        const user = await getUserByEmail(email);

        // 사용자가 이미 존재하면 생성 X
        if (user !== null) {
            throw new AlreadyExistError("이미 가입되어 있는 이메일 입니다.", "입력 값: " + email);
        }

        const newUser = await addUser("email", profile);
        return newUser;
        
    } catch (error: any) {
        throw new Error("회원가입 중 에러 발생 " + error);
    }
}

export const createUsernameService = async (profile: any) => {
    try {
        const name = profile.name;
        const user = await getUserByName(name);

        // 닉네임 중복 체크
        if (user !== null) {
            throw new AlreadyExistError("이미 사용 중인 닉네임 입니다.", "입력 값: " + name)
        }

        const newUser = await updateUsername(profile);
        return newUser;
    } catch (error: any) {
        throw new Error("닉네임 저장 중 에러 발생 " + error);
    }
}

export const userLoginService = async (profile: any) => {
    try {
        const user = await getUserByEmail(profile.email);
        if (user === null) {
            throw new NotFoundError("해당 이메일을 가진 사용자를 찾지 못했습니다.", "입력 값: " + profile.email);
        }

        if (profile.password !== user.password) {
            throw new InvalidInputError("잘못된 비밀번호를 입력하였습니다.", "입력 값: " + profile.password);
        }

        return user;

    } catch (error) {
        throw new Error("로그인 중 에러 발생 " + error);
    }
}