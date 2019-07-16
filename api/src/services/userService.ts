import { QueryFailedError, Repository } from "typeorm";
import validator from "validator";
import BadRequestException from "../exceptions/badRequestException";
import EntityConflictException from "../exceptions/entityConflictException";
import NotAllowedException from "../exceptions/notAllowedException";
import NotFoundException from "../exceptions/notFoundException";
import User, { IUser, Role } from "../models/user";
import CryptoService from "./cryptoService";

export default class UserService {
    private readonly _repository: Repository<User>;
    private returnSelect: Array<keyof User> = [`id`, `firstName`, `lastName`, `email`, `role`];

    constructor(repository: Repository<User>) {
        this._repository = repository;
    }

    public async getUser(id: string): Promise<User> {
        if (!id) {
            throw new BadRequestException(`missing id parameter`);
        }

        const user = await this._repository.findOne(id, {
            select: this.returnSelect,
            relations: [`lines`],
        });
        if (!user) {
            throw new NotFoundException(`Unable to find user with id '${id}'`);
        }

        return user;
    }

    public async getUserByEmail(email: string): Promise<User> {
        if (!email) {
            throw new BadRequestException(`missing email parameter`);
        }
        const user = await this._repository.findOne({
            select: this.returnSelect,
            where: { email },
            relations: [`lines`],
        });
        if (!user) {
            throw new NotFoundException(`Unable to find user with email '${email}'`);
        }

        return user;
    }

    public async getAllUsers(): Promise<User[]> {
        const users = await this._repository.find({
            select: this.returnSelect,
            relations: [`lines`],
         });
        if (!users || users.length === 0) {
            throw new NotFoundException(`No users found`);
        }

        return users;
    }

    public async createUser(user: IUser, password: string): Promise<User> {
        try {
            if (!user.firstName) {
                throw new BadRequestException(`missing firstName parameter`);
            }

            if (!user.lastName) {
                throw new BadRequestException(`missing lastName parameter`);
            }

            if (!user.email) {
                throw new BadRequestException(`missing email parameter`);
            }
            const isEmail = await validator.isEmail(user.email);
            if (!isEmail) {
                throw new BadRequestException(`validation errors: illegal email '${user.email}'`);
            }

            if (!password) {
                throw new BadRequestException(`missing password parameter`);
            }

            const actualUser = new User(); // copy to concrete object
            actualUser.firstName = user.firstName;
            actualUser.lastName = user.lastName;
            actualUser.email = user.email;
            await actualUser.createOrUpdatePassword(password);

            const result = await this._repository.save(actualUser);
            delete result.password; // make sure to do not return the password
            return result;
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new EntityConflictException(`user with that email already exist`);
            }

            throw error;
        }
    }

    public async removeUser(id: string): Promise<User> {
        try {
            if (!id) {
                throw new BadRequestException(`missing id parameter`);
            }
            const user = await this._repository.findOne(id, {
                select: this.returnSelect,
                relations: [`lines`],
            });
            if (!user) {
                throw new NotFoundException(`Unable to find user with id '${id}'`);
            }
            const result = await this._repository.remove(user);
            return result;
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new NotAllowedException(`Can't delete user that has lines`);
            }
            throw error;
        }
    }

    public async updateUser(
        id: string,
        firstName?: string,
        lastName?: string,
        email?: string,
        role?: Role,
    ): Promise<User> {
        if (!id) {
            throw new BadRequestException(`missing id parameter`);
        }

        if (!firstName && !lastName && !email && !role) {
            throw new BadRequestException(`no parameters to update`);
        }

        const user = await this._repository.findOne(id, {
            select: this.returnSelect,
            relations: [`lines`],
        });
        if (!user) {
            throw new NotFoundException(`Unable to find user with id '${id}'`);
        }

        if (email) {
            const emailUser = await this._repository.findOne({ where: { email } });
            if (emailUser) {
                throw new EntityConflictException(`user with that email already exist`);
            }
            const isEmail = await validator.isEmail(email);
            if (!isEmail) {
                throw new BadRequestException(`validation errors: illegal email '${email}'`);
            }
            user.email = email;
        }

        if (firstName) {
            user.firstName = firstName;
        }

        if (lastName) {
            user.lastName = lastName;
        }

        if (role) {
            user.role = role;
        }

        const result = await this._repository.save(user);
        return result;
    }
}
