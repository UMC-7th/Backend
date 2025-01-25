import jwt from "jsonwebtoken";

const SECRET_ACCESS_KEY = process.env.JWT_SECRET_ACCESS_KEY!;
const SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY!;

export const generateAccessToken = (payload: any) => {
    return jwt.sign(payload, SECRET_ACCESS_KEY, {expiresIn: '1h'});
}

export const generateRefreshToken = (payload: any) => {
    return jwt.sign(payload, SECRET_REFRESH_KEY, {expiresIn: '1d'});
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, SECRET_ACCESS_KEY);
}