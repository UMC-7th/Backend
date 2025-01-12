//dummy Request DTO
export const dummyRequestDTO = (body: any) => {
    return {
        name: body.name
    };
}

//dummy Reponse DTO
export const dummyResponseDTO = (body: any) => {
    return {
        id: body.id,
        name: body.name
    };
}