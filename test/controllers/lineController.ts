import { Substitute, SubstituteOf } from "@fluffy-spoon/substitute";
import bodyParser from "body-parser";
import { expect } from "chai";
import express, { Application } from "express";
import { beforeEach, describe, it } from "mocha";
import supertest from "supertest";
import { linePath } from "../../src/consts";
import errorHandlerController from "../../src/controllers/errorHandlerController";
import LineController from "../../src/controllers/lineController";
import BadRequestException from "../../src/exceptions/badRequestException";
import NotFoundException from "../../src/exceptions/notFoundException";
import Line from "../../src/models/line";
import LineService from "../../src/services/lineService";

describe(`LineController`, () => {
    const line = new Line();
    line.id = `someId`;
    line.text = `some text`;
    line.storyId = `storyId`;
    line.userId = `userId`;

    let request: supertest.SuperTest<supertest.Test>;
    let app: Application;
    let lineService: SubstituteOf<LineService>;

    beforeEach(async () => {
        lineService = Substitute.for<LineService>();
        app = express();
        app.use(bodyParser.urlencoded({ extended: true }));
        LineController(app, lineService);
        errorHandlerController(app);
        request = await supertest(app);
    });

    describe(`GET /`, () => {
        it(`should call LineService.getAllLines and return it as an array`, async () => {
            const line1 = new Line();
            line1.id = `someId1`;
            line1.text = `some text1`;
            line1.storyId = `storyId1`;
            line1.userId = `userId1`;

            lineService.getAllLines().returns(Promise.resolve([line, line1]));

            const res = await request.get(`${linePath}/`);
            expect(res.status).to.equal(200);
            expect(res.type).to.equal(`application/json`);
            expect(res.body).to.have.property(`lines`);
            expect(res.body.lines).to.be.an.instanceof(Array);
            expect(res.body.lines.length).to.equal(2);
            expect(res.body.lines[0]).to.deep.equal({
                id: line.id,
                storyId: line.storyId,
                text: line.text,
                userId: line.userId,
            });

            expect(res.body.lines[1]).to.deep.equal({
                id: line1.id,
                storyId: line1.storyId,
                text: line1.text,
                userId: line1.userId,
            });
        });

        it(`should return error if error thrown in the service`, async () => {
            lineService.getAllLines().returns(Promise.reject(new NotFoundException(`No lines found`)));

            const res = await request.get(`${linePath}/`);
            expect(res.status).to.equal(404);
        });
    });

    describe('GET `/:id`', () => {
        it(`should call LineService.getLine and return the line`, async () => {
            lineService.getLine(line.id).returns(Promise.resolve(line));

            const res = await request.get(`${linePath}/${line.id}`)
                .type(`form`);
            expect(res.status).to.equal(200);
            expect(res.type).to.equal(`application/json`);
            expect(res.body).to.deep.equal({
                id: line.id,
                storyId: line.storyId,
                text: line.text,
                userId: line.userId,
            });
        });

        it(`should return error if error thrown in the service`, async () => {
            lineService.getLine(line.id)
                .returns(Promise.reject(new NotFoundException(`Unable to find line with id '${line.id}'`)));

            const res = await request.get(`${linePath}/${line.id}`)
                .type(`form`);
            expect(res.status).to.equal(404);
            expect(res.body).to.deep.equal({ error: `Unable to find line with id 'someId'` });
        });
    });

    describe(`POST /`, () => {
        describe(`should handle missing parameters`, () => {
            it(`should throw if text is missing`, async () => {
                const res = await request
                    .post(`${linePath}/`)
                    .type(`form`)
                    .send({
                        storyId: line.storyId,
                        userId: line.userId,
                    });

                expect(res.status).to.equal(400);
                expect(res.body.error).to.equal(`missing text parameter`);
            });

            it(`should throw if storyId is missing`, async () => {
                const res = await request
                    .post(`${linePath}/`)
                    .type(`form`)
                    .send({
                        text: line.text,
                        userId: line.userId,
                    });

                expect(res.status).to.equal(400);
                expect(res.body.error).to.equal(`missing storyId parameter`);
            });

            it(`should throw if userId is missing`, async () => {
                const res = await request
                    .post(`${linePath}/`)
                    .type(`form`)
                    .send({
                        storyId: line.storyId,
                        text: line.text,
                    });

                expect(res.status).to.equal(400);
                expect(res.body.error).to.equal(`missing userId parameter`);
            });
        });

        it(`should call LineService.createNewLine and return the created line`, async () => {
            lineService.createLine(line.text, line.userId, line.storyId).returns(Promise.resolve(line));

            const res = await request
                .post(`${linePath}/`)
                .type(`form`)
                .send({
                    storyId: line.storyId,
                    text: line.text,
                    userId: line.userId,
                });

            expect(res.status).to.equal(200);
            expect(res.type).to.equal(`application/json`);
            expect(res.body).to.deep.equal({
                id: line.id,
                storyId: line.storyId,
                text: line.text,
                userId: line.userId,
            });
        });

        it(`should return error if error thrown in the service`, async () => {
            lineService.getAllLines().returns(Promise.reject(new BadRequestException(`missing story parameter`)));

            const res = await request.get(`${linePath}/`)
                .type(`form`);
            expect(res.status).to.equal(400);
        });
    });

    describe('DELETE `/:id`', () => {
        it(`should call LineService.deleteLine and return the line`, async () => {
            lineService.deleteLine(line.id).returns(Promise.resolve(line));

            const res = await request.delete(`${linePath}/${line.id}`)
                .type(`form`);
            expect(res.status).to.equal(200);
            expect(res.type).to.equal(`application/json`);
            expect(res.body).to.deep.equal({
                id: line.id,
                storyId: line.storyId,
                text: line.text,
                userId: line.userId,
            });
        });

        it(`should return error if error thrown in the service`, async () => {
            lineService.deleteLine(line.id)
                .returns(Promise.reject(new NotFoundException(`Unable to find line with id '${line.id}'`)));

            const res = await request.delete(`${linePath}/${line.id}`)
                .type(`form`);
            expect(res.status).to.equal(404);
            expect(res.body).to.deep.equal({ error: `Unable to find line with id 'someId'` });
        });
    });

    describe('PUT `/:id`', () => {
        it(`should call LineService.updateLine and return the line`, async () => {
            lineService.updateLine(line.id, line.text, line.userId, line.storyId)
                .returns(Promise.resolve(line));

            const res = await request.put(`${linePath}/${line.id}`)
                .type(`form`)
                .send({
                    storyId: line.storyId,
                    text: line.text,
                    userId: line.userId,
                });
            expect(res.status).to.equal(200);
            expect(res.type).to.equal(`application/json`);
            expect(res.body).to.deep.equal({
                id: line.id,
                storyId: line.storyId,
                text: line.text,
                userId: line.userId,
            });
        });

        it(`should return error if error thrown in the service`, async () => {
            lineService.updateLine(line.id, line.text, line.userId, line.storyId)
                .returns(Promise.reject(new BadRequestException(`no parameters to update`)));

            const res = await request.put(`${linePath}/${line.id}`)
                .type(`form`)
                .send({
                    storyId: line.storyId,
                    text: line.text,
                    userId: line.userId,
                });
            expect(res.status).to.equal(400);
            expect(res.body).to.deep.equal({ error: `no parameters to update` });
        });
    });
});
