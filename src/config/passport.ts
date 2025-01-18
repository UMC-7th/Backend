import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { socialLoginService } from "../service/user.service.js";

export const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback',
    scope: ["email", "profile"],
    state: true,
    }, async (accessToken, refreshToken, profile, cb) => {
    try {
        const user = await socialLoginService(profile);
        return cb(null, user);
    } catch (error) {
        return cb(error);
    }
});

/*
passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID!,
    callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await socialLoginService(profile);
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));
*/