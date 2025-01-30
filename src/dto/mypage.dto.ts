export const mypageDTO = (body: any) => {
    return {
    email: body.email,
    birth: new Date(body.birth),
    nickname: body.nickname,
    name: body.name,
    phoneNum: body.phoneNum,
    };
};

export const deleteUserDTO = (body : any) => {
    return {
        id : body.id
    }
}
