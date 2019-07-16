import { expect } from "chai";
import { Server } from "http";
import { after, before, beforeEach, describe, it } from "mocha";
import supertest from "supertest";
import { Connection, getConnection } from "typeorm";
import { linesPath, storiesPath, usersPath } from "../src/consts";
import Line from "../src/models/line";
import Story from "../src/models/story";
import User from "../src/models/user";
import { app, startServer } from "../src/server";
import { fillDatabase } from "./testHelper";

describe(`Server integration tests`, () => {
    let connection: Connection;
    let server: Server;

    before(async () => {
        process.env.NODE_ENV = `test`; // for using test in memory DB
        server = await startServer();
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

    it(`should fetch all lines from database`, async () => {
        const result = await request.get(linesPath);
        // tslint:disable-next-line: no-unused-expression
        expect(result.ok).to.be.true;
        expect(result.type).to.equal(`application/json`);
        expect(result.body).to.have.property(`lines`);
        expect(result.body.lines).to.be.an.instanceof(Array);
        expect(result.body.lines).to.have.lengthOf(100);
    });

    describe(`full usage flow`, () => {
        it(`should create user, create story and add lines to it`, async () => {
            let response = await request
                                 .post(`${usersPath}/`)
                                 .type(`form`)
                                 .send({
                                    firstName: `Assaf`,
                                    lastName: `Sapir`,
                                    email: `not-my-mail@not-my-domain.cc`,
                                    password: `password`,
                                });
            const user = response.body as User;
            expect(user).to.not.have.property(`error`);

            response = await request
                             .post(`${storiesPath}/`)
                             .type(`form`)
                             .send({
                                name: `a real story`,
                             });
            const story = response.body as Story;
            expect(story).to.not.have.property(`error`);

            response = await request
                             .post(`${linesPath}/`)
                             .type(`form`)
                             .send({
                                text: `Once upon a time, in a far far away kingdom,`,
                                storyId: story.id,
                                userId: user.id,
                             });
            const firstLine = response.body as Line;
            expect(firstLine).to.not.have.property(`error`);

            response = await request
                             .post(`${linesPath}/`)
                             .type(`form`)
                             .send({
                                text: `their was a prince, a very ugly one`,
                                storyId: story.id,
                                userId: user.id,
                             });
            const secondLine = response.body as Line;
            expect(secondLine).to.not.have.property(`error`);

            response = await request
                             .get(`${storiesPath}/${story.id}`);
            const fullStory = response.body as Story;
            expect(fullStory.lines[0]).to.deep.equal(firstLine);
            expect(fullStory.lines[1]).to.deep.equal(secondLine);
        });
    });
});
