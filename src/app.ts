import express from "express";
import { DevlopementEnviorment } from "./consts";
import { Router } from "./router";
import { sequelize } from "./sequelize";
const env = process.env.NODE_ENV || DevlopementEnviorment;
const config = require(__dirname + `/../config/config.json`)[env];
const port = config.port || 80;

const app = express();

(async () => {
    await sequelize.sync();
    Router.route(app);
    app.listen(port);
})();
