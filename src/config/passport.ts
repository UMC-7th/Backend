import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { googleLoginService, kakaoLoginService } from "../service/user.service.js";

export const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback',
    scope: ["email", "profile"],
    state: true,
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