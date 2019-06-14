import { expect } from "chai";
import express, { Application } from "express";
import { beforeEach, describe, it } from "mocha";
import supertest from "supertest";
import ErrorHandlerController from "../../src/controllers/errorHandlerController";
import { setSimulateError } from "./testHelper";

describe(`ErrorHandlerController`, () => {
    let request: supertest.SuperTest<supertest.Test>;
    let app: Application;

    describe(`NotFoundError`, () => {

        beforeEach(() => {
            app = express();
            ErrorHandlerController(app);
            request = supertest(app);
        });

        describe(`should handle unknown paths, set status to 404 and message`, () => {
            it(`GET`, async () => {
                const res = await request.get(`/unknown/path`);

                expect(res.status).to.equal(404);
                expect(res.type).to.equal(`application/json`);
                expect(res.text).to.equal(JSON.stringify({
                    error: `Unable to find resource /unknown/path`,
                }));
            });

            it(`POST`, async () => {
                const res = await request.post(`/unknown/path`);

                expect(res.status).to.equal(404);
                expect(res.type).to.equal(`application/json`);
                expect(res.text).to.equal(JSON.stringify({
                    error: `Unable to find resource /unknown/path`,
                }));
            });

            it(`PUT`, async () => {
                const res = await request.put(`/unknown/path`);

                expect(res.status).to.equal(404);
                expect(res.type).to.equal(`application/json`);
                expect(res.text).to.equal(JSON.stringify({
                    error: `Unable to find resource /unknown/path`,
                }));
            });

            it(`DELETE`, async () => {
                const res = await request.delete(`/unknown/path`);

                expect(res.status).to.equal(404);
                expect(res.type).to.equal(`application/json`);
                expect(res.text).to.equal(JSON.stringify({
                    error: `Unable to find resource /unknown/path`,
                }));
            });

            it(`PATCH`, async () => {
                const res = await request.patch(`/unknown/path`);

                expect(res.status).to.equal(404);
                expect(res.type).to.equal(`application/json`);
                expect(res.text).to.equal(JSON.stringify({
                    error: `Unable to find resource /unknown/path`,
                }));
            });
        });
    });

    describe(`InternalError`, () => {
        const path = `/any/path`;
        const message = `Very angry error message`;

        beforeEach(() => {
            app = express();
            setSimulateError(app, path, new Error(message));
            ErrorHandlerController(app);
            request = supertest(app);
        });

        it(`should return 500 error with correct message`, async () => {
            const res = await request.get(path);

            expect(res.status).to.equal(500);
            expect(res.type).to.equal(`application/json`);
            expect(res.text).to.equal(JSON.stringify({
                error: message,
            }));
        });
    });
});
