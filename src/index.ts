import dotenv from "dotenv";
import cors from "cors";
import express, { Request, Response, Express, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import passport from "passport";
import session from "express-session";
import { fileURLToPath } from "url";
import { errorMiddleware, successMiddleware } from "./util/middleware.js";
import { dummyController } from "./controller/dummy.controller.js";
import mainRouter from "./routes/index.route.js";
import {
  googleStrategy,
  kakaoStrategy,
  naverStrategy,
} from "./config/passport.js";
import { getUserByEmail } from "./repository/user.repository.js";
import mypageRoute from "./routes/mypage.route.js";

dotenv.config();

passport.use(googleStrategy);
passport.use(kakaoStrategy);
passport.use(naverStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: any, done) => {
  const existingUser = getUserByEmail(user.email);
  if (existingUser !== null) {
    done(null, existingUser);
  } else {
    done(null, null);
  }
});

const app = express();
const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:3000", // Swagger UI가 실행 중인 URL
    credentials: true, // 세션 쿠키 전송 허용
  })
);
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

const swaggerSpec = YAML.load(path.join(__dirname, "../build/swagger.yaml"));

app.use(successMiddleware);

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY!,
    name: "SESSIONID",
    resave: false, // 매 요청마다 세션을 강제로 저장하지 않음
    saveUninitialized: false, // 초기화되지 않은 세션 저장 안 함
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Google Passport 관련 URL
app.get("/auth/google", passport.authenticate("google"));
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/users/login",
    failureMessage: true,
  }),
  (req: Request, res: Response) => res.redirect("/")
);

// Kakao Passport 관련 URL
app.get("/auth/kakao", passport.authenticate("kakao"));
app.get(
  "/auth/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/api/v1/users/login",
    failureMessage: true,
  }),
  (req: Request, res: Response) => res.redirect("/")
);

// Naver Passport 관련 URL
app.get("/auth/naver", passport.authenticate("naver"));
app.get(
  "/auth/naver/callback",
  passport.authenticate("naver", {
    failureRedirect: "/api/v1/users/login",
    failureMessage: true,
  }),
  (req: Request, res: Response) => res.redirect("/")
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/mypage", mypageRoute);

app.get("/temp", dummyController);
app.use("/api/v1", mainRouter);

app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/mypage/profile", (req: Request, res: Response) => {
  if (req.session.userId && req.session.email) {
    res.send({
      email: req.session.email,
      birth: req.session.birth,
      name: req.session.name,
      phoneNum: req.session.phoneNum,
    });
  } else {
    res.send({ message: "No session data available" });
  }
});
