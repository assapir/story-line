import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { DevlopementEnviorment } from "./consts";
import { Router } from "./router";

const env = process.env.NODE_ENV || DevlopementEnviorment;
const config = require(__dirname + `/../config/config.json`)[env];
const port = config.port || 80;

const app = express();

(async () => {
    const connection = await createConnection();
    Router.route(app, connection);
    app.listen(port);
})();
