import { Arg, Substitute, SubstituteOf } from "@fluffy-spoon/substitute";
import { expect } from "chai";
import express, { Application } from "express";
import { before, beforeEach, describe, it } from "mocha";
import supertest from "supertest";
import ErrorHandlerController from "../../src/controllers/errorHandlerController";
import AuthMiddleware from "../../src/middleware/authMiddleware";
import CryptoService from "../../src/services/cryptoService";

describe(`authMiddleware`, () => {
    let request: supertest.SuperTest<supertest.Test>;
    let cryptoService: SubstituteOf<CryptoService>;
    let authMiddleware: AuthMiddleware;
    let app: Application;

    describe(`checkJwt`, () => {
        beforeEach(() => {
            cryptoService = Substitute.for<CryptoService>();
            authMiddleware = new AuthMiddleware(cryptoService);
            app = express();
            app.use(authMiddleware.checkJwt);
            app.use((req, res) => { // will be use to verify result
                res.send(200);
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
            cryptoService.verifyJWT(Arg.any()).returns({isValid: false, email: ``, id: ``});
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
});
