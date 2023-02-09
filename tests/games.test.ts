import app from "../src/app";
import supertest from "supertest";
import httpStatus from "http-status";
import prisma from "../src/config/database";
import { createNewGame } from "./factories/game-factory";
import { createNewConsole, unprocessableConsole, newConsole } from "./factories/console-factory";

const api = supertest(app);

beforeAll(async () => {
    await prisma.game.deleteMany({});
});

describe("GET /games", () => {
    it("should respond with status 200 and an empty list of games if database is empty", async () => {
        const response = await api.get("/games");

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([]);
    });

    it("should respond with 200 and a list of games", async () => {
        const newConsole = await createNewConsole();
        const game = await createNewGame(newConsole.id);
        const response = await api.get("/games");

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([{...game, Console: newConsole}]);
    });
});