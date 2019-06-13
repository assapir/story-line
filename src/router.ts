import * as bodyParser from "body-parser";
import { Application, Router as expressRouter } from "express";
import { Connection } from "typeorm";
import ErrorHandlerController from "./controllers/errorHandlerController";
import LineController from "./controllers/lineController";
import Line from "./models/line";

const prefix: string = `api`;
const apiVersion: string = `v1`;

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
        app.use(`/${prefix}/${apiVersion}/lines`, Router.linesRoute(connection));
        app.use(ErrorHandlerController.InternalError);
    }

    private static linesRoute(connection: Connection) {
        const lineController = LineController(connection.getRepository(Line));
        const router = expressRouter();
        return router
            .get(`/`, (req, res, next) => lineController.getAllLines(req, res, next))
            .get(`/:id`, (req, res, next) => lineController.getLine(req, res, next))
            .post(`/`, (req, res, next) => lineController.createNewLine(req, res, next))
            .delete(`/:id`, (req, res, next) => lineController.deleteLine(req, res, next))
            .put(`/:id`, (req, res, next) => lineController.updateLine(req, res, next));
    }
}
