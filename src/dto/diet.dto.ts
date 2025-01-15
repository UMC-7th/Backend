export interface DietRequest {
  userId: number; // api 명세서에 없긴한데 일단 추가했음 쿼리로 오는지
  // req.user에 저장할 건지 정해야 할 것 같습니다
  mealDate: Date;
}

export const DietRequestDTO = (body: any): DietRequest => {
  return {
    userId: body.userId,
    mealDate: new Date(body.mealDate),
  };
};
