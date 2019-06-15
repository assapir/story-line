import { Substitute, SubstituteOf } from '@fluffy-spoon/substitute';
import { expect } from 'chai';
import express, { Application } from "express";
import { beforeEach, describe, it } from "mocha";
import supertest from "supertest";
import LineController from "../../src/controllers/lineController";
import Line from '../../src/models/line';
import { apiVersion, prefix } from '../../src/router';
import LineService from "../../src/services/lineService";

describe(`LineController`, () => {
    const path = `/${prefix}/${apiVersion}/lines`;
    let request: supertest.SuperTest<supertest.Test>;
    let app: Application;
    let lineService: SubstituteOf<LineService>;

    beforeEach(() => {
        lineService = Substitute.for<LineService>();
        app = express();
        LineController(app, lineService);
        request = supertest(app);
    });

    describe(`GET /`, () => {
        it(`should call LineService.getAllLines`, async () => {
            const line = new Line();
            line.id = `someId`;
            line.text = `some text`;
            line.storyId = `storyId`;
            line.userId = `userId`;

            lineService.getAllLines().returns(Promise.resolve([line]));

            const res = await request.get(`${path}/`);
            expect(res.status).to.equal(200);
            expect(res.type).to.equal(`application/json`);
            expect(res.body).to.have.property(`lines`);
            expect(res.body.lines).to.be.an.instanceof(Array);
            expect(res.body.lines.length).to.equal(1);
            expect(res.body.lines[0]).to.deep.equal({
                id: line.id,
                storyId: line.storyId,
                text: line.text,
                userId: line.userId,
            });
        });
    });
});
