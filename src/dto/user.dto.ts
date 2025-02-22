export const signupDTO = (body: any) => {
    return {
      email: body.email,
      password: body.password,
      nickname:body.nickname,
      birth: new Date(body.birth),
      name: body.name,
      phoneNum: body.phoneNum,
      purpose: body.purpose,
      loginMethod: body.loginMethod || "email" 

    };
};

export const loginDTO = (body: any) => {
  return {
    email: body.email,
    password: body.password
  };
};