import { prisma } from "../db.config.js";

//add Dummy
export const addDummy = async (name: string) => {
    const dummy = await prisma.dummy.create({ data: { name: name } });
    return dummy.id;
};

//get Dummy
export const getDummy = async (duumyId: number) => {
    const dummy = await prisma.dummy.findFirst({ where: { id: duumyId } });
    return dummy;
};