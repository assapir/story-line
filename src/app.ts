import express from "express";
import { Router } from "./router";
const db = require("./models/index");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const port = config.port || 80;

const app = express();

(async () => {
    await db.sequelize.sync();
    Router.route(app, db);
    app.listen(port);
})();
