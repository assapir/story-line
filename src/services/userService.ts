import { validate } from "class-validator";
import { QueryFailedError, Repository } from "typeorm";
import BadRequestException from "../exceptions/badRequestException";
import EntityConflictException from "../exceptions/entityConflictException";
import NotFoundException from "../exceptions/notFoundException";
import User from "../models/user";

export default class UserService {

    private readonly _repository: Repository<User>;

    constructor(repository: Repository<User>) {
        this._repository = repository;
    }

    public async getUser(id: string): Promise<User> {
        if (!id) {
            throw new BadRequestException(`missing id parameter`);
        }

        const user = await this._repository.findOne(id);
        if (!user) {
            throw new NotFoundException(`Unable to find user with id '${id}'`);
        }

        return user;
    }

    public async getAllUsers(): Promise<User[]> {
        const users = await this._repository.find();
        if (!users || users.length === 0) {
            throw new NotFoundException(`No users found`);
        }

        return users;
    }

    public async createUser(firstName: string, lastName: string, email: string): Promise<User> {
        if (!firstName) {
            throw new BadRequestException(`missing firstName parameter`);
        }

        if (!lastName) {
            throw new BadRequestException(`missing lastName parameter`);
        }

        if (!email) {
            throw new BadRequestException(`missing email parameter`);
        }

        try {
            const user = new User();
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            const errors = await validate(user);
            if (errors.length > 0) {
                throw new BadRequestException(`validation errors: illegal email`);
            }
            const result = await this._repository.save(user);
            return result;
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new EntityConflictException(`user with that email already exist`);
            }

            throw error;
        }
    }

    public async removeUser(id: string): Promise<User> {
        if (!id) {
            throw new BadRequestException(`missing id parameter`);
        }
        const user = await this._repository.findOne(id);
        if (!user) {
            throw new NotFoundException(`Unable to find user with id '${id}'`);
        }
        const result = await this._repository.remove(user);
        return result;
    }

    public async updateUser(id: string, firstName: string, lastName: string, email: string): Promise<User> {
        if (!id) {
            throw new BadRequestException(`missing id parameter`);
        }

        if (!firstName && !lastName && !email) {
            throw new BadRequestException(`no parameters to update`);
        }

        const user = await this._repository.findOne(id);
        if (!user) {
            throw new NotFoundException(`Unable to find user with id '${id}'`);
        }

        if (email) {
            const emailUser = await this._repository.findOne({ where: { email } });
            if (emailUser) {
                throw new EntityConflictException(`user with that email already exist`);
            }
            user.email = email;
        }

        if (firstName) {
            user.firstName = firstName;
        }

        if (lastName) {
            user.lastName = lastName;
        }

        const result = await this._repository.save(user);
        return result;
    }
}
