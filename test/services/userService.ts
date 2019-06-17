import { assert, expect } from "chai";
import { after, before, beforeEach, describe, it } from "mocha";
import { Connection, createConnection, Repository } from "typeorm";
import BadRequestException from "../../src/exceptions/badRequestException";
import EntityConflictException from "../../src/exceptions/entityConflictException";
import NotFoundException from "../../src/exceptions/notFoundException";
import Line from "../../src/models/line";
import Story from "../../src/models/story";
import User from "../../src/models/user";
import UserService from "../../src/services/userService";
import { seedDatabase, seedUser } from "../testHelper";

describe(`UserService`, () => {
    let connection: Connection;
    let repository: Repository<User>;
    let service: UserService;

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
        repository = connection.getRepository(User);
        service = new UserService(repository);
    });

    describe(`without users in the database`, () => {
        describe(`getUser`, () => {
            it(`should throw NotFoundException`, async () => {
                try {
                    await service.getUser(`not existing Id`);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.equal(`Unable to find user with id 'not existing Id'`);
                }
            });
        });

        describe(`getAllUsers`, () => {
            it(`should throw NotFoundException`, async () => {
                try {
                    await service.getAllUsers();
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.equal(`No users found`);
                }
            });
        });
    });

    describe(`with users in the database`, () => {
        let users: User[];
        let lines: Line[];

        beforeEach(async () => {
            users = [];
            let user: User;
            let story: Story;
            [user, story, lines] = await seedDatabase(connection);
            users.push(user);
            user = await seedUser(connection.createQueryRunner());
            users.push(user);
        });

        describe(`getAllUsers`, () => {
            it(`should return all the users in the DB`, async () => {
                const result = await service.getAllUsers();
                expect(result).to.be.instanceOf(Array);
                expect(result.length).to.equal(2);

                const firstUser = result[0];
                expect(firstUser).to.be.instanceof(User);
                expect(firstUser.id).to.deep.equal(users[0].id);
                expect(firstUser.firstName).to.deep.equal(users[0].firstName);
                expect(firstUser.lastName).to.deep.equal(users[0].lastName);
                expect(firstUser.email).to.deep.equal(users[0].email);
                expect(firstUser.lines.length).to.equal(lines.length);
                const lineIds = firstUser.lines.map((l) => l.id);
                expect(lineIds).to.contain(lines[0].id);
                expect(lineIds).to.contain(lines[1].id);

                const secondUser = result[1];
                expect(secondUser).to.be.instanceof(User);
                expect(secondUser.id).to.deep.equal(users[1].id);
                expect(secondUser.firstName).to.deep.equal(users[1].firstName);
                expect(secondUser.lastName).to.deep.equal(users[1].lastName);
                expect(secondUser.email).to.deep.equal(users[1].email);
                expect(secondUser.lines.length).to.equal(0);
            });
        });

        describe(`getUser`, () => {
            it(`should throw if the 'id' parameter wasn't supplied`, async () => {
                try {
                    await service.getUser(``);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing id parameter`);
                }
            });

            it(`should throw if id is not in the DB`, async () => {
                try {
                    await service.getUser(`not-in-db-id`);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.be.equal(`Unable to find user with id 'not-in-db-id'`);
                }
            });

            it(`should return the correct user matching id parameter`, async () => {
                const result = await service.getUser(users[0].id);
                expect(result.id).to.equal(users[0].id);
                expect(result.firstName).to.equal(users[0].firstName);
                expect(result.lastName).to.equal(users[0].lastName);
                expect(result.email).to.equal(users[0].email);
                expect(result.lines.length).to.equal(2);
                const lineIds = result.lines.map((l) => l.id);
                expect(lineIds).to.contain(lines[0].id);
                expect(lineIds).to.contain(lines[1].id);
            });
        });

        describe(`createUser`, () => {
            it(`should throw if firstName is missing`, async () => {
                try {
                    await service.createUser(``, `niceName`, `email@email.com`);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing firstName parameter`);
                }
            });

            it(`should throw if lastName is missing`, async () => {
                try {
                    await service.createUser(`niceName`, ``, `email@email.com`);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing lastName parameter`);
                }
            });

            it(`should throw if email is missing`, async () => {
                try {
                    await service.createUser(`niceName`, `nice second name`, ``);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing email parameter`);
                }
            });

            it(`should throw if the email already in DB`, async () => {
                try {
                    await service.createUser(`niceName`, `nice second name`, users[0].email);
                    assert.fail(`the call above should throw`);
                } catch (error) {
                    expect(error).to.be.instanceOf(EntityConflictException);
                    expect(error.message).to.be.equal(`user with that email already exist`);
                }
            });
        });
    });
});
