import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as NaverStrategy} from "passport-naver";
import { googleLoginService, kakaoLoginService, naverLoginService } from "../service/user.service.js";

export const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback',
    scope: ["email", "profile"],
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await googleLoginService(profile);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
});


export const kakaoStrategy = new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID!,
    callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await kakaoLoginService(profile);
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
});


export const naverStrategy = new NaverStrategy({
    clientID: process.env.NAVER_LOGIN_CLIENT_ID!,
    clientSecret: process.env.NAVER_LOGIN_CLIENT_SECRET!,
    callbackURL: '/auth/naver/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await naverLoginService(profile);
            return done(null, user);
            
        } catch (error) {
            return done(error, null);
        }
});