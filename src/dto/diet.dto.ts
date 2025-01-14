export  interface DietRequest {
  userId: number; // api 명세서에 없긴한데 일단 추가했음 쿼리로 오는지
  // req.user에 저장할 건지 정해야 할 것 같습니다
  name: string;
  birthday: Date;
  height: number;
  weight: number;
  disease: string; //이건 스트링 배열로 하는게 더 좋아보이는 듯?
}

export const DietRequestDTO = (body: any): DietRequest => {
  return {
    userId: body.userId,
    name: body.name,
    birthday: new Date(body.birthday),
    height: body.height,
    weight: body.weight,
    disease: body.disease, //스트링 배열로 바꿨을때
    //body.disease || [] 로 수정해야함 아마도? 아님말고
  };
};