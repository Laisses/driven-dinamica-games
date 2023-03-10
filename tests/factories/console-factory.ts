import prisma from "../../src/config/database";
import { faker } from '@faker-js/faker';

export const createNewConsole = async () => {
    return prisma.console.create({
        data: {
            name: faker.name.firstName()
        }
    });
};

export const unprocessableConsole = {
    name: true,
};

export const newConsole = {
    name: faker.name.firstName()
};
