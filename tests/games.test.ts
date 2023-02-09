import app from "../src/app";
import supertest from "supertest";
import httpStatus from "http-status";
import prisma from "../src/config/database";
import { createNewGame, unprocessableGame, gameWithConsoleIdInvalid, createValidGameBody } from "./factories/game-factory";
import { createNewConsole } from "./factories/console-factory";

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

describe("GET /games/:id", () => {
    it("should respond with status 404 if no game was found with given id", async () => {
        const response = await api.get("/games/0");
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and the requested game", async () => {
        const newConsole = await createNewConsole();
        const game = await createNewGame(newConsole.id);

        const response = await api.get(`/games/${game.id}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(game);
    });
});

describe("POST /games", () => {
    it("should respond with status 422 when body is not valid", async () => {
        const response = await api.post("/games").send(unprocessableGame);

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("should respond with status 409 if game title is already registered", async () => {
        const newConsole = await createNewConsole();
        const newGame = await createNewGame(newConsole.id);

        const response = await api.post("/games").send({title: newGame.title, consoleId: newGame.consoleId});

        expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it("should respond with status 409 if consoleId does not exist", async () => {
        const response = await api.post("/games").send(gameWithConsoleIdInvalid);

        expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it("should respond with status 201 if game was created with success", async () => {
        const newConsole = await createNewConsole();
        const newGame = createValidGameBody(newConsole.id);

        const response = await api.post("/games").send(newGame);

        expect(response.status).toBe(httpStatus.CREATED);
    });
});