import axios from "axios";
import { APIError, InvalidInputError, NotFoundError } from "../util/error.js";
import { addImageFood, getImageFood, updateImageFood } from "../repository/image.repository.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// DB(ImageFood)에서 이미지 조회
export const getImageFoodService = async (name: string) => {
    if (name.length === 0) {
        throw new InvalidInputError(
            "입력 값이 비어있습니다.",
            "입력 값: " + name
        );
    }   

    const imageFood = await getImageFood(name);
    return imageFood;
};

// DB(ImageFood)에 이미지 추가
export const addImageFoodService = async (name: string, imageUrl: string) => {
    return await addImageFood({ name: name, imageUrl: imageUrl });
};

// DB(ImageFood)에 이미지 갱신
export const updateImageFoodService = async (imageId: number, imageUrl: string) => {
    await updateImageFood(imageId, imageUrl);
};

// 식재료 이미지 생성
export const createFoodImageService = async (name: string) => {
    try {
        //Naver API를 이용하여 이미지 검색
        const result = await axios.get(
            "https://openapi.naver.com/v1/search/shop.json",
            {
                params: { query: name, display: 4 },
                headers: {
                    "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID, // 환경변수로 설정한 NAVER_CLIENT_ID
                    "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET, // 환경변수로 설정한 NAVER_CLIENT_SECRET
                },
            }
        );
        const searchResult = result.data.items;

        //검색 결과가 없는 경우 에러 처리
        if (searchResult.length === 0)
            throw new NotFoundError(
                "해당 이름을 가진 사진을 찾지 못했습니다.",
                "입력 값: " + name
            );

        const imageUrl = searchResult[searchResult.length - 1].image;

        //검색 결과에서 이미지 url을 추출하여 반환(가장 마지막 이미지 반환)
        return imageUrl;
    } catch (error: any) {
        //정의되지 않은 에러 발생 시 APIError로 처리
        if (error.errorCode == "DATA_NOT_FOUND") {
            throw error;
        }
        throw new APIError("Naver API Error", "입력 값: " + name);
    }
};

// 식단 이미지 생성
export const createMealImageService = async (name: string) => {
    //OpenAI API를 이용하여 이미지 생성
    try {
        const prompt = `한국인 가정의 typical 식단을 보여주는 top-down view 사진. 흰색 원형 세라믹 접시에 담긴 균형 잡힌 식사. 왼쪽부터 오른쪽으로 ${name}. 자연광 아래 깨끗하고 신선한 느낌의 미니멀한 음식 스타일링. 4K 해상도, 음식 사진 스타일.`;

        const result = await axios.post(
            "https://api.openai.com/v1/images/generations",
            {
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const imageUrl = result.data.data[0].url;

        return imageUrl;
    } catch (error: any) {
        //정의되지 않은 에러 발생 시 APIError로 처리
        if (error.errorCode == "DB_PROCESS_ERROR") {
            throw error;
        }
        throw new APIError("OpenAI API Error", "입력 값: " + name);
    }
};

// 생성 이미지 S3 저장
export const addImgS3Service = async (imageUrl: string) => {
    try {
        // 이미지 URL에서 데이터 가져오기
        const response = await axios.get(imageUrl, {
            responseType: "arraybuffer",
        });
        const imageBuffer = Buffer.from(response.data, "binary");

        // S3 객체 선언언
        const s3 = new S3Client({
            region: "ap-northeast-2",
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY || "",
                secretAccessKey: process.env.S3_SECRET_KEY || "",
            },
        });

        const fileKey = "mealimg/" + uuidv4() + Date.now() + ".jpeg";

        const result = await s3.send(
            new PutObjectCommand({
                Bucket: "umc7theatthis",
                Key: fileKey,
                Body: imageBuffer,
                ContentType: "image/jpeg",
            })
        );

        const imageUrlS3 = `https://umc7theatthis.s3.ap-northeast-2.amazonaws.com/${fileKey}`;

        return imageUrlS3;
    } catch (error: any) {
        throw new APIError("File save Error", "입력 값: " + imageUrl);
    }
};
