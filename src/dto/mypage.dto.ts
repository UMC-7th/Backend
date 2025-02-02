export const mypageDTO = (body: any) => {
  return {
    email: body.email,
    birth: new Date(body.birth),
    nickname: body.nickname,
    name: body.name,
    phoneNum: body.phoneNum,
  };
};

export const deleteUserDTO = (body: any) => {
  return {
    id: body.id,
  };
};

export const updateUserDTO = (body: any) => {
    return  {
    nickname: body.nickname,
    name: body.name,
    birth: new Date(body.birth),
    phoneNum: body.phoneNum,
    email: body.email,
  }
};