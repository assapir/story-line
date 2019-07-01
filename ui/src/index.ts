import express, { Express } from "express";
import config from "../config.json";

const env: string = process.env.NODE_ENV || `development`;
const port: number = config[env].port;
(function startServer() {
    const app: Express = express();
    app.listen(port);
})();
