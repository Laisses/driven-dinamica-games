import prisma from "../../src/config/database";
import { faker } from '@faker-js/faker';

export const createNewGame = async (consoleId: number) => {
    return prisma.game.create({
        data: {
            title: faker.name.firstName(),
            consoleId
        }
    });
};

export const unprocessableGame = {
    title: faker.datatype.number,
};
