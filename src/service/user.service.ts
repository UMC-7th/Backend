import { APIError, InvalidInputError, NotFoundError, AlreadyExistError } from "../util/error.js";
import { getUserByEmail, getUserByNickName, addUser, updateNickname } from "../repository/user.repository.js";
import { setRedisValue, getRedisValue } from "../controller/payment.controller.js";
import CoolSMS from "coolsms-node-sdk";

const smsService = CoolSMS.default;
const messageService = new smsService(process.env.COOL_SMS_API_KEY!, process.env.COOL_SMS_API_SECRET!);

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

export const naverLoginService = async (profile: any) => {
    try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
            throw new InvalidInputError("이메일이 존재하지 않습니다", "입력 값: " + email);
        }

        const user = await getUserByEmail(email);

        // 사용자가 이미 존재하면 생성 X
        if (user !== null) {
            return user;
        }

        // 사용자 새롭게 생성
        const newUser= await addUser("naver", profile);
        return newUser;

    } catch (error: any) {
        throw new Error("네이버 로그인 중 에러 발생" + error);
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
        const nickname = profile.nickname;
        const user = await getUserByNickName(nickname);

        // 닉네임 중복 체크
        if (user !== null) {
            throw new AlreadyExistError("이미 사용 중인 닉네임 입니다.", "입력 값: " + nickname)
        }

        const newUser = await updateNickname(profile);
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

    } catch (error: any) {
        throw new Error("로그인 중 에러 발생 " + error);
    }
}

export const sendOtp = async (phoneNumber: string) => {
    try {
        // 인증번호 발급 및 Redis에 3분간 저장
        const code = generateCode();
        await setRedisValue(phoneNumber, code, 3);

        // 해당 휴대폰으로 인증번호 발송
        const result = await sendMessage(phoneNumber, code);

        return result;

    } catch (error) {
        throw new Error("인증번호 전송 중 에러 발생 " + error);
    }
}

export const generateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 랜덤 숫자 생성
    return code
}

export const sendMessage = async (phoneNumber: string, code: string) => {
    const result = messageService.sendOne({
        to: phoneNumber,
        from: "01049442682",
        text: `[이거먹자] 인증번호 ${code}`,
        autoTypeDetect: true
    })
    return result;
}