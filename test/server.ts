import { expect } from "chai";
import { after, before, beforeEach, describe, it } from "mocha";
import supertest from "supertest";
import { Connection, getConnection } from "typeorm";
import { usersPath } from "../src/consts";
import { app, server, startServer } from "../src/server";
import { fillDatabase } from "./testHelper";

describe(`Server integration tests`, () => {
    let connection: Connection;

    before(async () => {
        process.env.NODE_ENV = `test`; // for using test in memory DB
        await startServer();
    });

    after(async () => {
        if (connection && connection.isConnected) {
            await connection.close();
        }
        await server.close(); // close the server after we finish the tests
    });

    let request: supertest.SuperTest<supertest.Test>;
    beforeEach(async () => {
        connection = getConnection();
        await fillDatabase(connection, 100);
        request = await supertest(app);
    });

    it(`should fetch all users from database`, async () => {
        const result = await request.get(usersPath);
        // tslint:disable-next-line: no-unused-expression
        expect(result.ok).to.be.true;
        expect(result.type).to.equal(`application/json`);
        expect(result.body).to.have.property(`users`);
        expect(result.body.users).to.be.an.instanceof(Array);
        expect(result.body.users).to.have.lengthOf(100);
    });
});
