import express = require("express");
const db = require('./models/index');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const port = config.port || 80;

const app: express.Application = express();

(async () => {
    await db.sequelize.sync();
})();