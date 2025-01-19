export const bodyToUser = (body: any) => {
    return {
      userId: body.userId,
      email: body.email,
      password: body.password,
      birth: new Date(body.birth),
      name: body.name,
      phoneNum: body.phoneNum,
      purpose: body.purpose,
      address: body.address
    };
};