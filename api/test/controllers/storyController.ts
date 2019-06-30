import Substitute, { SubstituteOf } from "@fluffy-spoon/substitute";
import bodyParser from "body-parser";
import { expect } from "chai";
import express, { Application } from "express";
import faker from "faker";
import { beforeEach, describe, it } from "mocha";
import supertest from "supertest";
import { storiesPath } from "../../src/consts";
import ErrorHandlerController from "../../src/controllers/errorHandlerController";
import StoryController from "../../src/controllers/storyController";
import BadRequestException from "../../src/exceptions/badRequestException";
import NotFoundException from "../../src/exceptions/notFoundException";
import Line from "../../src/models/line";
import Story from "../../src/models/story";
import StoryService from "../../src/services/storyService";

describe(`StoryController`, () => {
    let request: supertest.SuperTest<supertest.Test>;
    let app: Application;
    let storyService: SubstituteOf<StoryService>;
    let story: Story;

    const line = new Line();
    line.id = faker.random.uuid();
    const line1 = new Line();
    line1.id = faker.random.uuid();

    beforeEach(async () => {
        story = new Story();
        story.id = faker.random.uuid();
        story.name = faker.lorem.text();
        story.lines = [line, line1];

        storyService = Substitute.for<StoryService>();
        app = express();
        app.use(bodyParser.urlencoded({ extended: true }));
        StoryController(app, storyService);
        ErrorHandlerController(app);
        request = supertest(app);
    });

    describe(`GET /`, () => {
        it(`should call StoryService.getAllStories and return it as an array`, async () => {
            const story1 = new Story();
            story1.id = faker.random.uuid();
            story1.name = faker.lorem.text();

            storyService.getAllStories().returns(Promise.resolve([story, story1]));

            const result = await request.get(`${storiesPath}/`).type(`form`);
            expect(result.status).to.equal(200);
            expect(result.type).to.equal(`application/json`);
            expect(result.body).to.have.property(`stories`);
            expect(result.body.stories).to.be.an.instanceof(Array);
            expect(result.body.stories.length).to.equal(2);

            expect(result.body.stories[0]).to.deep.equal(story);
            expect(result.body.stories[1]).to.deep.equal(story1);
        });

        it(`should return error if error thrown in the service`, async () => {
            storyService.getAllStories().returns(Promise.reject(new NotFoundException(`No stories found`)));

            const result = await request.get(`${storiesPath}/`).type(`form`);
            expect(result.status).to.equal(404);
        });
    });

    describe(`GET /:id`, () => {
        it(`should call StoryService.getStory and return the story with that id`, async () => {
            storyService.getStory(story.id).returns(Promise.resolve(story));

            const result = await request.get(`${storiesPath}/${story.id}`).type(`form`);
            expect(result.status).to.equal(200);
            expect(result.type).to.equal(`application/json`);
            expect(result.body).to.deep.equal(story);
        });

        it(`should return error if error thrown in the service`, async () => {
            storyService
                .getStory(`some-id`)
                .returns(Promise.reject(new NotFoundException(`Unable to find story with id 'some-id'`)));

            const result = await request.get(`${storiesPath}/some-id`).type(`form`);
            expect(result.status).to.equal(404);
        });
    });

    describe(`POST /`, () => {
        it(`should call StoryService.createStory and return the created story`, async () => {
            const story1 = new Story();
            story1.id = faker.random.uuid();
            story1.name = faker.lorem.text();
            storyService.createStory(story1.name).returns(Promise.resolve(story1));

            const result = await request.post(`${storiesPath}/`).type(`form`).send({
                name: story1.name,
            });
            expect(result.status).to.equal(200);
            expect(result.type).to.equal(`application/json`);
            expect(result.body).to.deep.equal(story1);
        });

        it(`should return error if error thrown in the service`, async () => {
            storyService
                .createStory(``)
                .returns(Promise.reject(new BadRequestException(`missing name parameter`)));

            const result = await request.post(`${storiesPath}/`).type(`form`).send({
                name: ``,
            });
            expect(result.status).to.equal(400);
        });
    });

    describe(`PUT /:id`, () => {
        it(`should call StoryService.updateStoryName and return the updated story`, async () => {
            const newName = faker.lorem.words(4);
            storyService
                .updateStoryName(story.id, newName)
                .returns(Promise.resolve(story));

            const result = await request.put(`${storiesPath}/${story.id}`).type(`form`).send({
                name: newName,
            });
            expect(result.status).to.equal(200);
            expect(result.type).to.equal(`application/json`);
            expect(result.body).to.deep.equal(story);
        });

        it(`should return error if error thrown in the service`, async () => {
            storyService
                .updateStoryName(story.id, ``)
                .returns(Promise.reject(new BadRequestException(`missing name parameter`)));

            const result = await request.put(`${storiesPath}/${story.id}`).type(`form`).send({
                name: ``,
            });
            expect(result.status).to.equal(400);
        });
    });

    describe(`DELETE /:id`, () => {
        it(`should call StoryService.deleteStory and return the deleted story`, async () => {
            storyService
                .deleteStory(story.id)
                .returns(Promise.resolve(story));

            const result = await request.delete(`${storiesPath}/${story.id}`).type(`form`);
            expect(result.status).to.equal(200);
            expect(result.type).to.equal(`application/json`);
            expect(result.body).to.deep.equal(story);
        });

        it(`should return error if error thrown in the service`, async () => {
            storyService
                .deleteStory(`not-real-id`)
                .returns(Promise.reject(new NotFoundException(`Unable to find story with id 'not-real-id'`)));

            const result = await request.delete(`${storiesPath}/not-real-id`).type(`form`);
            expect(result.status).to.equal(404);
        });
    });

    describe(`DELETE /:id/lines`, () => {
        it(`should call StoryService.resetStory and return the updated story`, async () => {
            const story1 = new Story();
            story1.id = faker.random.uuid();
            story1.name = faker.lorem.text();

            storyService
                .resetStory(story1.id)
                .returns(Promise.resolve(story1));

            const result = await request.delete(`${storiesPath}/${story1.id}/lines`).type(`form`);
            expect(result.status).to.equal(200);
            expect(result.type).to.equal(`application/json`);
            expect(result.body).to.deep.equal(story1);
        });

        it(`should return error if error thrown in the service`, async () => {
            storyService
                .resetStory(`not-real-id`)
                .returns(Promise.reject(new NotFoundException(`Unable to find story with id 'not-real-id'`)));

            const result = await request.delete(`${storiesPath}/not-real-id/lines`).type(`form`);
            expect(result.status).to.equal(404);
        });
    });
});
