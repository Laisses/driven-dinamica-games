import app from "../src/app";
import supertest from "supertest";
import httpStatus from "http-status";
import prisma from "../src/config/database";
import { createNewConsole } from "./factories/console-factory";

const api = supertest(app);

beforeAll(async () => {
    await prisma.console.deleteMany({});
});

describe("GET /consoles", () => {
    it("should respond with status 200 and an empty list of consoles if database is empty", async () => {
        const response = await api.get("/consoles");

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and a list of consoles", async () => {
        const console = await createNewConsole();
        const response = await api.get("/consoles");

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([console]);
    });
});

describe("GET /consoles/:id", () => {
    it("should respond with status 404 if no console was found with given id", async () => {
        const response = await api.get("/consoles/0");

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and an console", async () => {
        const console = await createNewConsole();
        const response = await api.get(`/consoles/${console.id}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(console);
    });
});
