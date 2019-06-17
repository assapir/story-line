import { Application, NextFunction, Request, Response, Router } from "express";
import HttpStatus from "http-status-codes";
import { usersPath } from "../consts";
import BadRequestException from "../exceptions/badRequestException";
import NotFoundException from "../exceptions/notFoundException";
import UserService from "../services/userService";
import { sendResult } from "./controllerUtils";

/**
 * Controller for /${prefix}/${apiVersion}/users
 *
 * @class UserController
 */
class UserController {

    private readonly _service: UserService;

    /**
     * Creates an instance of UserController.
     * @param {Application} app
     * @param {UserService} userService
     * @memberof UserController
     */
    constructor(app: Application, userService: UserService) {
        this.initializeRouter(app);
        this._service = userService;
    }

    /**
     * Route for GET /
     *
     */
    public async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allUsers = await this._service.getAllUsers();
            sendResult(res, { users: allUsers });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for GET /:id
     */
    public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const line = await this._service.getUser(req.params.id);
            sendResult(res, line);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for POST /
     */
    public async createNewUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const firstName = req.body.firstName;
            if (!firstName) {
                throw new BadRequestException(`firstName parameter missing`);
            }

            const lastName = req.body.lastName;
            if (!lastName) {
                throw new BadRequestException(`lastName parameter missing`);
            }

            const email = req.body.email;
            if (!email) {
                throw new BadRequestException(`email parameter missing`);
            }

            const result = await this._service.createUser(firstName, lastName, email);
            sendResult(res, result, HttpStatus.CREATED);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for DELETE /:id
     */
    public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = this._service.removeUser(req.params.id);
            sendResult(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for PUT /:id
     */
    public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = this._service.updateUser(req.params.id,
                                                        req.body.firstName,
                                                        req.body.lastName,
                                                        req.body.email);
            sendResult(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Route for GET /:id/lines
     */
    public async getAllUserLines(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const user = await this._service.getUser(id);
            if (!user) {
                throw new NotFoundException(`Unable to find user with id '${id}'`);
            }
            const lines = user.lines;
            if (lines.length === 0) {
                throw new NotFoundException(`No lines for user with id '${id}`);
            }
            sendResult(res, {lines});
        } catch (error) {
            next(error);
        }
    }

    private initializeRouter(app: Application): void {
        const router = Router();
        app.use(usersPath, router);
        router
            .get(`/`, (req, res, next) => this.getAllUsers(req, res, next))
            .get(`/:id`, (req, res, next) => this.getUser(req, res, next))
            .get(`/:id/lines`, (req, res, next) => this.getAllUserLines(req, res, next))
            .post(`/`, (req, res, next) => this.createNewUser(req, res, next))
            .delete(`/:id`, (req, res, next) => this.deleteUser(req, res, next))
            .put(`/:id`, (req, res, next) => this.updateUser(req, res, next));
    }
}

export default (app: Application, userService: UserService) => new UserController(app, userService);
