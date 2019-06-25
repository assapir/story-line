import { expect } from "chai";
import faker from "faker";
import { after, before, beforeEach, describe, it } from "mocha";
import { Connection, createConnection, Repository } from "typeorm";
import BadRequestException from "../../src/exceptions/badRequestException";
import NotAllowedException from "../../src/exceptions/notAllowedException";
import NotFoundException from "../../src/exceptions/notFoundException";
import Line from "../../src/models/line";
import Story from "../../src/models/story";
import User from "../../src/models/user";
import StoryService from "../../src/services/storyService";
import { failIfReached, seedDatabase, seedStory } from "../testHelper";

describe(`StoryService`, () => {
    let connection: Connection;
    let repository: Repository<Story>;
    let service: StoryService;

    before(() => {
        process.env.NODE_ENV = `test`; // for using test in memory DB
    });

    after(async () => {
        if (connection && connection.isConnected) {
            await connection.close();
        }
    });

    beforeEach(async () => {
        if (!connection || !connection.isConnected) {
            connection = await createConnection();
        }
        repository = connection.getRepository(Story);
        service = new StoryService(repository);
    });

    describe(`without stories in the database`, () => {
        describe(`getAllStories`, () => {
            it(`should throw NotFoundException`, async () => {
                try {
                    await service.getAllStories();
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.equal(`No stories found`);
                }
            });
        });

        describe(`getStory`, () => {
            it(`should throw NotFoundException`, async () => {
                try {
                    await service.getStory(`not existing Id`);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.equal(`Unable to find story with id 'not existing Id'`);
                }
            });
        });
    });

    describe(`with data in the database`, () => {
        let stories: Story[];
        let lines: Line[];

        beforeEach(async () => {
            stories = [];
            let user: User;
            let story: Story;
            [user, story, lines] = await seedDatabase(connection);
            stories.push(story);
            story = await seedStory(connection.createQueryRunner());
            stories.push(story);
        });

        describe(`getStory`, () => {
            it(`should throw BadRequestException if id is missing`, async () => {
                try {
                    await service.getStory(``);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.equal(`missing id parameter`);
                }
            });

            it(`should throw NotFoundException if id not found`, async () => {
                const id = faker.random.uuid();
                try {
                    await service.getStory(id);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.equal(`Unable to find story with id '${id}'`);
                }
            });

            it(`should the story with all it's lines`, async () => {
                const result = await service.getStory(stories[0].id);
                expect(result).to.be.instanceOf(Story);
                expect(result.id).to.equal(stories[0].id);
                expect(result.name).to.equal(stories[0].name);
                expect(result.lines).to.have.length(2);
                // we do care about order here!
                expect(result.lines[0].id).to.equal(lines[0].id);
                expect(result.lines[1].id).to.equal(lines[1].id);
            });
        });

        describe(`getAllStories`, () => {
            it(`should return all stories in the database`, async () => {
                const result = await service.getAllStories();
                expect(result).to.have.lengthOf(2);

                const firstStory = result[0];
                expect(firstStory).to.be.instanceof(Story);
                expect(firstStory.id).to.deep.equal(stories[0].id);
                expect(firstStory.name).to.deep.equal(stories[0].name);
                expect(firstStory.lines.length).to.equal(lines.length);

                const lineIds = firstStory.lines.map((l) => l.id);
                expect(lineIds).to.contain(lines[0].id);
                expect(lineIds).to.contain(lines[1].id);

                const secondStory = result[1];
                expect(secondStory).to.be.instanceof(Story);
                expect(secondStory.id).to.deep.equal(stories[1].id);
                expect(secondStory.name).to.deep.equal(stories[1].name);
                expect(secondStory.lines.length).to.equal(0);
            });
        });

        describe(`createStory`, () => {
            it(`should throw if no name was given`, async () => {
                try {
                    await service.createStory(``);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.equal(`missing name parameter`);
                }
            });

            it(`should return the newly created story`, async () => {
                const name = faker.lorem.words(5);
                const result = await service.createStory(name);
                expect(result).to.be.instanceOf(Story);
                expect(result.name).to.be.equal(name);
                // tslint:disable-next-line: no-unused-expression
                expect(result.lines).to.be.undefined;
            });
        });

        describe(`deleteStory`, () => {
            it(`should throw if no id was given`, async () => {
                try {
                    await service.deleteStory(``);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.equal(`missing id parameter`);
                }
            });

            it(`should throw if no such story found`, async () => {
                try {
                    await service.deleteStory(`not an id`);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.equal(`Unable to find story with id 'not an id'`);
                }
            });

            it(`should throw whe removed user still has lines`, async () => {
                try {
                    await service.deleteStory(stories[0].id);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(NotAllowedException);
                    expect(error.message).to.be.equal(`Can't delete story that has lines`);
                }
            });

            it(`should delete the story`, async () => {
                const result = await service.deleteStory(stories[1].id);
                // tslint:disable-next-line: no-unused-expression
                expect(result.id).to.be.undefined;
            });
        });

        describe(`resetStory`, () => {
            it(`should throw if no id was given`, async () => {
                try {
                    await service.resetStory(``);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.equal(`missing id parameter`);
                }
            });

            it(`should throw if no such story found`, async () => {
                try {
                    await service.resetStory(`not an id`);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.equal(`Unable to find story with id 'not an id'`);
                }
            });

            it(`should return the story without lines`, async () => {
                const result = await service.resetStory(stories[0].id);
                expect(result).to.be.instanceOf(Story);
                expect(result.name).to.be.equal(stories[0].name);
                // tslint:disable-next-line: no-unused-expression
                expect(result.lines).to.be.empty;

                const dbResult = await service.getStory(stories[0].id);
                expect(dbResult).to.be.instanceOf(Story);
                expect(dbResult.name).to.be.equal(stories[0].name);
                // tslint:disable-next-line: no-unused-expression
                expect(dbResult.lines).to.be.empty;
            });
        });

        describe(`updateStoryName`, () => {
            it(`should throw if no id was given`, async () => {
                try {
                    await service.updateStoryName(``, `new valid name`);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.equal(`missing id parameter`);
                }
            });

            it(`should throw if no new name was given`, async () => {
                try {
                    await service.updateStoryName(stories[0].id, ``);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.equal(`missing newName parameter`);
                }
            });

            it(`should throw if no such story found`, async () => {
                try {
                    await service.updateStoryName(`not an id`, `new valid name`);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.equal(`Unable to find story with id 'not an id'`);
                }
            });

            it(`should return the story with the new name`, async () => {
                const newName = faker.random.words(5);
                const result = await service.updateStoryName(stories[1].id, newName);
                expect(result).to.be.instanceOf(Story);
                expect(result.name).to.be.equal(newName);
                // tslint:disable-next-line: no-unused-expression
                expect(result.lines).to.be.empty;

                const dbResult = await service.getStory(stories[1].id);
                expect(dbResult).to.be.instanceOf(Story);
                expect(dbResult.name).to.be.equal(newName);
            });
        });
    });
});
