import * as bodyParser from "body-parser";
import { Application, Router as expressRouter } from "express";
import { Connection } from "typeorm";
import ErrorHandlerController from "./controllers/errorHandlerController";
import LineController from "./controllers/lineController";
import userController from "./controllers/userController";
import Line from "./models/line";
import User from "./models/user";
import LineService from "./services/lineService";
import UserService from "./services/userService";

export class Router {
    public static route(app: Application, connection: Connection): void {
        if (!app) {
            throw new Error(`App isn't initialized!`);
        }

        if (!connection) {
            throw new Error(`Database isn't initialized!`);
        }

        app.use(bodyParser.json({}));
        app.use(bodyParser.urlencoded({ extended: true }));
        Router.createLineController(connection, app);
        Router.createUserController(connection, app);

        ErrorHandlerController(app);
    }

    private static createLineController(connection: Connection, app: Application) {
        const lineRepository = connection.getRepository(Line);
        const lineService = new LineService(lineRepository);
        LineController(app, lineService);
    }

    private static createUserController(connection: Connection, app: Application) {
        const userRepository = connection.getRepository(User);
        const userService = new UserService(userRepository);
        userController(app, userService);
    }
}
