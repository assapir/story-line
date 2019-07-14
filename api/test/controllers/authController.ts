import { Substitute, SubstituteOf } from "@fluffy-spoon/substitute";
import bodyParser from "body-parser";
import { expect } from "chai";
import express, { Application } from "express";
import faker from "faker";
import { beforeEach, describe, it } from "mocha";
import supertest from "supertest";
import AuthController from "../../src/controllers/authController";
import ErrorHandlerController from "../../src/controllers/errorHandlerController";
import NotFoundException from "../../src/exceptions/notFoundException";
import User from "../../src/models/user";
import CryptoService from "../../src/services/cryptoService";
import UserService from "../../src/services/userService";

describe(`AuthController`, () => {
    let request: supertest.SuperTest<supertest.Test>;
    let userService: SubstituteOf<UserService>;
    let cryptoService: SubstituteOf<CryptoService>;
    let app: Application;

    beforeEach(() => {
        app = express();
        app.use(bodyParser.urlencoded({ extended: true }));
        userService = Substitute.for<UserService>();
        cryptoService = Substitute.for<CryptoService>();
        AuthController(app, userService, cryptoService);
        ErrorHandlerController(app);
        request = supertest(app);
    });

    describe(`POST /login`, () => {
        it(`should return error if email isn't supplied `, async () => {
            const result = await request
                .post(`/login`)
                .type(`form`)
                .send({
                    password: `wowWhatAPassword`,
                });

            expect(result.status).to.equal(401);
            expect(result.body.error).to.equal(`password or user are incorrect`);
        });

        it(`should return error if password isn't supplied `, async () => {
            const result = await request
                .post(`/login`)
                .type(`form`)
                .send({
                    email: faker.internet.email,
                });

            expect(result.status).to.equal(401);
            expect(result.body.error).to.equal(`password or user are incorrect`);
        });

        it(`should return error if no such user`, async () => {
            const email = faker.internet.email();
            userService.getUserByEmail(email).returns(Promise.reject(new NotFoundException(`No user found`)));

            const result = await request
                .post(`/login`)
                .type(`form`)
                .send({
                    email,
                    password: `wowWhatAPassword`,
                });

            expect(result.status).to.equal(401);
            expect(result.body.error).to.equal(`password or user are incorrect`);
        });

        it(`should return error if password is incorrect`, async () => {
            const user = new User();
            user.id = faker.random.uuid();
            user.email = faker.internet.email();
            user.password = faker.random.word();
            userService.getUserByEmail(user.email).returns(Promise.resolve(user));
            cryptoService.isPasswordCorrect(user.password, `wowWhatAPassword`).returns(Promise.resolve(false));

            const result = await request
                .post(`/login`)
                .type(`form`)
                .send({
                    email: user.email,
                    password: `wowWhatAPassword`,
                });

            expect(result.status).to.equal(401);
            expect(result.body.error).to.equal(`password or user are incorrect`);
        });

        it(`should return JWT token if password is correct`, async () => {
            const user = new User();
            user.id = faker.random.uuid();
            user.email = faker.internet.email();
            user.password = faker.random.word();
            userService.getUserByEmail(user.email).returns(Promise.resolve(user));
            cryptoService.isPasswordCorrect(user.password, user.password).returns(Promise.resolve(true));
            cryptoService.signJWT(user).mimicks(new CryptoService().signJWT);

            const result = await request
                .post(`/login`)
                .type(`form`)
                .send({
                    email: user.email,
                    password: user.password,
                });

            expect(result.status).to.equal(200);
            expect(result.body).to.have.lengthOf.above(200);
        });
    });
});
