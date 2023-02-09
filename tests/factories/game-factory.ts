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

export const gameWithConsoleIdInvalid = {
    title: faker.name.fullName(), consoleId: 0
};

export const createValidGameBody = (consoleId: number) => {
    return {
        title: faker.name.fullName(),
        consoleId
    };
};