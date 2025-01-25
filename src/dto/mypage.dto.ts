export const mypageDTO = (body: any) => {
    return {
    email: body.email,
    birth: new Date(body.birth),
    name: body.name,
    phoneNum: body.phoneNum,
    };
};
