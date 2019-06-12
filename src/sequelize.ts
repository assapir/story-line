import * as fs from "fs";
import * as path from "path";
import {Op} from "sequelize";
import { Sequelize } from "sequelize-typescript";
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || `development`;
const config = require(__dirname + `/../config/config.json`)[env];
// const db: any = {};

// const sequelize: Sequelize = new Sequelize(config.database, config.username, config.password, config);

// db.sequelize = sequelize;

// module.exports = db;

export const sequelize = new Sequelize({
  database: `story-line`,
  dialect: config.dialect,
  models: [__dirname + `/models`],
  operatorsAliases: Op,
  storage: config.storage,
});
