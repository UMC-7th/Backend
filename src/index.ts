import dotenv from "dotenv";
import cors from "cors";
import express, { Request, Response, Express, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import passport from "passport";
import { errorMiddleware, successMiddleware } from "./util/middleware.js";
import mainRouter from "./routes/index.route.js";
import { socialAuthCallback } from "./controller/user.controller.js";
import {
  googleStrategy,
  kakaoStrategy,
  naverStrategy,
} from "./config/passport.js";

dotenv.config();

passport.use(googleStrategy);
passport.use(kakaoStrategy);
passport.use(naverStrategy);

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:3000", // Swagger UI가 실행 중인 URL
    credentials: true, // 세션 쿠키 전송 허용
  })
);

app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

const swaggerSpec = YAML.load(path.join("./build/swagger.yaml"));

app.use(successMiddleware);

app.use(passport.initialize());

// Google Passport 관련 URL
app.get("/auth/google", passport.authenticate("google"));
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/users/login",
    failureMessage: true,
    session: false,
  }),
  socialAuthCallback
);

// Kakao Passport 관련 URL
app.get("/auth/kakao", passport.authenticate("kakao"));
app.get(
  "/auth/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/api/v1/users/login",
    failureMessage: true,
    session: false,
  }),
  socialAuthCallback
);

// Naver Passport 관련 URL
app.get("/auth/naver", passport.authenticate("naver"));
app.get(
  "/auth/naver/callback",
  passport.authenticate("naver", {
    failureRedirect: "/api/v1/users/login",
    failureMessage: true,
    session: false,
  }),
  socialAuthCallback
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v1", mainRouter);

app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
