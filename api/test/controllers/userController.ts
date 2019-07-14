import { Arg, Substitute, SubstituteOf } from "@fluffy-spoon/substitute";
import bodyParser from "body-parser";
import { expect } from "chai";
import express, { Application } from "express";
import faker from "faker";
import { beforeEach, describe, it } from "mocha";
import supertest from "supertest";
import { usersPath } from "../../src/consts";
import ErrorHandlerController from "../../src/controllers/errorHandlerController";
import UserController from "../../src/controllers/userController";
import BadRequestException from "../../src/exceptions/badRequestException";
import NotFoundException from "../../src/exceptions/notFoundException";
import Line from "../../src/models/line";
import User, { IUser } from "../../src/models/user";
import UserService from "../../src/services/userService";

describe(`UserController`, () => {
    let request: supertest.SuperTest<supertest.Test>;
    let app: Application;
    let userService: SubstituteOf<UserService>;
    let user: User;

    const line = new Line();
    line.id = faker.random.uuid();
    const line1 = new Line();
    line1.id = faker.random.uuid();

    beforeEach(async () => {
        user = new User();
        user.id = faker.random.uuid();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email();
        user.password = faker.random.words();
        user.lines = [line, line1];

        userService = Substitute.for<UserService>();
        app = express();
        app.use(bodyParser.urlencoded({ extended: true }));
        UserController(app, userService);
        ErrorHandlerController(app);
        request = supertest(app);
    });

    describe(`GET /`, () => {
        it(`should call UserService.getAllUsers and return it as an array`, async () => {
            const user1 = new User();
            user1.id = faker.random.uuid();
            user1.firstName = faker.name.firstName();
            user1.lastName = faker.name.lastName();
            user1.email = faker.internet.email();

            userService.getAllUsers().returns(Promise.resolve([user, user1]));

            const result = await request.get(`${usersPath}/`);
            expect(result.status).to.equal(200);
            expect(result.type).to.equal(`application/json`);
            expect(result.body).to.have.property(`users`);
            expect(result.body.users).to.be.an.instanceof(Array);
            expect(result.body.users.length).to.equal(2);
            expect(result.body.users[0]).to.deep.equal({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                lines: [line, line1],
            });

            expect(result.body.users[1]).to.deep.equal({
                id: user1.id,
                firstName: user1.firstName,
                lastName: user1.lastName,
                email: user1.email,
            });
        });

        it(`should return error if error thrown in the service`, async () => {
            userService.getAllUsers().returns(Promise.reject(new NotFoundException(`No users found`)));

            const result = await request.get(`${usersPath}/`);
            expect(result.status).to.equal(404);
        });
    });

    describe('GET `/:id`', () => {
        it(`should call UserService.getUser and return the line`, async () => {
            userService.getUser(user.id).returns(Promise.resolve(user));

            const result = await request.get(`${usersPath}/${user.id}`)
                .type(`form`);
            expect(result.status).to.equal(200);
            expect(result.type).to.equal(`application/json`);
            expect(result.body).to.deep.equal({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                lines: [line, line1],
            });
        });

        it(`should return error if error thrown in the service`, async () => {
            userService.getUser(user.id)
                .returns(Promise.reject(new NotFoundException(`Unable to find user with id '${user.id}'`)));

            const result = await request.get(`${usersPath}/${user.id}`)
                .type(`form`);
            expect(result.status).to.equal(404);
            expect(result.body).to.deep.equal({ error: `Unable to find user with id '${user.id}'` });
        });
    });

    describe(`GET /:id/liens`, () => {
        it(`should return all user lines`, async () => {
            userService.getUser(user.id).returns(Promise.resolve(user));

            const result = await request.get(`${usersPath}/${user.id}/lines`)
                .type(`form`);
            expect(result.status).to.equal(200);
            expect(result.type).to.equal(`application/json`);
            expect(result.body.lines).to.deep.equal(user.lines);
        });

        it(`should return error if the user has no lines`, async () => {
            const user1 = new User();
            user1.id = faker.random.uuid();
            user1.firstName = faker.name.firstName();
            user1.lastName = faker.name.lastName();
            user1.email = faker.internet.email();
            user1.lines = [];

            userService.getUser(user1.id).returns(Promise.resolve(user1));
            const result = await request.get(`${usersPath}/${user1.id}/lines`)
                .type(`form`);
            expect(result.status).to.equal(404);
            expect(result.body.error).to.equal(`No lines for user with id '${user1.id}`);
        });

        it(`should return error if the user lines are undefined`, async () => {
            const user1 = new User();
            user1.id = faker.random.uuid();
            user1.firstName = faker.name.firstName();
            user1.lastName = faker.name.lastName();
            user1.email = faker.internet.email();

            userService.getUser(user1.id).returns(Promise.resolve(user1));
            const result = await request.get(`${usersPath}/${user1.id}/lines`)
                .type(`form`);
            expect(result.status).to.equal(404);
            expect(result.body.error).to.equal(`No lines for user with id '${user1.id}`);
        });

        it(`should return error if error thrown in the service`, async () => {
            userService.getUser(user.id)
                .returns(Promise.reject(new NotFoundException(`Unable to find user with id '${user.id}'`)));

            const result = await request.get(`${usersPath}/${user.id}/lines`)
                .type(`form`);
            expect(result.status).to.equal(404);
            expect(result.body).to.deep.equal({ error: `Unable to find user with id '${user.id}'` });
        });
    });

    describe(`POST /`, () => {
        describe(`should handle missing parameters`, () => {
            it(`should throw if firstName is missing`, async () => {
                const result = await request
                    .post(`${usersPath}/`)
                    .type(`form`)
                    .send({
                        lastName: user.lastName,
                        email: user.email,
                        password: user.password,
                    });

                expect(result.status).to.equal(400);
                expect(result.body.error).to.equal(`firstName parameter missing`);
            });

            it(`should throw if lastName is missing`, async () => {
                const result = await request
                    .post(`${usersPath}/`)
                    .type(`form`)
                    .send({
                        firstName: user.firstName,
                        email: user.email,
                        password: user.password,
                    });

                expect(result.status).to.equal(400);
                expect(result.body.error).to.equal(`lastName parameter missing`);
            });

            it(`should throw if email is missing`, async () => {
                const result = await request
                    .post(`${usersPath}/`)
                    .type(`form`)
                    .send({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        password: user.password,
                    });

                expect(result.status).to.equal(400);
                expect(result.body.error).to.equal(`email parameter missing`);
            });

            it(`should throw if password is missing`, async () => {
                const result = await request
                    .post(`${usersPath}/`)
                    .type(`form`)
                    .send({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                    });

                expect(result.status).to.equal(400);
                expect(result.body.error).to.equal(`password parameter missing`);
            });
        });

        it(`should call UserService.createUser and return the created user`, async () => {
            const user1 = new User();
            user1.id = faker.random.uuid();
            user1.firstName = faker.name.firstName();
            user1.lastName = faker.name.lastName();
            user1.email = faker.internet.email();

            userService.createUser(Arg.is((iUser) => iUser), `password`)
                .returns(Promise.resolve(user1));

            const result = await request
                .post(`${usersPath}/`)
                .type(`form`)
                .send({
                    firstName: user1.firstName,
                    lastName: user1.lastName,
                    email: user1.email,
                    password: `password`,
                });

            expect(result.status).to.equal(201);
            expect(result.type).to.equal(`application/json`);
            expect(result.body).to.deep.equal({
                id: user1.id,
                firstName: user1.firstName,
                lastName: user1.lastName,
                email: user1.email,
            });
        });

        it(`should return error if error thrown in the service`, async () => {
            userService.createUser(Arg.is((iUser) => iUser), `password`)
                .returns(Promise.reject(new BadRequestException(`missing firstName parameter`)));

            const result = await request.post(`${usersPath}/`).type(`form`).send({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: `password`,
            });
            expect(result.status).to.equal(400);
            expect(result.body).to.deep.equal({ error: `missing firstName parameter` });
        });
    });

    describe(`DELETE /:id`, () => {
        it(`should call UserService.removeUser and return the user`, async () => {
            const user1 = new User();
            user1.id = faker.random.uuid();
            user1.firstName = faker.name.firstName();
            user1.lastName = faker.name.lastName();
            user1.email = faker.internet.email();

            userService.removeUser(user1.id).returns(Promise.resolve(user1));

            const result = await request.delete(`${usersPath}/${user1.id}`)
                .type(`form`);
            expect(result.status).to.equal(200);
            expect(result.type).to.equal(`application/json`);
            expect(result.body).to.deep.equal({
                id: user1.id,
                firstName: user1.firstName,
                lastName: user1.lastName,
                email: user1.email,
            });
        });

        it(`should return error if error thrown in the service`, async () => {
            userService.removeUser(user.id)
                .returns(Promise.reject(new NotFoundException(`Unable to find line with id '${user.id}'`)));

            const result = await request.delete(`${usersPath}/${user.id}`)
                .type(`form`);
            expect(result.status).to.equal(404);
            expect(result.body).to.deep.equal({ error: `Unable to find line with id '${user.id}'` });
        });
    });

    describe('PUT `/:id`', () => {
        it(`should call UserService.updateUser and return the user`, async () => {
            const newFirstName = faker.name.firstName();
            const newLastName = faker.name.lastName();
            const newEmail = faker.internet.email();
            userService.updateUser(user.id, newFirstName, newLastName, newEmail)
                .returns(Promise.resolve({
                    id: user.id,
                    firstName: newFirstName,
                    lastName: newLastName,
                    email: newEmail,
                } as User));

            const result = await request.put(`${usersPath}/${user.id}`)
                .type(`form`)
                .send({
                    firstName: newFirstName,
                    lastName: newLastName,
                    email: newEmail,
                });
            expect(result.status).to.equal(200);
            expect(result.type).to.equal(`application/json`);
            expect(result.body.id).to.equal(user.id);
            expect(result.body.firstName).to.equal(newFirstName);
            expect(result.body.lastName).to.equal(newLastName);
            expect(result.body.email).to.equal(newEmail);
        });

        it(`should return error if error thrown in the service`, async () => {
            userService.updateUser(user.id, ``, ``, ``)
                .returns(Promise.reject(new BadRequestException(`no parameters to update`)));

            const result = await request.put(`${usersPath}/${user.id}`)
                .type(`form`)
                .send({
                    firstName: ``,
                    lastName: ``,
                    email: ``,
                });
            expect(result.status).to.equal(400);
            expect(result.body).to.deep.equal({ error: `no parameters to update` });
        });
    });
});
