export const signupDTO = (body: any) => {
    return {
      email: body.email,
      password: body.password,
      birth: new Date(body.birth),
      name: body.name,
      phoneNum: body.phoneNum,
      purpose: body.purpose,
      isSub: body.isSub,
      address: body.address
    };
};