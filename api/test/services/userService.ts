import { expect } from "chai";
import faker from "faker";
import { after, before, beforeEach, describe, it } from "mocha";
import { Connection, createConnection, Repository } from "typeorm";
import BadRequestException from "../../src/exceptions/badRequestException";
import EntityConflictException from "../../src/exceptions/entityConflictException";
import NotAllowedException from "../../src/exceptions/notAllowedException";
import NotFoundException from "../../src/exceptions/notFoundException";
import Line from "../../src/models/line";
import Story from "../../src/models/story";
import User, { IUser } from "../../src/models/user";
import UserService from "../../src/services/userService";
import { failIfReached, seedDatabase, seedUser } from "../testHelper";

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
                    failIfReached();
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
                    failIfReached();
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
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing id parameter`);
                }
            });

            it(`should throw if id is not in the DB`, async () => {
                try {
                    await service.getUser(`not-in-db-id`);
                    failIfReached();
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
                    const user = {
                        firstName: ``,
                        lastName: `niceName`,
                        email: `email@email.com`,
                    };

                    await service.createUser(user, `password`);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing firstName parameter`);
                }
            });

            it(`should throw if lastName is missing`, async () => {
                try {
                    const user = {
                        firstName: `niceName`,
                        lastName: ``,
                        email: `email@email.com`,
                    };
                    await service.createUser(user, `password`);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing lastName parameter`);
                }
            });

            it(`should throw if email is missing`, async () => {
                try {
                    const user = {
                        firstName: `niceName`,
                        lastName: `nice second name`,
                        email: ``,
                    };
                    await service.createUser(user, `password`);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing email parameter`);
                }
            });

            it(`should throw if password is missing`, async () => {
                try {
                    const user = {
                        firstName: `niceName`,
                        lastName: `nice second name`,
                        email: `email@email.com`,
                    };
                    await service.createUser(user, ``);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing password parameter`);
                }
            });

            it(`should throw if the email already in DB`, async () => {
                try {
                    const user = {
                        firstName: `niceName`,
                        lastName: `nice second name`,
                        email: users[0].email,
                    };

                    await service.createUser(user, `password`);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(EntityConflictException);
                    expect(error.message).to.be.equal(`user with that email already exist`);
                }
            });

            it(`should throw if the email isn't valid email`, async () => {
                try {
                    const user = {
                        firstName: `niceName`,
                        lastName: `nice second name`,
                        email: `not-an-email`,
                    };

                    await service.createUser(user, `password`);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`validation errors: illegal email 'not-an-email'`);
                }
            });

            it(`should create a new user in the db DB`, async () => {
                const user: IUser = {
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    email: faker.internet.email(``),
                };

                const result = await service.createUser(user, `password`);
                expect(result.firstName).to.equal(user.firstName);
                expect(result.lastName).to.equal(user.lastName);
                expect(result.email).to.equal(user.email);
            });
        });

        describe(`removeUser`, () => {
            it(`should throw if the 'id' parameter wasn't supplied`, async () => {
                try {
                    await service.removeUser(``);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing id parameter`);
                }
            });

            it(`should throw if id is not in the DB`, async () => {
                try {
                    await service.removeUser(`not-in-db-id`);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.be.equal(`Unable to find user with id 'not-in-db-id'`);
                }
            });

            it(`should throw whe removed user still has lines`, async () => {
                try {
                    await service.removeUser(users[0].id);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(NotAllowedException);
                    expect(error.message).to.be.equal(`Can't delete user that has lines`);
                }
            });

            it(`should remove the user`, async () => {
                const result = await service.removeUser(users[1].id);
                // tslint:disable-next-line: no-unused-expression
                expect(result.id).to.be.undefined;
            });
        });

        describe(`updateUser`, () => {
            it(`should throw if the 'id' parameter wasn't supplied`, async () => {
                try {
                    await service.updateUser(``,
                        faker.name.firstName(),
                        faker.name.lastName(),
                        faker.internet.email());
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`missing id parameter`);
                }
            });

            it(`should throw if no parameters to update was passed`, async () => {
                try {
                    await service.updateUser(users[0].id, ``, ``, ``);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`no parameters to update`);
                }
            });

            it(`should throw if the user id doesn't exist`, async () => {
                try {
                    await service.updateUser(`not real id`,
                        faker.name.firstName(),
                        faker.name.lastName(),
                        faker.internet.email());
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(NotFoundException);
                    expect(error.message).to.be.equal(`Unable to find user with id 'not real id'`);
                }
            });

            it(`should throw if the email already used by other user`, async () => {
                try {
                    await service.updateUser(users[0].id,
                        faker.name.firstName(),
                        faker.name.lastName(),
                        users[1].email);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(EntityConflictException);
                    expect(error.message).to.be.equal(`user with that email already exist`);
                }
            });

            it(`should throw if the email is not a valid email`, async () => {
                try {
                    await service.updateUser(users[0].id,
                        faker.name.firstName(),
                        faker.name.lastName(),
                        `not-an-email`);
                    failIfReached();
                } catch (error) {
                    expect(error).to.be.instanceOf(BadRequestException);
                    expect(error.message).to.be.equal(`validation errors: illegal email 'not-an-email'`);
                }
            });

            it(`should update the user with the all passed parameters`, async () => {
                const firstName = faker.name.firstName();
                const lastName = faker.name.lastName();
                const email = faker.internet.email();
                const result = await service.updateUser(users[0].id,
                                                        firstName,
                                                        lastName,
                                                        email);

                expect(result.id).to.equal(users[0].id);
                expect(result.firstName).to.equal(firstName);
                expect(result.lastName).to.equal(lastName);
                expect(result.email).to.equal(email);
                expect(result.lines.length).to.equal(2);
            });

            it(`should update only the firstName parameter`, async () => {
                const firstName = faker.name.firstName();
                const result = await service.updateUser(users[0].id, firstName, ``, ``);

                expect(result.id).to.equal(users[0].id);
                expect(result.firstName).to.equal(firstName);
                expect(result.lastName).to.equal(users[0].lastName);
                expect(result.email).to.equal(users[0].email);
                expect(result.lines.length).to.equal(2);
            });

            it(`should update only the lastName parameter`, async () => {
                const lastName = faker.name.lastName();
                const result = await service.updateUser(users[0].id, ``, lastName, ``);

                expect(result.id).to.equal(users[0].id);
                expect(result.firstName).to.equal(users[0].firstName);
                expect(result.lastName).to.equal(lastName);
                expect(result.email).to.equal(users[0].email);
                expect(result.lines.length).to.equal(2);
            });

            it(`should update only the email parameter`, async () => {
                const email = faker.internet.email(undefined, undefined, `microsoft.com`);
                const result = await service.updateUser(users[0].id, ``, ``, email);

                expect(result.id).to.equal(users[0].id);
                expect(result.firstName).to.equal(users[0].firstName);
                expect(result.lastName).to.equal(users[0].lastName);
                expect(result.email).to.equal(email);
                expect(result.lines.length).to.equal(2);
            });
        });
    });
});
