import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { config } from "./consts";
import { Router } from "./router";

const port = config.port || 80;
export const app = express(); // need for tests

async function startServer() {
    const connection = await createConnection();
    Router.route(app, connection);
    app.listen(port);
}

startServer();
