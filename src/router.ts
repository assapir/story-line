import * as bodyParser from "body-parser";
import { Application, Router as expressRouter } from "express";
import { Connection } from "typeorm";
import ErrorHandlerController from "./controllers/errorHandlerController";
import LineController from "./controllers/lineController";
import Line from "./models/line";

const prefix: string = `api`;
const apiVersion: string = `1`;

export class Router {
    public static route(app: Application, connection: Connection): void {
        if (!app) {
            throw new Error(`App isn't intialized!`);
        }

        if (!connection) {
            throw new Error(`Database isn't intialized!`);
        }

        app.use(bodyParser.json({}));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(`/${prefix}/${apiVersion}/line`, Router.lineRoute(connection));
        app.use(ErrorHandlerController.InternalError);
    }

    private static lineRoute(connection: Connection) {
        LineController.repository = connection.getRepository(Line);
        const router = expressRouter();
        return router
            .get(`/`, LineController.getAllLines)
            .get(`/:id`, LineController.getLine)
            .post(`/`, LineController.createNewLine)
            .delete(`:id`, LineController.deleteLine);
    }
}
