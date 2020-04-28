import express, { Express } from "express";
import { Server } from "http";
import ip from "ip";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { config } from "./consts";
import { Router } from "./router";

const port = process.env.PORT || config.port || 80;
export const app: Express = express(); // need for tests

// Needed for handeling ctrl+c in docker (because of PID 1)
process.on(`SIGINT` , () => {
    console.log(`Caught SIGINT signal`);
    process.exit(1);
});

export async function startServer(): Promise<Server> {
    const connection = await createConnection();
    Router.route(app, connection);
    console.log(`Starting listening on ${ip.address()}:${port}`);
    return app.listen(port);
}
