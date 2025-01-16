import dotenv from "dotenv";
import cors from "cors";
import express, { Request, Response, Express, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";
import { errorMiddleware, successMiddleware } from "./util/middleware.js";
import { dummyController } from "./controller/dummy.controller.js";
import mainRouter from "./routes/index.route.js";
dotenv.config();

const app = express();
const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

const swaggerSpec = YAML.load(path.join(__dirname, "../build/swagger.yaml"));

app.use(successMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.get("/temp", dummyController);
app.use("/api/v1", mainRouter);

app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
