import axios from "axios";
import { APIError, InvalidInputError, NotFoundError } from "../util/error.js";
import { addImageFood, getImageFood } from "../repository/image.repository.js";

// 음식 이미지 생성
export const createFoodImageService = async (name: string) => {
    if (name.length === 0) {
        throw new InvalidInputError("입력 값이 비어있습니다.", "입력 값: " + name);
    }

    // 이미지가 존재하는 경우 DB에서 가져와서 반환
    const imageFood = await getImageFood(name);
    if(imageFood !== null){
        return imageFood.imageUrl;
    }
    
    try {
        //Naver API를 이용하여 이미지 검색
        const result = await axios.get(
          "https://openapi.naver.com/v1/search/shop.json",
          {
            params: { query: name, display: 4 },
            headers: {
              'X-Naver-Client-Id':
              process.env.NAVER_CLIENT_ID,  // 환경변수로 설정한 NAVER_CLIENT_ID
              'X-Naver-Client-Secret':
              process.env.NAVER_CLIENT_SECRET,  // 환경변수로 설정한 NAVER_CLIENT_SECRET
            },
          }
        );
        const searchResult = result.data.items;

        //검색 결과가 없는 경우 에러 처리
        if(searchResult.length === 0)
          throw new NotFoundError("해당 이름을 가진 사진을 찾지 못했습니다.", "입력 값: " + name);

        const imageUrl = searchResult[searchResult.length-1].image;
        //검색 결과를 DB에 저장
        const imageFood = await addImageFood({ name: name, imageUrl: imageUrl });

        //검색 결과에서 이미지 url을 추출하여 반환(가장 마지막 이미지 반환)
        return imageFood.imageUrl;
    
      } catch (error: any) {
        //정의되지 않은 에러 발생 시 APIError로 처리
        if(error.errorCode == "DATA_NOT_FOUND" || error.errorCode == "DB_PROCESS_ERROR"){
          throw error;
        }
        throw new APIError("Naver API Error", "입력 값: " + name);
      }
}