import * as bodyParser from "body-parser";
import * as express from "express";
import { ErrorHandler } from "./controllers/errorHandler";

const prefix: string = "api";
const version: string = "1";

export class Router {
    public static route(app: express.Application): void {
        app.use(bodyParser.json({}));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(ErrorHandler.InternalError);
    }
}
