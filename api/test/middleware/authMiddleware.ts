import { Arg, Substitute, SubstituteOf } from "@fluffy-spoon/substitute";
import { expect } from "chai";
import express, { Application } from "express";
import faker from "faker";
import { beforeEach, describe, it } from "mocha";
import supertest from "supertest";
import ErrorHandlerController from "../../src/controllers/errorHandlerController";
import NotFoundException from "../../src/exceptions/notFoundException";
import AuthMiddleware from "../../src/middleware/authMiddleware";
import User, { Role } from "../../src/models/user";
import CryptoService, { IPayLoad } from "../../src/services/cryptoService";
import UserService from "../../src/services/userService";

describe(`authMiddleware`, () => {
    let request: supertest.SuperTest<supertest.Test>;
    let cryptoService: SubstituteOf<CryptoService>;
    let userService: SubstituteOf<UserService>;
    let authMiddleware: AuthMiddleware;
    let app: Application;

    describe(`checkToken`, () => {
        beforeEach(() => {
            cryptoService = Substitute.for<CryptoService>();
            userService = Substitute.for<UserService>();
            authMiddleware = new AuthMiddleware(cryptoService, userService);
            app = express();
            app.use(authMiddleware.checkToken);
            app.use((req, res) => { // will be use to verify result
                res.sendStatus(200);
            });
            ErrorHandlerController(app);
            request = supertest(app);
        });

        it(`should throw if no 'authorization' header`, async () => {
            const result = await request.get(`/somePath`);
            expect(result.status).to.equal(401);
            expect(result.body.error).to.equal(`no authorization header`);
        });

        it(`should throw if 'authorization' header doesn't contains two parts`, async () => {
            const result = await request.get(`/somePath`).set(`authorization`, `Bearer`);
            expect(result.status).to.equal(401);
            expect(result.body.error).to.equal(`authorization header should be 'Bearer' and the JWT Token`);
        });

        it(`should throw if 'authorization' header doesn't contains 'Bearer'`, async () => {
            const result = await request.get(`/somePath`).set(`authorization`, `bearer someToken`);
            expect(result.status).to.equal(401);
            expect(result.body.error).to.equal(`only Bearer auth is supported`);
        });

        it(`should throw if the token isn't valid`, async () => {
            cryptoService.verifyJWT(Arg.any()).returns({ isValid: false, email: ``, id: `` });
            const result = await request.get(`/somePath`).set(`authorization`, `Bearer someToken`);
            expect(result.status).to.equal(401);
            expect(result.body.error).to.equal(`token is invalid`);
        });

        it(`should renew the token if it's valid`, async () => {
            const payload = { isValid: true, email: `email@email.com`, id: `guid` };
            cryptoService.verifyJWT(Arg.any()).returns(payload);
            cryptoService.signJWT(payload).returns(`newToken`);
            const result = await request.get(`/somePath`).set(`authorization`, `Bearer someToken`);
            expect(result.header[`authorization`]).to.equal(`Bearer newToken`);
        });
    });

    describe(`checkRole`, () => {
        function init(payload: IPayLoad, addToken: boolean = true, role: Role = Role.ADMIN) {
            cryptoService = Substitute.for<CryptoService>();
            userService = Substitute.for<UserService>();
            authMiddleware = new AuthMiddleware(cryptoService, userService);
            app = express();
            app.use((req, res, next) => {
                if (addToken) {
                    res.locals.jwtPayload = payload;
                }
                next();
            });
            app.use(authMiddleware.checkRole(role));
            app.use((req, res) => { // will be use to verify result
                res.sendStatus(200);
            });
            ErrorHandlerController(app);
            request = supertest(app);
        }

        it(`should throw if no token in res.locals`, async () => {
            init({ isValid: false, id: ``, email: `` }, false);
            const result = await request.get(`/somePath`);
            expect(result.status).to.equal(401);
            expect(result.body.error).to.equal(`no token`);
        });

        it(`should throw if the token is invalid`, async () => {
            init({ isValid: false, id: ``, email: `` });
            const result = await request.get(`/somePath`);
            expect(result.status).to.equal(401);
            expect(result.body.error).to.equal(`token is invalid`);
        });

        it(`should throw if the id is missing`, async () => {
            init({ isValid: true, id: ``, email: `` });
            const result = await request.get(`/somePath`);
            expect(result.status).to.equal(401);
            expect(result.body.error).to.equal(`token has no user id`);
        });

        it(`should throw the original error if other error thrown inside`, async () => {
            const id = faker.random.uuid();
            init({ isValid: true, id, email: `` });
            userService.getUser(id).returns(Promise.reject(new Error(`blip blip`)));

            const result = await request.get(`/somePath`);
            expect(result.status).to.equal(500);
            expect(result.body.error).to.equal(`blip blip`);
        });

        it(`should throw if user can't be found`, async () => {
            const id = faker.random.uuid();
            init({ isValid: true, id, email: `` });
            userService.getUser(id).returns(Promise.reject(new NotFoundException()));

            const result = await request.get(`/somePath`);
            expect(result.status).to.equal(401);
            expect(result.body.error).to.equal(`user is invalid`);
        });

        it(`should throw if user don't have this role`, async () => {
            const user = new User();
            user.id = faker.random.uuid();
            user.role = Role.USER;

            init({ isValid: true, id: user.id, email: `` });
            userService.getUser(user.id).returns(Promise.resolve(user));

            const result = await request.get(`/somePath`);
            expect(result.status).to.equal(403);
            expect(result.body.error).to.equal(`user in not allowed to access '/somePath'`);
        });

        it(`should call the next router if user is admin`, async () => {
            const user = new User();
            user.id = faker.random.uuid();
            user.role = Role.ADMIN;

            init({ isValid: true, id: user.id, email: `` });
            userService.getUser(user.id).returns(Promise.resolve(user));

            const result = await request.get(`/somePath`);
            expect(result.status).to.equal(200);
        });

        it(`should call the next router if user is allowed`, async () => {
            const user = new User();
            user.id = faker.random.uuid();
            user.role = Role.ADMIN;

            init({ isValid: true, id: user.id, email: `` }, undefined, Role.USER);
            userService.getUser(user.id).returns(Promise.resolve(user));

            const result = await request.get(`/somePath`);
            expect(result.status).to.equal(200);
        });
    });
});
