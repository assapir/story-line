import express, { Express } from "express";
import { Server } from "http";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { config } from "./consts";
import { Router } from "./router";

const port = config.port || 80;
export const app: Express = express(); // need for tests
export let server: Server;

export async function startServer() {
    const connection = await createConnection();
    Router.route(app, connection);
    server = app.listen(port);
}
