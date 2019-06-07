import * as bodyParser from "body-parser";
import * as express from "express";

const prefix: string = "api";
const version: string = "1";

export class Router {
    public static route(app: express.Application, db: any): void {
        app.use(bodyParser.json({}));
        app.use(bodyParser.urlencoded());
        // app.use(`/${prefix}/${version}`);
    }
}
