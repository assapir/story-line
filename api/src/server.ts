import express, { Express } from "express";
import { Server } from "http";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { config } from "./consts";
import { Router } from "./router";

const port = config.port || 80;
export const app: Express = express(); // need for tests

export async function startServer(): Promise<Server> {
    console.log(`start server`);
    const connection = await createConnection();
    console.log(`route`);
    Router.route(app, connection);
    console.log(`listen`);
    return app.listen(port);
}
