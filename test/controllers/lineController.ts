import { Substitute, SubstituteOf } from "@fluffy-spoon/substitute";
import bodyParser from "body-parser";
import { expect } from "chai";
import express, { Application } from "express";
import { beforeEach, describe, it } from "mocha";
import supertest from "supertest";
import { linesPath } from "../../src/consts";
import errorHandlerController from "../../src/controllers/errorHandlerController";
import LineController from "../../src/controllers/lineController";
import BadRequestException from "../../src/exceptions/badRequestException";
import NotFoundException from "../../src/exceptions/notFoundException";
import Line from "../../src/models/line";
import Story from "../../src/models/story";
import User from "../../src/models/user";
import LineService from "../../src/services/lineService";

describe(`LineController`, () => {
    let request: supertest.SuperTest<supertest.Test>;
    let app: Application;
    let lineService: SubstituteOf<LineService>;
    let line: Line;

    beforeEach(async () => {
        line = new Line();
        line.id = `someId`;
        line.text = `some text`;
        line.storyId = `storyId`;
        line.userId = `userId`;

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

            const res = await request.get(`${linesPath}/`);
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

            const res = await request.get(`${linesPath}/`);
            expect(res.status).to.equal(404);
        });
    });

    describe('GET `/:id`', () => {
        it(`should call LineService.getLine and return the line`, async () => {
            lineService.getLine(line.id).returns(Promise.resolve(line));

            const res = await request.get(`${linesPath}/${line.id}`)
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

            const res = await request.get(`${linesPath}/${line.id}`)
                .type(`form`);
            expect(res.status).to.equal(404);
            expect(res.body).to.deep.equal({ error: `Unable to find line with id 'someId'` });
        });
    });

    describe(`GET /:id/author`, () => {
        it(`should call lineService.getLine with relations = true`, async () => {
            const user = new User();
            user.id = line.userId;
            user.firstName = `firstName`;
            user.lastName = `lastName`;
            user.email = `email@example.com`;
            line.user = user;

            lineService.getLine(line.id, true).returns(Promise.resolve(line));

            const res = await request.get(`${linesPath}/${line.id}/author`)
                .type(`form`);
            expect(res.status).to.equal(200);
            expect(res.type).to.equal(`application/json`);
            expect(res.body).to.deep.equal(user);
        });

        it(`should return error if error thrown in the service`, async () => {
            lineService.getLine(line.id, true)
                .returns(Promise.reject(new NotFoundException(`Unable to find line with id '${line.id}'`)));

            const res = await request.get(`${linesPath}/${line.id}/author`)
                .type(`form`);
            expect(res.status).to.equal(404);
            expect(res.body).to.deep.equal({ error: `Unable to find line with id 'someId'` });
        });
    });

    describe(`GET /:id/story`, () => {
        it(`should call lineService.getLine with relations = true`, async () => {
            const story = new Story();
            story.id = line.storyId;
            story.name = `nice story name`;
            line.story = story;

            lineService.getLine(line.id, true).returns(Promise.resolve(line));

            const res = await request.get(`${linesPath}/${line.id}/story`)
                .type(`form`);
            expect(res.status).to.equal(200);
            expect(res.type).to.equal(`application/json`);
            expect(res.body).to.deep.equal(story);
        });

        it(`should return error if error thrown in the service`, async () => {
            lineService.getLine(line.id, true)
                .returns(Promise.reject(new NotFoundException(`Unable to find line with id '${line.id}'`)));

            const res = await request.get(`${linesPath}/${line.id}/story`)
                .type(`form`);
            expect(res.status).to.equal(404);
            expect(res.body).to.deep.equal({ error: `Unable to find line with id 'someId'` });
        });
    });

    describe(`POST /`, () => {
        describe(`should handle missing parameters`, () => {
            it(`should throw if text is missing`, async () => {
                const res = await request
                    .post(`${linesPath}/`)
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
                    .post(`${linesPath}/`)
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
                    .post(`${linesPath}/`)
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
                .post(`${linesPath}/`)
                .type(`form`)
                .send({
                    storyId: line.storyId,
                    text: line.text,
                    userId: line.userId,
                });

            expect(res.status).to.equal(201);
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

            const res = await request.get(`${linesPath}/`)
                .type(`form`);
            expect(res.status).to.equal(400);
        });
    });

    describe('DELETE `/:id`', () => {
        it(`should call LineService.deleteLine and return the line`, async () => {
            lineService.removeLine(line.id).returns(Promise.resolve(line));

            const res = await request.delete(`${linesPath}/${line.id}`)
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
            lineService.removeLine(line.id)
                .returns(Promise.reject(new NotFoundException(`Unable to find line with id '${line.id}'`)));

            const res = await request.delete(`${linesPath}/${line.id}`)
                .type(`form`);
            expect(res.status).to.equal(404);
            expect(res.body).to.deep.equal({ error: `Unable to find line with id 'someId'` });
        });
    });

    describe('PUT `/:id`', () => {
        it(`should call LineService.updateLine and return the line`, async () => {
            lineService.updateLine(line.id, line.text, line.userId, line.storyId)
                .returns(Promise.resolve(line));

            const res = await request.put(`${linesPath}/${line.id}`)
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

            const res = await request.put(`${linesPath}/${line.id}`)
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
