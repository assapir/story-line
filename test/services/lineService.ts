import { assert, expect } from "chai";
import { before, beforeEach, describe, it } from "mocha";
import { Connection, createConnection, Repository } from "typeorm";
import NotFoundException from "../../src/exceptions/notFoundException";
import Line from "../../src/models/line";
import Story from "../../src/models/story";
import User from "../../src/models/user";
import LineService from "../../src/services/lineService";
import { seedDatabase } from "../testHelper";

describe(`LineService`, () => {
    let connection: Connection;
    let repository: Repository<Line>;
    let service: LineService;

    before(() => {
        process.env.NODE_ENV = `test`; // for using test in memory DB
    });

    beforeEach(async () => {
        if (!connection) {
            connection = await createConnection();
        }
        repository = connection.getRepository(Line);
        service = new LineService(repository);
    });

    describe(`without lines in database`, () => {
        describe(`getAllLines`, () => {
            it(`should throw NotFoundException`, async () => {
                try {
                    await service.getAllLines();
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.equal(`No lines found`);
                }
            });
        });
    });

    describe(`with lines in database`, () => {
        let user: User;
        let story: Story;
        let lines: Line[];

        beforeEach(async () => {
            [user, story, lines] = await seedDatabase(connection);
        });

        describe(`getAllLines`, () => {
            it(`should return all lines in the database`, async () => {
                const res = await service.getAllLines();
                expect(res).to.be.instanceOf(Array);
                expect(res.length).to.equal(2);

                const firstLine = res[0];
                expect(firstLine).to.be.instanceof(Line);
                expect(firstLine.id).to.deep.equal(lines[0].id);
                expect(firstLine.text).to.deep.equal(lines[0].text);
                expect(firstLine.userId).to.deep.equal(user.id);
                expect(firstLine.storyId).to.deep.equal(story.id);

                const secondLine = res[1];
                expect(secondLine).to.be.instanceof(Line);
                expect(secondLine.id).to.deep.equal(lines[1].id);
                expect(secondLine.text).to.deep.equal(lines[1].text);
                expect(secondLine.userId).to.deep.equal(user.id);
                expect(secondLine.storyId).to.deep.equal(story.id);
            });
        });
    });
});
