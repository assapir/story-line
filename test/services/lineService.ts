import { assert, expect } from "chai";
import faker from "faker";
import { before, beforeEach, describe, it } from "mocha";
import { Connection, createConnection, Repository } from "typeorm";
import BadRequestException from "../../src/exceptions/badRequestException";
import NotFoundException from "../../src/exceptions/notFoundException";
import Line from "../../src/models/line";
import Story from "../../src/models/story";
import User from "../../src/models/user";
import LineService from "../../src/services/lineService";
import { getStoryById, getUserById, seedDatabase, seedStory, seedUser } from "../testHelper";

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

        describe(`getLine`, () => {
            it(`should throw NotFoundException`, async () => {
                try {
                    await service.getLine(`not existing Id`);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.equal(`Unable to find line with id 'not existing Id'`);
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

        describe(`getLine`, () => {
            it(`should throw if the 'id' parameter wasn't supplied`, async () => {
                try {
                    await service.getLine(``);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing id parameter`);
                }
            });

            it(`should throw if id is not in the DB`, async () => {
                try {
                    await service.getLine(`not-in-db-id`);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.be.equal(`Unable to find line with id 'not-in-db-id'`);
                }
            });

            it(`should return the correct line matching id parameter`, async () => {
                const result = await service.getLine(lines[1].id);
                expect(result).to.be.instanceOf(Line);
                expect(result.id).to.deep.equal(lines[1].id);
                expect(result.text).to.deep.equal(lines[1].text);
                expect(result.userId).to.deep.equal(user.id);
                expect(result.storyId).to.deep.equal(story.id);
            });
        });

        describe(`createLine`, () => {
            it(`should throw if text parameter is missing`, async () => {
                try {
                    await service.createLine(``, user.id, story.id);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing text parameter`);
                }
            });

            it(`should throw if userId parameter is missing`, async () => {
                try {
                    await service.createLine(`some very nice text`, ``, story.id);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing userId parameter`);
                }
            });

            it(`should throw if storyId parameter is missing`, async () => {
                try {
                    await service.createLine(`some very nice text`, user.id, ``);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing storyId parameter`);
                }
            });

            it(`should throw if userId parameter is not exist in DB`, async () => {
                try {
                    await service.createLine(`some very nice text`, `not-real-user-id`, story.id);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`some parameters are incorrect`);
                }
            });

            it(`should throw if storyId parameter is not exist in DB`, async () => {
                try {
                    await service.createLine(`some very nice text`, user.id, `not-real-story-id`);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`some parameters are incorrect`);
                }
            });

            it(`should save the passed text to the correct user and story`, async () => {
                const text = `very important text`;
                const result = await service.createLine(text, user.id, story.id);
                expect(result).to.be.instanceOf(Line);
                expect(result.storyId).to.equal(story.id);
                expect(result.userId).to.equal(user.id);

                user = await getUserById(connection, user.id);
                expect(user.lines.length).to.be.equal(3);
                expect(user.lines[2].text).to.be.equal(text);

                story = await getStoryById(connection, story.id);
                expect(story.lines.length).to.be.equal(3);
                expect(story.lines[2].text).to.be.equal(text);
            });
        });

        describe(`removeLine`, () => {
            it(`should throw if id parameter is missing`, async () => {
                try {
                    await service.removeLine(``);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing id parameter`);
                }
            });

            it(`should throw if id parameter is not presented in DB`, async () => {
                try {
                    await service.removeLine(`not-real-id`);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.be.equal(`Unable to find line with id 'not-real-id'`);
                }
            });

            it(`should remove the line from DB, user and story`, async () => {
                const result = await service.removeLine(lines[0].id);
                expect(result).to.be.instanceOf(Line);
                expect(result.id).to.be.equal(undefined); // removed raw doesn't have id

                user = await getUserById(connection, user.id);
                expect(user.lines.length).to.be.equal(1);

                story = await getStoryById(connection, story.id);
                expect(story.lines.length).to.be.equal(1);
            });
        });

        describe(`updateLine`, () => {
            it(`should throw if id parameter is missing`, async () => {
                try {
                    await service.updateLine(``, `nice text`, user.id, story.id);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing id parameter`);
                }
            });

            it(`should throw if id parameter is not presented in DB`, async () => {
                try {
                    await service.updateLine(`not-real-id`, `nice text`, user.id, story.id);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.be.equal(`Unable to find line with id 'not-real-id'`);
                }
            });

            it(`should throw if text, storyId or userId parameters are missing`, async () => {
                try {
                    await service.updateLine(lines[0].id, ``, ``, ``);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`no parameters to update`);
                }
            });

            it(`should update text if only text was passed`, async () => {
                const result = await service.updateLine(lines[0].id, `nice text`, ``, ``);
                expect(result).to.be.instanceOf(Line);
                expect(result.id).to.equal(lines[0].id);
                expect(result.text).to.not.equal(lines[0].text);
                expect(result.text).to.equal(`nice text`);
                expect(result.storyId).to.equal(story.id);
                expect(result.userId).to.equal(user.id);
            });

            it(`should update userId if only userId was passed`, async () => {
                let user1 = await seedUser(connection.createQueryRunner());

                const result = await service.updateLine(lines[0].id, ``, user1.id, ``);
                expect(result).to.be.instanceOf(Line);
                expect(result.id).to.equal(lines[0].id);
                expect(result.userId).to.equal(user1.id);
                expect(result.storyId).to.equal(story.id);

                user = await getUserById(connection, user.id);
                expect(user.lines.length).to.be.equal(1);
                user1 = await getUserById(connection, user1.id);
                expect(user1.lines.length).to.be.equal(1);
                expect(user1.lines[0].id).to.equal(lines[0].id);
            });

            it(`should update storyId if only storyId was passed`, async () => {
                let story1 = await seedStory(connection.createQueryRunner());

                const result = await service.updateLine(lines[0].id, ``, ``, story1.id);
                expect(result).to.be.instanceOf(Line);
                expect(result.id).to.equal(lines[0].id);
                expect(result.userId).to.equal(user.id);
                expect(result.storyId).to.equal(story1.id);

                story = await getStoryById(connection, story.id);
                expect(story.lines.length).to.be.equal(1);
                story1 = await getStoryById(connection, story1.id);
                expect(story1.lines.length).to.be.equal(1);
                expect(story1.lines[0].id).to.equal(lines[0].id);
            });

            it(`should update everything if everything was passed`, async () => {
                const queryRunner = connection.createQueryRunner();
                let story1 = await seedStory(queryRunner);
                let user1 = await seedUser(queryRunner);
                const text = faker.lorem.sentence(7);

                const result = await service.updateLine(lines[0].id, text, user1.id, story1.id);
                expect(result).to.be.instanceOf(Line);
                expect(result.id).to.equal(lines[0].id);
                expect(result.userId).to.equal(user1.id);
                expect(result.storyId).to.equal(story1.id);

                story = await getStoryById(connection, story.id);
                expect(story.lines.length).to.be.equal(1);
                story1 = await getStoryById(connection, story1.id);
                expect(story1.lines.length).to.be.equal(1);
                expect(story1.lines[0].id).to.equal(lines[0].id);

                user = await getUserById(connection, user.id);
                expect(user.lines.length).to.be.equal(1);
                user1 = await getUserById(connection, user1.id);
                expect(user1.lines.length).to.be.equal(1);
                expect(user1.lines[0].id).to.equal(lines[0].id);
            });
        });
    });
});
