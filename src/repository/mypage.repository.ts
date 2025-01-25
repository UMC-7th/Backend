import { prisma } from "../db.config.js";
import { DBError } from "../util/error.js";

export const findUserProfile = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { userId: userId },  
      select: {
        name: true,        
        email: true,       
        birth: true,       
        phoneNum: true     
      },
    });
    
    return user;
  } catch (error) {
    throw new DBError("사용자 조회 중 오류가 발생했습니다.", error);
  }
};
