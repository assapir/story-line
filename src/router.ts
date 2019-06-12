import * as bodyParser from "body-parser";
import * as express from "express";
import { Connection } from "typeorm";
import { ErrorHandlerController } from "./controllers/errorHandlerController";
import { lineRoute } from "./controllers/lineController";

const prefix: string = `api`;
const apiVersion: string = `1`;

export class Router {
    public static route(app: express.Application, connection: Connection): void {
        if (!app) {
            throw new Error(`App isn't intialized!`);
        }

        if (!connection) {
            throw new Error(`Database isn't intialized!`);
        }

        app.use(bodyParser.json({}));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(`/${prefix}/${apiVersion}/line`, lineRoute(connection));
        app.use(ErrorHandlerController.InternalError);
    }
}
