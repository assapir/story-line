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
        userService = Substitute.for<UserService>();
        cryptoService = Substitute.for<CryptoService>();
        app = express();
        app.use(bodyParser.urlencoded({ extended: true }));
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
            const email = faker.internet.email();
            const user = Substitute.for<User>();
            user.isPasswordCorrect(`wowWhatAPassword`).returns(Promise.resolve(false));
            userService.getUserByEmail(email).returns(Promise.resolve(user));

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

        it(`should return JWT token if password is correct`, async () => {
            const email = faker.internet.email();
            const user = Substitute.for<User>();
            user.isPasswordCorrect(`password`).returns(Promise.resolve(true));
            userService.getUserByEmail(email).returns(Promise.resolve(user));
            cryptoService.signJWT({isValid: true, email: user.email, id: user.id})
                .mimicks(new CryptoService().signJWT);

            const result = await request
                .post(`/login`)
                .type(`form`)
                .send({
                    email,
                    password: `password`,
                });

            expect(result.status).to.equal(200);
            const split = result.body.split(`.`);
            expect(split).to.have.lengthOf(3);
        });
    });
});
