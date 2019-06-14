import * as bodyParser from "body-parser";
import { Application, Router as expressRouter } from "express";
import { Connection } from "typeorm";
import ErrorHandlerController from "./controllers/errorHandlerController";
import LineController from "./controllers/lineController";
import Line from "./models/line";
import LineService from "./services/lineService";

export const prefix: string = `api`;
export const apiVersion: string = `v1`;

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

        ErrorHandlerController(app);
    }

    private static createLineController(connection: Connection, app: Application) {
        const lineRepository = connection.getRepository(Line);
        const lineService = new LineService(lineRepository);
        LineController(app, lineService);
    }
}
