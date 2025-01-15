import axios from "axios";

// 음식 이미지 생성
export const createFoodImageService = async (name: string) => {
    try {
        //Naver API를 이용하여 이미지 검색
        const result = await axios.get(
          "https://openapi.naver.com/v1/search/shop.json",
          {
            params: { query: name, display: 5 },
            headers: {
              'X-Naver-Client-Id':
              process.env.NAVER_CLIENT_ID,  // 환경변수로 설정한 NAVER_CLIENT_ID
              'X-Naver-Client-Secret':
              process.env.NAVER_CLIENT_SECRET,  // 환경변수로 설정한 NAVER_CLIENT_SECRET
            },
          }
        );
        //검색 결과에서 이미지 url을 추출하여 반환
        return result.data.items[3].image;
    
      } catch (error) {
        throw new Error("이미지 생성 실패");
      }
}